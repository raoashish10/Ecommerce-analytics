## 🧪 **Recommendation Flow**

1. Users interact with the frontend → clickstream events sent to `/track`.
2. Go API produces these events to Kafka.
3. Offline Ray jobs consume events → train/update recommendation models.
4. MLflow tracks metrics & experiments.
5. Updated recommendations are saved to Redis.
6. Frontend requests `/search` → Go API retrieves recommendations from Redis.