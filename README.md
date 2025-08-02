## 📦 **Endpoints**

| Endpoint   | Method | Description                                       |
| ---------- | ------ | ------------------------------------------------- |
| `/search`  | GET    | Fetch product data & personalized recommendations |
| `/track`   | POST   | Track user clickstream events                     |
| `/analyze` | GET    | Fetch real-time analytics data                    |

---

## 📊 **Real-Time Analytics Flow**

1. Clickstream events are cached and aggregated in Redis.
2. Frontend queries `/analyze` to get real-time stats (e.g., trending products, active users).

---


