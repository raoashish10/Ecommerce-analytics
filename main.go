package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// Analytics event structure
type AnalyticsEvent struct {
	UserID    string `json:"userId" binding:"required"`
	Event     string `json:"event" binding:"required"`
	ProductID string `json:"productId" binding:"required"`
	Timestamp int64  `json:"timestamp"`
}

// Redis client setup
var redisClient = redis.NewClient(&redis.Options{
	Addr: "redis:6379",
	DB:   0,
})

// Kafka producer setup
func kafkaProducer(event AnalyticsEvent) error {
	producer, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": "kafka:9092"})
	if err != nil {
		return err
	}
	defer producer.Close()

	topic := "ecommerce-analytics"
	msg, _ := json.Marshal(event)

	err = producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          msg,
	}, nil)

	if err != nil {
		return err
	}

	producer.Flush(5000)
	return nil
}

// Save analytics to Redis (real-time tracking)
func saveToRedis(event AnalyticsEvent) error {
	ctx := context.Background()
	key := fmt.Sprintf("user:%s:recent_events", event.UserID)

	// Store event as JSON string
	eventData, _ := json.Marshal(event)
	_, err := redisClient.LPush(ctx, key, eventData).Result()

	// Keep only last 10 events per user
	redisClient.LTrim(ctx, key, 0, 9)

	return err
}

// Handle analytics tracking
func trackEvent(c *gin.Context) {
	var event AnalyticsEvent

	// Validate input
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Add timestamp
	event.Timestamp = time.Now().Unix()

	// Save event to Redis for real-time analytics
	if err := saveToRedis(event); err != nil {
		log.Println("Redis Error:", err)
	}

	// Send event to Kafka
	if err := kafkaProducer(event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send event to Kafka"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event tracked successfully"})
}

func main() {
	router := gin.Default()

	// API route for tracking events
	router.POST("/api/track", trackEvent)

	// Start the server
	fmt.Println("Server running on port 8080")
	log.Fatal(router.Run(":8080"))
}
