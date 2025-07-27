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

// Analytics event structure - enhanced to handle all ecommerce events
type TrackEvent struct {
	UserID      string                 `json:"userId" binding:"required"`
	Event       string                 `json:"event" binding:"required"`
	ProductID   string                 `json:"productId"`
	ProductName string                 `json:"productName"`
	Price       float64                `json:"price"`
	Quantity    int                    `json:"quantity"`
	Category    string                 `json:"category"`
	SearchQuery string                 `json:"searchQuery"`
	Page        string                 `json:"page"`
	Metadata    map[string]interface{} `json:"metadata"`
	Timestamp   int64                  `json:"timestamp"`
}

type ProductEvent struct {
	ProductID   string  `json:"productId"`
	ProductName string  `json:"productName"`
	EventCount  int64   `json:"eventCount"`
	TotalValue  float64 `json:"totalValue"`
	Category    string  `json:"category"`
}

type AnalyticsSummary struct {
	TopProducts     []ProductEvent `json:"topProducts"`
	TotalEvents     int64          `json:"totalEvents"`
	TotalRevenue    float64        `json:"totalRevenue"`
	PopularEvents   map[string]int `json:"popularEvents"`
	CategoryStats   map[string]int `json:"categoryStats"`
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

// Save analytics to Redis with enhanced tracking
func saveEventToRedis(event TrackEvent) error {
	ctx := context.Background()
	
	// Store event details
	eventKey := fmt.Sprintf("event:%s:%s:%s", event.Event, event.UserID, event.ProductID)
	eventData, _ := json.Marshal(event)
	err := redisClient.Set(ctx, eventKey, eventData, 30*time.Hour).Err()
	if err != nil {
		return err
	}

	// Track product-specific events
	if event.ProductID != "" {
		productKey := fmt.Sprintf("product:%s:events", event.ProductID)
		err = redisClient.SAdd(ctx, productKey, event.Event).Err()
		if err != nil {
			return err
		}
		err = redisClient.Expire(ctx, productKey, 30*time.Hour).Err()
		if err != nil {
			return err
		}

		// Track user-product interactions
		userProductKey := fmt.Sprintf("user:%s:product:%s", event.UserID, event.ProductID)
		err = redisClient.SAdd(ctx, userProductKey, event.Event).Err()
		if err != nil {
			return err
		}
		err = redisClient.Expire(ctx, userProductKey, 30*time.Hour).Err()
		if err != nil {
			return err
		}
	}

	// Track category events
	if event.Category != "" {
		categoryKey := fmt.Sprintf("category:%s:events", event.Category)
		err = redisClient.SAdd(ctx, categoryKey, event.Event).Err()
		if err != nil {
			return err
		}
		err = redisClient.Expire(ctx, categoryKey, 30*time.Hour).Err()
		if err != nil {
			return err
		}
	}

	// Track search queries
	if event.SearchQuery != "" {
		searchKey := fmt.Sprintf("search:%s", event.SearchQuery)
		err = redisClient.Incr(ctx, searchKey).Err()
		if err != nil {
			return err
		}
		err = redisClient.Expire(ctx, searchKey, 30*time.Hour).Err()
		if err != nil {
			return err
		}
	}

	return nil
}

// Handle analytics tracking with enhanced validation
func trackEvent(c *gin.Context) {
	var event TrackEvent

	// Validate input
	if err := c.ShouldBindJSON(&event); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	// Validate required fields based on event type
	if event.Event == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Event type is required"})
		return
	}

	// Add timestamp
	event.Timestamp = time.Now().Unix()

	// Save event to Redis for real-time analytics
	if err := saveEventToRedis(event); err != nil {
		log.Println("Redis Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis Error: " + err.Error()})
		return
	}

	// Send event to Kafka
	if err := kafkaProducer(event); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send event to Kafka"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event tracked successfully", "event": event.Event})
}

