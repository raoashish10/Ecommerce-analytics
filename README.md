# 🛠️ Go API – E-commerce Analytics & Recommendation

This is the **Go API** service for the E-commerce Recommendation & Clickstream Analytics platform.
It provides REST endpoints to serve product recommendations, track clickstream events, and deliver real-time analytics.

---

## 🧰 **Tech Stack**

* Go (Gin) for REST API
* Redis for caching recommendations and analytics
* Apache Kafka for event streaming

---

## 📦 **Features**

* Fetch personalized product recommendations
* Collect clickstream events from frontend
* Serve real-time analytics (e.g., trending products)
* Event-driven architecture powered by Kafka & Redis
* Designed to scale horizontally

---

## 🚀 **Getting Started (Local)**

This branch is intended to be run as part of the full platform using Docker Compose.

### Clone and build

1. Clone repository
2. Start services

From the root directory where your `docker-compose.yml` is:

```bash
docker-compose up --build
```

This will start:

* Redis
* Kafka + Zookeeper
* Go API (exposed on `http://localhost:8080`)

---

## 🧪 **Endpoints**

|   Endpoint | Method | Description                                       |
| ---------: | :----: | ------------------------------------------------- |
|  `/search` |   GET  | Fetch product data & personalized recommendations |
|   `/track` |  POST  | Track user clickstream events                     |
| `/analyze` |   GET  | Fetch real-time analytics data                    |

---

## 🐳 **Docker Compose Overview**

The provided `docker-compose.yml` sets up:

|   Service | Purpose                        | Ports           |
| --------: | ------------------------------ | --------------- |
|     redis | Cache layer                    | `6379`          |
| zookeeper | Coordination service for Kafka | `22181` (→2181) |
|     kafka | Event streaming broker         | `29092`         |
|    go-api | Go backend API                 | `8080`          |

---

## ✅ **Example Usage**

**Get recommendations:**

```bash
curl http://localhost:8080/search
```

**Track event:**

```bash
curl -X POST http://localhost:8080/track \
  -H "Content-Type: application/json" \
  -d '{"userId":"123","event":"view_product","productId":"abc"}'
```

**Get analytics:**

```bash
curl http://localhost:8080/analyze
```

---