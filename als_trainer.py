import mlflow
import mlflow.sklearn
from implicit.als import AlternatingLeastSquares
import numpy as np
from scipy.sparse import csr_matrix
import pandas as pd

# Enable MLflow auto logging
mlflow.set_tracking_uri("http://localhost:5001")  # Change if using remote MLflow server
mlflow.set_experiment("Product Recommendation Experiment")

def train_als(prefix, factors=50, regularization=0.1):
    # Load Data (Replace with Kafka Pipeline Data)
    df = pd.read_csv(f"data/{prefix}/events.csv")  # Load from your Kafka pipeline storage

    # Encode user and product IDs
    user_map = {user: i for i, user in enumerate(df["userId"].unique())}
    product_map = {prod: i for i, prod in enumerate(df["productId"].unique())}

    df["user_idx"] = df["userId"].map(user_map)
    df["product_idx"] = df["productId"].map(product_map)

    interaction_matrix = np.zeros((len(user_map), len(product_map)))
    for _, row in df.iterrows():
        interaction_matrix[row["user_idx"], row["product_idx"]] += 1

    interaction_matrix = csr_matrix(interaction_matrix)

    # Train Model with MLflow tracking
    with mlflow.start_run():
        mlflow.log_param("factors", factors)
        mlflow.log_param("regularization", regularization)

        model = AlternatingLeastSquares(factors=factors, regularization=regularization)
        model.fit(interaction_matrix)

        # Log model and metrics
        mlflow.log_metric("final_loss", model.calculate_loss(interaction_matrix))
        mlflow.sklearn.log_model(model, "als_recommender")

    return model
