package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"time"
	"strings"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

// Analytics event structure
type TrackEvent struct {
	UserID    string `json:"userId" binding:"required"`
	Event     string `json:"event" binding:"required"`
	ProductID string `json:"productId" binding:"required"`
	Timestamp int64  `json:"timestamp"`
}

type ProductEvent struct {
	ProductID string
	EventCount int64
}

// Redis client setup
var redisClient = redis.NewClient(&redis.Options{
	Addr: "redis:6379",
	DB:   0,
})

// Kafka producer setup
func kafkaProducer(event TrackEvent) error {
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
func saveProductUserToRedis(event TrackEvent) error {
	ctx := context.Background()
	key := fmt.Sprintf("product:%s:id:%s", event.Event, event.ProductID)

	_, err := redisClient.SAdd(ctx, key, event.UserID).Result()
	if err!=nil {
		return err
	}
	err = redisClient.Expire(ctx, key, 30 * time.Hour).Err()
	return err
}

// Handle analytics tracking
func trackEvent(c *gin.Context) {
	var event TrackEvent

	// Validate input
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Add timestamp
	event.Timestamp = time.Now().Unix()

	// Save event to Redis for real-time analytics
	if err := saveProductUserToRedis(event); err != nil {
		log.Println("Redis Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis Error " + err.Error()})
		return
	}

	// Send event to Kafka
	if err := kafkaProducer(event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send event to Kafka"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event tracked successfully"})
}

// Function to fetch events from Redis and calculate the event counts per product
func getEventCounts() (map[string]int64, error) {
	ctx := context.Background()
	var cursor uint64
	productEventCounts := make(map[string]int64)

	const pattern = "product:*:id:*"
	for {
		// Use SCAN to fetch keys matching the pattern
		result, newCursor, err := redisClient.Scan(ctx, cursor, pattern, 1000).Result()
		if err != nil {
			fmt.Println("Error scanning keys:", err)
			return nil, err
		}

		// For each key (product), get the number of unique users (events) using SCARD
		for _, key := range result {
			count, err := redisClient.SCard(ctx, key).Result()
			if err != nil {
				return nil, err
			}
			keyParts := strings.Split(key, ":")
			productId := keyParts[len(keyParts) - 1]
			if _, ok := productEventCounts[productId]; !ok {
				productEventCounts[productId] = 0
			}
			productEventCounts[productId] += count
		}

		cursor = newCursor
		if cursor == 0 {
			break
		}
	}
	return productEventCounts, nil
}

// Get top N products with the most events
func getTop5Products() ([]ProductEvent, error) {
	productEventCounts, err := getEventCounts()
	if err != nil {
		return nil, err
	}

	// Sort products by event count
	var sortedProducts []ProductEvent
	for productID, eventCount := range productEventCounts {
		sortedProducts = append(sortedProducts, ProductEvent{
			ProductID: productID,
			EventCount: eventCount,
		})
	}

	// Sort in descending order of event count
	sort.Slice(sortedProducts, func(i, j int) bool {
		return sortedProducts[i].EventCount > sortedProducts[j].EventCount
	})

	return sortedProducts, nil
}

func productsHandler(c *gin.Context) {
	topProducts, err := getTop5Products()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error analyzing products: " + err.Error()})
		return
	}
	

	c.JSON(http.StatusOK, gin.H{"top_products": topProducts})
}

func main() {
	router := gin.Default()

	// API route for tracking events
	router.POST("/api/track", trackEvent)

	// API route for product analytics
	router.GET("/api/analyze/products", productsHandler)

	// Start the server
	fmt.Println("Server running on port 8080")
	log.Fatal(router.Run(":8080"))
}
