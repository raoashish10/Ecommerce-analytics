from confluent_kafka import Consumer, KafkaException
import json
from datetime import datetime
import os
import pandas as pd




def main(prefix):
    # Kafka consumer configuration
    consumer_config = {
        'bootstrap.servers': 'localhost:29092',
        'group.id': 'test-reconsume-group-' + prefix,  # Unique group to force reconsumption
        'auto.offset.reset': 'earliest',  # Start from earliest
        'enable.auto.commit': False  # Disable auto commit to prevent skipping
    }

    # Topic to consume
    TOPIC = "ecommerce-analytics"

    # Initialize consumer
    consumer = Consumer(consumer_config)
    consumer.subscribe([TOPIC])

    print(f"Subscribed to topic '{TOPIC}'...")

        # Current timestamped folder
    output_dir = f"data/{prefix}"
    os.makedirs(output_dir, exist_ok=True)

    # Store events
    events = []

    try:
        while True:
            msg = consumer.poll(5.0)

            if msg is None:
                print("No more messages. Exiting...")
                break

            if msg.error():
                raise KafkaException(msg.error())

            raw = msg.value().decode('utf-8')
            print(f"Consumed message: {raw}")

            try:
                data = json.loads(raw)
                events.append(data)
            except json.JSONDecodeError as e:
                print(f"Failed to decode: {e}, raw: {raw}")

    except KeyboardInterrupt:
        print("Stopped manually.")
    finally:
        consumer.close()

    # Save to CSV
    if events:
        df = pd.DataFrame(events)
        file_path = f"{output_dir}/events.csv"
        df.to_csv(file_path, index=False)
        print(f"\nSaved {len(events)} events to {file_path}")
    else:
        print("No events to save.")
