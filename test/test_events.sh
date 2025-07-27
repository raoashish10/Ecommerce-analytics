#!/bin/bash

echo "🚀 Populating Kafka with test ecommerce events..."

# Product View Events
echo "📱 Sending product view events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user123","event":"view_product","productId":"prod001","productName":"Wireless Bluetooth Headphones","price":89.99,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user456","event":"view_product","productId":"prod002","productName":"Smart Fitness Watch","price":199.99,"category":"Wearables"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user789","event":"view_product","productId":"prod003","productName":"Organic Cotton T-Shirt","price":24.99,"category":"Clothing"}'

# Add to Cart Events
echo "🛒 Sending add to cart events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user123","event":"add_to_cart","productId":"prod001","productName":"Wireless Bluetooth Headphones","price":89.99,"quantity":2,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user456","event":"add_to_cart","productId":"prod002","productName":"Smart Fitness Watch","price":199.99,"quantity":1,"category":"Wearables"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user789","event":"add_to_cart","productId":"prod003","productName":"Organic Cotton T-Shirt","price":24.99,"quantity":3,"category":"Clothing"}'

# Cart Management Events
echo "📦 Sending cart management events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user123","event":"remove_from_cart","productId":"prod001","productName":"Wireless Bluetooth Headphones","price":89.99,"quantity":1,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user789","event":"update_cart_quantity","productId":"prod003","productName":"Organic Cotton T-Shirt","price":24.99,"quantity":5,"category":"Clothing","metadata":{"oldQuantity":3,"newQuantity":5}}'

# Page View Events
echo "📄 Sending page view events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user123","event":"page_view","page":"/products"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user456","event":"page_view","page":"/cart"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user789","event":"page_view","page":"/checkout"}'

# Search Events
echo "🔍 Sending search events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user123","event":"search","searchQuery":"headphones"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user456","event":"search","searchQuery":"fitness watch"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user789","event":"search","searchQuery":"wireless"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user123","event":"search","searchQuery":"bluetooth"}'

# Checkout Events
echo "💳 Sending checkout events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user123","event":"begin_checkout","price":179.98,"quantity":2}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user456","event":"begin_checkout","price":199.99,"quantity":1}'

# Newsletter Events
echo "📧 Sending newsletter events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user123","event":"subscribe_newsletter","metadata":{"email":"user123@example.com"}}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user456","event":"subscribe_newsletter","metadata":{"email":"user456@example.com"}}'

echo "✅ All test events sent! Check Kafka and analytics endpoints." 