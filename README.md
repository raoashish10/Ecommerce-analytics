# 🛒 E-commerce Recommendation & Clickstream Analytics Platform

This project is a scalable, event-driven system that powers real-time product recommendations and clickstream analytics for an e-commerce platform.
It combines a Go API, Next.js frontend, Kafka, Redis, and an automated offline ML training pipeline built with Ray and MLflow.

---

## 🧰 **Tech Stack**

* Frontend: Next.js
* Backend: Go (Gin)
* Messaging: Apache Kafka
* Cache: Redis
* ML pipeline: Ray, MLflow
* Containerization: Docker / Docker Compose

---

## 🚀 **Architecture Overview**

* **Frontend:**

  * Next.js app for product exploration, user browsing, and collecting clickstream events.
* **Backend API:**

  * Go (Gin) service providing:

    * `/search` endpoint for product search & recommendations.
    * `/track` endpoint to log user clickstream events.
    * `/analyze` endpoint to fetch real-time analytics.
* **Streaming & caching:**

  * Kafka handles event ingestion.
  * Redis caches:

    * Precomputed recommendations.
    * Aggregated real-time analytics.
* **Offline recommendation pipeline:**

  * Ray tasks consume events from Kafka and train recommendation models.
  * MLflow tracks experiments, hyperparameters, and model metrics.
  * Updated recommendations are stored in Redis for low-latency serving.

&#x20;

---

## ⚙️ **Components**

| Component   | Tech         | Purpose                                           |
| ----------- | ------------ | ------------------------------------------------- |
| Frontend    | Next.js      | User interface & event tracking                   |
| API         | Go (Gin)     | REST endpoints to serve data & track events       |
| Messaging   | Kafka        | Stream clickstream data to ML pipeline            |
| Cache       | Redis        | Low-latency store for recommendations & analytics |
| ML pipeline | Ray + MLflow | Train & track recommendation models offline       |

---

## 📦 **Endpoints**

| Endpoint   | Method | Description                                       |
| ---------- | ------ | ------------------------------------------------- |
| `/search`  | GET    | Fetch product data & personalized recommendations |
| `/track`   | POST   | Track user clickstream events                     |
| `/analyze` | GET    | Fetch real-time analytics data                    |

---

## 🧪 **Recommendation Flow**

1. Users interact with the frontend → clickstream events sent to `/track`.
2. Go API produces these events to Kafka.
3. Offline Ray jobs consume events → train/update recommendation models.
4. MLflow tracks metrics & experiments.
5. Updated recommendations are saved to Redis.
6. Frontend requests `/search` → Go API retrieves recommendations from Redis.

---

## 📊 **Real-Time Analytics Flow**

1. Clickstream events are cached and aggregated in Redis.
2. Frontend queries `/analyze` to get real-time stats (e.g., trending products, active users).

---

## ✅ **Features**

* Event-driven, loosely coupled architecture.
* Low latency product recommendations via caching.
* Scalable offline training with Ray.
* ML experiment tracking with MLflow.
* Real-time analytics for high-engagement products.

---

## 📦 **Getting Started (Local)**

```bash
# Clone the repo
git clone https://github.com/raoashish10/Ecommerce-clickstream-analytics.git
cd Ecommerce-clickstream-analytics

# Start Go API
git checkout api
docker-compose up -d

# Start Recommendation pipeline
git checkout recommendation
docker-compose up -d

# Start Next.js frontend
git checkout frontend
npm install
npm run dev
```
