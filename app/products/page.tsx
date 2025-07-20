"use client"

import { Suspense, useEffect } from "react"
import { ProductCard, ProductCardSkeleton } from "@/components/product-card"
import { tracking } from "@/lib/tracking"

// Mock product data - in a real app, this would come from an API
const allProducts = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 299.99,
    originalPrice: 399.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    rating: 4.8,
    reviews: 89,
  },
  {
    id: 3,
    name: "Designer Jacket",
    price: 159.99,
    originalPrice: 199.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Fashion",
    rating: 4.3,
    reviews: 67,
  },
  {
    id: 4,
    name: "Coffee Maker",
    price: 89.99,
    originalPrice: 119.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
    rating: 4.6,
    reviews: 234,
  },
  {
    id: 5,
    name: "Gaming Mouse",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Gaming",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 49.99,
    originalPrice: 69.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    rating: 4.4,
    reviews: 92,
  },
  {
    id: 7,
    name: "Running Shoes",
    price: 129.99,
    originalPrice: 159.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Fashion",
    rating: 4.5,
    reviews: 178,
  },
  {
    id: 8,
    name: "Desk Lamp",
    price: 39.99,
    originalPrice: 54.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Home & Garden",
    rating: 4.2,
    reviews: 43,
  },
  {
    id: 9,
    name: "Mechanical Keyboard",
    price: 149.99,
    originalPrice: 179.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    rating: 4.6,
    reviews: 201,
  },
  {
    id: 10,
    name: "Yoga Mat",
    price: 29.99,
    originalPrice: 39.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sports",
    rating: 4.3,
    reviews: 87,
  },
  {
    id: 11,
    name: "Wireless Charger",
    price: 34.99,
    originalPrice: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Electronics",
    rating: 4.1,
    reviews: 156,
  },
  {
    id: 12,
    name: "Backpack",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=300&width=300",
    category: "Fashion",
    rating: 4.4,
    reviews: 123,
  },
]

function ProductGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {allProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductsPageTracker() {
  useEffect(() => {
    tracking.viewPage("products")
  }, [])
  return null
}

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ProductsPageTracker />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">All Products</h1>
        <p className="text-gray-600">Discover our complete collection of premium products</p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ProductGrid />
      </Suspense>
    </div>
  )
}
