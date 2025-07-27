#!/bin/bash

echo "🚀 Populating Kafka with extended ecommerce events..."

# Additional Users
echo "👥 Creating diverse user behavior..."

# User 1 - Electronics Enthusiast
echo "📱 User1 (Electronics Enthusiast) events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user001","event":"view_product","productId":"prod101","productName":"iPhone 15 Pro","price":999.99,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user001","event":"view_product","productId":"prod102","productName":"MacBook Air M2","price":1199.99,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user001","event":"search","searchQuery":"iphone"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user001","event":"add_to_cart","productId":"prod101","productName":"iPhone 15 Pro","price":999.99,"quantity":1,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user001","event":"page_view","page":"/checkout"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user001","event":"begin_checkout","price":999.99,"quantity":1}'

# User 2 - Fitness Enthusiast
echo "💪 User2 (Fitness Enthusiast) events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user002","event":"view_product","productId":"prod201","productName":"Nike Air Max 270","price":150.00,"category":"Footwear"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user002","event":"view_product","productId":"prod202","productName":"Protein Powder 2lb","price":45.99,"category":"Health"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user002","event":"search","searchQuery":"running shoes"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user002","event":"add_to_cart","productId":"prod201","productName":"Nike Air Max 270","price":150.00,"quantity":1,"category":"Footwear"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user002","event":"add_to_cart","productId":"prod202","productName":"Protein Powder 2lb","price":45.99,"quantity":2,"category":"Health"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user002","event":"begin_checkout","price":241.98,"quantity":3}'

# User 3 - Fashion Shopper
echo "👗 User3 (Fashion Shopper) events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"view_product","productId":"prod301","productName":"Denim Jacket","price":89.99,"category":"Clothing"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"view_product","productId":"prod302","productName":"Summer Dress","price":65.50,"category":"Clothing"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"view_product","productId":"prod303","productName":"Leather Handbag","price":120.00,"category":"Accessories"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"search","searchQuery":"dress"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"add_to_cart","productId":"prod301","productName":"Denim Jacket","price":89.99,"quantity":1,"category":"Clothing"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"add_to_cart","productId":"prod302","productName":"Summer Dress","price":65.50,"quantity":1,"category":"Clothing"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"remove_from_cart","productId":"prod301","productName":"Denim Jacket","price":89.99,"quantity":1,"category":"Clothing"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"begin_checkout","price":65.50,"quantity":1}'

# User 4 - Home & Garden
echo "🏠 User4 (Home & Garden) events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user004","event":"view_product","productId":"prod401","productName":"Smart LED Bulbs Pack","price":29.99,"category":"Home"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user004","event":"view_product","productId":"prod402","productName":"Garden Hose 50ft","price":45.00,"category":"Garden"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user004","event":"search","searchQuery":"smart home"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user004","event":"add_to_cart","productId":"prod401","productName":"Smart LED Bulbs Pack","price":29.99,"quantity":3,"category":"Home"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user004","event":"add_to_cart","productId":"prod402","productName":"Garden Hose 50ft","price":45.00,"quantity":1,"category":"Garden"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user004","event":"update_cart_quantity","productId":"prod401","productName":"Smart LED Bulbs Pack","price":29.99,"quantity":5,"category":"Home","metadata":{"oldQuantity":3,"newQuantity":5}}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user004","event":"begin_checkout","price":194.95,"quantity":6}'

# User 5 - Book Lover
echo "📚 User5 (Book Lover) events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user005","event":"view_product","productId":"prod501","productName":"The Great Gatsby","price":12.99,"category":"Books"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user005","event":"view_product","productId":"prod502","productName":"Python Programming Guide","price":35.99,"category":"Books"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user005","event":"search","searchQuery":"fiction books"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user005","event":"add_to_cart","productId":"prod501","productName":"The Great Gatsby","price":12.99,"quantity":1,"category":"Books"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user005","event":"add_to_cart","productId":"prod502","productName":"Python Programming Guide","price":35.99,"quantity":1,"category":"Books"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user005","event":"begin_checkout","price":48.98,"quantity":2}'

# User 6 - Tech Gadget Lover
echo "🤖 User6 (Tech Gadget Lover) events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user006","event":"view_product","productId":"prod601","productName":"DJI Mini Drone","price":449.99,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user006","event":"view_product","productId":"prod602","productName":"GoPro Hero 11","price":399.99,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user006","event":"search","searchQuery":"drone"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user006","event":"add_to_cart","productId":"prod601","productName":"DJI Mini Drone","price":449.99,"quantity":1,"category":"Electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user006","event":"page_view","page":"/products/electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user006","event":"begin_checkout","price":449.99,"quantity":1}'

# User 7 - Kitchen & Cooking
echo "👨‍🍳 User7 (Kitchen & Cooking) events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user007","event":"view_product","productId":"prod701","productName":"KitchenAid Mixer","price":299.99,"category":"Kitchen"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user007","event":"view_product","productId":"prod702","productName":"Cast Iron Skillet","price":89.99,"category":"Kitchen"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user007","event":"search","searchQuery":"kitchen appliances"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user007","event":"add_to_cart","productId":"prod701","productName":"KitchenAid Mixer","price":299.99,"quantity":1,"category":"Kitchen"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user007","event":"add_to_cart","productId":"prod702","productName":"Cast Iron Skillet","price":89.99,"quantity":1,"category":"Kitchen"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user007","event":"begin_checkout","price":389.98,"quantity":2}'

# User 8 - Sports Enthusiast
echo "⚽ User8 (Sports Enthusiast) events..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user008","event":"view_product","productId":"prod801","productName":"Basketball","price":25.99,"category":"Sports"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user008","event":"view_product","productId":"prod802","productName":"Tennis Racket","price":85.50,"category":"Sports"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user008","event":"search","searchQuery":"basketball"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user008","event":"add_to_cart","productId":"prod801","productName":"Basketball","price":25.99,"quantity":2,"category":"Sports"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user008","event":"add_to_cart","productId":"prod802","productName":"Tennis Racket","price":85.50,"quantity":1,"category":"Sports"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user008","event":"begin_checkout","price":197.48,"quantity":3}'

# Newsletter Subscriptions
echo "📧 Newsletter subscriptions..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user001","event":"subscribe_newsletter","metadata":{"email":"user001@example.com"}}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"subscribe_newsletter","metadata":{"email":"user003@example.com"}}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user005","event":"subscribe_newsletter","metadata":{"email":"user005@example.com"}}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user007","event":"subscribe_newsletter","metadata":{"email":"user007@example.com"}}'

# Additional Page Views
echo "📄 Additional page views..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user002","event":"page_view","page":"/category/footwear"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user004","event":"page_view","page":"/category/home"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user006","event":"page_view","page":"/category/electronics"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user008","event":"page_view","page":"/category/sports"}'

# Additional Searches
echo "🔍 Additional searches..."
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user001","event":"search","searchQuery":"macbook"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user003","event":"search","searchQuery":"handbag"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user005","event":"search","searchQuery":"programming books"}'
curl -X POST http://localhost:8080/api/track -H "Content-Type: application/json" -d '{"userId":"user007","event":"search","searchQuery":"mixer"}'

echo "✅ Extended test events sent! Check analytics for rich data insights." 