// Get comprehensive analytics
func getAnalyticsSummary() (*AnalyticsSummary, error) {
	ctx := context.Background()
	
	summary := &AnalyticsSummary{
		PopularEvents: make(map[string]int),
		CategoryStats: make(map[string]int),
	}

	// Get all product keys
	var cursor uint64
	productKeys := make([]string, 0)
	
	for {
		result, newCursor, err := redisClient.Scan(ctx, cursor, "product:*:events", 1000).Result()
		if err != nil {
			return nil, err
		}
		productKeys = append(productKeys, result...)
		cursor = newCursor
		if cursor == 0 {
			break
		}
	}

	// Process each product
	var products []ProductEvent
	for _, key := range productKeys {
		productID := strings.Split(key, ":")[1]
		
		// Get event count for this product
		eventCount, err := redisClient.SCard(ctx, key).Result()
		if err != nil {
			continue
		}

		// Get product details from recent events
		productName := ""
		category := ""
		totalValue := 0.0

		// Get recent events for this product to extract details
		eventKeys, err := redisClient.Keys(ctx, fmt.Sprintf("event:*:*:%s", productID)).Result()
		if err == nil && len(eventKeys) > 0 {
			// Get the most recent event for product details
			eventData, err := redisClient.Get(ctx, eventKeys[0]).Result()
			if err == nil {
				var recentEvent TrackEvent
				json.Unmarshal([]byte(eventData), &recentEvent)
				productName = recentEvent.ProductName
				category = recentEvent.Category
				if recentEvent.Price > 0 {
					totalValue = recentEvent.Price * float64(recentEvent.Quantity)
				}
			}
		}

		products = append(products, ProductEvent{
			ProductID:   productID,
			ProductName: productName,
			EventCount:  eventCount,
			TotalValue:  totalValue,
			Category:    category,
		})

		summary.TotalEvents += eventCount
	}

	// Sort products by event count
	sort.Slice(products, func(i, j int) bool {
		return products[i].EventCount > products[j].EventCount
	})

	// Get top 10 products
	if len(products) > 10 {
		summary.TopProducts = products[:10]
	} else {
		summary.TopProducts = products
	}

	// Calculate total revenue
	for _, product := range summary.TopProducts {
		summary.TotalRevenue += product.TotalValue
	}

	// Get popular events
	eventKeys, err := redisClient.Keys(ctx, "event:*").Result()
	if err == nil {
		for _, key := range eventKeys {
			eventType := strings.Split(key, ":")[1]
			summary.PopularEvents[eventType]++
		}
	}

	// Get category stats
	categoryKeys, err := redisClient.Keys(ctx, "category:*:events").Result()
	if err == nil {
		for _, key := range categoryKeys {
			category := strings.Split(key, ":")[1]
			count, err := redisClient.SCard(ctx, key).Result()
			if err == nil {
				summary.CategoryStats[category] = int(count)
			}
		}
	}

	return summary, nil
}

// Get top products analytics
func productsHandler(c *gin.Context) {
	summary, err := getAnalyticsSummary()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error analyzing products: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"top_products": summary.TopProducts,
		"total_events": summary.TotalEvents,
		"total_revenue": summary.TotalRevenue,
		"popular_events": summary.PopularEvents,
		"category_stats": summary.CategoryStats,
	})
}

// Get comprehensive analytics
func analyticsHandler(c *gin.Context) {
	summary, err := getAnalyticsSummary()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting analytics: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, summary)
}

// Get search analytics
func searchAnalyticsHandler(c *gin.Context) {
	ctx := context.Background()
	
	// Get all search keys
	searchKeys, err := redisClient.Keys(ctx, "search:*").Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error getting search analytics"})
		return
	}

	searchStats := make(map[string]int64)
	for _, key := range searchKeys {
		query := strings.TrimPrefix(key, "search:")
		count, err := redisClient.Get(ctx, key).Int64()
		if err == nil {
			searchStats[query] = count
		}
	}

	c.JSON(http.StatusOK, gin.H{"search_analytics": searchStats})
}

func main() {
	router := gin.Default()

	// API routes for tracking events
	router.POST("/api/track", trackEvent)

	// API routes for analytics
	router.GET("/api/analyze/products", productsHandler)
	router.GET("/api/analyze/summary", analyticsHandler)
	router.GET("/api/analyze/search", searchAnalyticsHandler)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy", "timestamp": time.Now().Unix()})
	})

	// Start the server
	fmt.Println("Ecommerce Analytics Server running on port 8080")
	fmt.Println("Available endpoints:")
	fmt.Println("  POST /api/track - Track ecommerce events")
	fmt.Println("  GET  /api/analyze/products - Get top products")
	fmt.Println("  GET  /api/analyze/summary - Get comprehensive analytics")
	fmt.Println("  GET  /api/analyze/search - Get search analytics")
	fmt.Println("  GET  /health - Health check")
	
	log.Fatal(router.Run(":8080"))
}