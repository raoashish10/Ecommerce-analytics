import ray
import time
from datetime import datetime

ray.init(_temp_dir="/Users/ashish/ray_tmp")

@ray.remote
def consume_kafka_task(prefix):
    from consume_kafka import main
    print("Consuming kafka data...")
    main(prefix) 

@ray.remote
def retrain_model(prefix):
    from als_trainer import train_als  # Import train_als function
    print("Retraining ALS Model...")
    train_als(prefix)
    print("Model Training Complete!")

# Task execution loop
def schedule_tasks():
    now = str(datetime.now())
    prefix = now.replace(" ", "/")

    while True:
        # Call the `consume_kafka_task` periodically (e.g., every 5 minutes)
        print("Scheduling Kafka Consumer Task...")
        ray.get(consume_kafka_task.remote(prefix))

        # Call the `retrain_model` periodically (e.g., every 30 minutes)
        print("Scheduling Model Retraining Task...")
        ray.get(retrain_model.remote(prefix))

        # Sleep for the desired time interval before executing tasks again
        time.sleep(30 * 60)  # Sleep for 5 minutes before calling the tasks again

if __name__ == "__main__":
    schedule_tasks()
