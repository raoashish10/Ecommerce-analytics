import mlflow
import mlflow.sklearn
from implicit.als import AlternatingLeastSquares
import numpy as np
from scipy.sparse import csr_matrix
import pandas as pd

# Enable MLflow auto logging
mlflow.set_tracking_uri("http://localhost:5001")  # Change if using remote MLflow server
mlflow.set_experiment("Product Recommendation Experiment")

import numpy as np

def train_test_split_interactions(interaction_matrix, test_per_user=1, seed=42):
    """
    Splits the interaction matrix into training and test sets using leave-one-out (or leave-n-out).
    
    Parameters:
      - interaction_matrix: np.array of shape (n_users, n_items)
      - test_per_user: Number of interactions to hold out per user.
      - seed: For reproducibility.
    
    Returns:
      - train_matrix: Same shape as interaction_matrix, with test interactions zeroed out.
      - test_matrix: Same shape as interaction_matrix, containing the held-out interactions.
    """
    np.random.seed(seed)
    train_matrix = interaction_matrix.copy()
    test_matrix = np.zeros_like(interaction_matrix)

    n_users, n_items = interaction_matrix.shape
    
    for user in range(n_users):
        # Find indices where the user has an interaction.
        user_interactions = np.nonzero(interaction_matrix[user])[0]
        if len(user_interactions) == 0:
            continue
        # Select test_per_user interactions at random
        if len(user_interactions) <= test_per_user:
            test_indices = user_interactions
        else:
            test_indices = np.random.choice(user_interactions, size=test_per_user, replace=False)
        
        # Remove these interactions from the training matrix and add them to the test set.
        train_matrix[user, test_indices] = 0
        test_matrix[user, test_indices] = interaction_matrix[user, test_indices]
    print("train ",train_matrix)
    print("test ", test_matrix)
    return train_matrix, test_matrix

def recall_at_k(predicted, ground_truth, k=10):
    hits = 0
    total = 0
    print("gt ",ground_truth)
    print("predt ",predicted)
    for user_id in ground_truth:
        gt_item = ground_truth[user_id]
        top_k_items = predicted[user_id][:k]
        print("recall ",gt_item, top_k_items)
        if gt_item in top_k_items[0]:
            hits += 1
        total += 1
    return hits / total


def train_als(prefix, factors=50, regularization=0.1):
    # Load Data
    df = pd.read_csv(f"data/{prefix}/events.csv")

    # Encode user and product IDs
    user_map = {user: i for i, user in enumerate(df["userId"].unique())}
    product_map = {prod: i for i, prod in enumerate(df["productId"].unique())}

    df["user_idx"] = df["userId"].map(user_map)
    df["product_idx"] = df["productId"].map(product_map)

    num_users = len(user_map)
    num_items = len(product_map)
    interaction_matrix = np.zeros((num_users, num_items))

    for _, row in df.iterrows():
        interaction_matrix[row["user_idx"], row["product_idx"]] += 1

    # Train/test split
    train_matrix, test_matrix = train_test_split_interactions(interaction_matrix)
    train_matrix_csr = csr_matrix(train_matrix)

    # Ground truth from test_matrix
    ground_truth = {
        user_id: np.where(test_matrix[user_id] > 0)[0][0]
        for user_id in range(num_users)
        if np.sum(test_matrix[user_id]) > 0
    }

    with mlflow.start_run():
        mlflow.log_param("factors", factors)
        mlflow.log_param("regularization", regularization)

        print(f"train_matrix_csr.shape = {train_matrix_csr.shape}")
        print(f"Users in ground_truth: {list(ground_truth.keys())}")


        model = AlternatingLeastSquares(factors=factors, regularization=regularization)
        model.fit(train_matrix_csr)

        print(ground_truth)
        print(train_matrix_csr)
        # Predictions
        user_recs = {
            user: [item for item in model.recommend(user, train_matrix_csr[user], N=3, filter_already_liked_items=True)]
            for user in ground_truth
        }

        print("usr recs ",user_recs)

        recall = recall_at_k(user_recs, ground_truth, k=3)
        mlflow.log_metric("recall_at_5", recall)
        print(f"Recall@10: {recall:.4f}")

        mlflow.sklearn.log_model(model, "als_recommender")

    return model

