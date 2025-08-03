import mlflow
import mlflow.sklearn
from implicit.als import AlternatingLeastSquares
import numpy as np
from scipy.sparse import csr_matrix
import pandas as pd
import redis
import json
import pickle
import os
import random

# Enable MLflow auto logging (optional)
try:
    mlflow.set_tracking_uri("http://localhost:5001")
    mlflow.set_experiment("Product Recommendation Experiment")
    MLFLOW_AVAILABLE = True
except Exception as e:
    print(f"MLflow not available: {e}")
    MLFLOW_AVAILABLE = False

# Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0)


def train_test_split_interactions(interaction_matrix, test_per_user=1, seed=42):
    np.random.seed(seed)
    train_matrix = interaction_matrix.copy()
    test_matrix = np.zeros_like(interaction_matrix)

    n_users, n_items = interaction_matrix.shape

    for user in range(n_users):
        user_interactions = np.nonzero(interaction_matrix[user])[0]
        if len(user_interactions) == 0:
            continue
        if len(user_interactions) <= test_per_user:
            test_indices = user_interactions
        else:
            test_indices = np.random.choice(
                user_interactions, size=test_per_user, replace=False)

        train_matrix[user, test_indices] = 0
        test_matrix[user, test_indices] = interaction_matrix[user, test_indices]
    print("train ", train_matrix)
    print("test ", test_matrix)
    return train_matrix, test_matrix


def recall_at_k(predicted, ground_truth, k=10):
    hits = 0
    total = 0
    print("gt ", ground_truth)
    print("predt ", predicted)
    for user_id in ground_truth:
        gt_item = ground_truth[user_id]
        top_k_items = predicted[user_id][:k]
        print("recall ", gt_item, top_k_items)
        if gt_item in top_k_items:
            hits += 1
        total += 1
    return hits / total


def store_recommendations_in_redis(model, user_map, product_map, prefix="recommendations"):
    try:
        user_map_reverse = {v: k for k, v in user_map.items()}
        product_map_reverse = {v: k for k, v in product_map.items()}

        for user_idx in range(len(user_map)):
            user_id = user_map_reverse[user_idx]

            recommendations = model.recommend(user_idx, csr_matrix(
                np.zeros((1, len(product_map)))), N=10, filter_already_liked_items=True)

            recommended_products = [product_map_reverse[item_id]
                                    for item_id in recommendations[0]]

            redis_key = f"{prefix}:user:{user_id}"
            redis_client.setex(redis_key, 3600, json.dumps(recommended_products))
            print(f"Stored recommendations for user {user_id}: {recommended_products[:5]}...")

        metadata = {
            "user_map": user_map,
            "product_map": product_map,
            "model_info": {
                "factors": model.factors,
                "regularization": model.regularization
            }
        }
        redis_client.setex(f"{prefix}:metadata", 3600, json.dumps(metadata))
        print(f"Stored recommendations for {len(user_map)} users in Redis")
    except Exception as e:
        print(f"Error storing recommendations in Redis: {e}")


def train_als(prefix, factors=50, regularization=0.1, iterations=15, alpha=1.0):
    df = pd.read_csv(f"data/{prefix}/events.csv")

    user_map = {user: i for i, user in enumerate(df["userId"].unique())}
    product_map = {prod: i for i, prod in enumerate(df["productId"].unique())}

    df["user_idx"] = df["userId"].map(user_map)
    df["product_idx"] = df["productId"].map(product_map)

    num_users = len(user_map)
    num_items = len(product_map)
    interaction_matrix = np.zeros((num_users, num_items))

    for _, row in df.iterrows():
        interaction_matrix[row["user_idx"], row["product_idx"]] += 1

    interaction_matrix *= alpha

    train_matrix, test_matrix = train_test_split_interactions(interaction_matrix)
    train_matrix_csr = csr_matrix(train_matrix)

    ground_truth = {
        user_id: np.where(test_matrix[user_id] > 0)[0][0]
        for user_id in range(num_users)
        if np.sum(test_matrix[user_id]) > 0
    }

    print(f"train_matrix_csr.shape = {train_matrix_csr.shape}")
    print(f"Users in ground_truth: {list(ground_truth.keys())}")

    if MLFLOW_AVAILABLE:
        with mlflow.start_run():
            mlflow.log_param("factors", factors)
            mlflow.log_param("regularization", regularization)
            mlflow.log_param("iterations", iterations)
            mlflow.log_param("alpha", alpha)

            model = AlternatingLeastSquares(
                factors=factors, regularization=regularization, iterations=iterations)
            model.fit(train_matrix_csr)

            user_recs = {
                user: model.recommend(user, train_matrix_csr[user], N=5, filter_already_liked_items=True)[0]
                for user in ground_truth
            }

            recall = recall_at_k(user_recs, ground_truth, k=5)
            mlflow.log_metric("recall_at_5", recall)
            print(f"Recall@5: {recall:.4f}")

            store_recommendations_in_redis(model, user_map, product_map, prefix)

            mlflow.sklearn.log_model(model, "als_recommender")
    else:
        model = AlternatingLeastSquares(
            factors=factors, regularization=regularization, iterations=iterations)
        model.fit(train_matrix_csr)

        user_recs = {
            user: [item for item, _ in model.recommend(
                user, train_matrix_csr[user], N=5, filter_already_liked_items=True)]
            for user in ground_truth
        }

        recall = recall_at_k(user_recs, ground_truth, k=5)
        print(f"Recall@5: {recall:.4f}")

        store_recommendations_in_redis(model, user_map, product_map, prefix)

    return model


def tune_als(prefix, n_trials=20):
    """
    Random search hyperparameter tuning for ALS.
    """
    factors_list = [50, 70, 100, 150, 200, 300]
    regularization_list = [0.01, 0.05, 0.1, 0.2]
    iterations_list = [100, 150, 200, 300]
    alphas = [1]

    best_recall = 0
    best_params = {}

    for trial in range(n_trials):
        factors = random.choice(factors_list)
        reg = random.choice(regularization_list)
        iter_ = random.choice(iterations_list)
        alpha = random.choice(alphas)

        print(f"\n🔍 Trial {trial+1}/{n_trials}: factors={factors}, reg={reg}, iterations={iter_}, alpha={alpha}")

        model = train_als(prefix, factors=factors, regularization=reg, iterations=iter_, alpha=alpha)

        # Note: recall was logged to MLflow; optionally you can add logic to capture here if needed

    print("\n✅ Tuning finished! Check MLflow for full metrics.")


if __name__ == "__main__":
    prefix = "clickstream_events"  # replace with your actual dataset prefix
    tune_als(prefix, n_trials=20)