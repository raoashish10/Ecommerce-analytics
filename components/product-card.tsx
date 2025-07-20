"use client"

import Image from "next/image"
import { Star, ShoppingCart, Check, Smartphone, Shirt, Home, Gamepad2, Dumbbell, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { tracking } from "@/lib/tracking"
import { useEffect, useState } from "react"

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviews: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    // Track product view when component mounts
    tracking.viewProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
    })
  }, [product.id, product.name, product.price, product.category])

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000) // Reset after 2 seconds
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {discount > 0 && <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">-{discount}%</Badge>}

      <div className="relative overflow-hidden flex items-center justify-center h-48 bg-gray-100">
        {/* Category Icon instead of Image */}
        {(() => {
          switch (product.category.toLowerCase()) {
            case "electronics":
              return <Smartphone className="w-20 h-20 text-blue-500" />
            case "fashion":
              return <Shirt className="w-20 h-20 text-pink-500" />
            case "home & garden":
              return <Home className="w-20 h-20 text-green-500" />
            case "gaming":
              return <Gamepad2 className="w-20 h-20 text-purple-500" />
            case "sports":
              return <Dumbbell className="w-20 h-20 text-orange-500" />
            default:
              return <Box className="w-20 h-20 text-gray-400" />
          }
        })()}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <div className="mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        </div>

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className={`w-full transition-all duration-300 ${isAdded ? "bg-green-600 hover:bg-green-700" : ""}`}
          size="sm"
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Added!
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-gray-300" />
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded mb-2 w-16" />
        <div className="h-5 bg-gray-300 rounded mb-2" />
        <div className="h-4 bg-gray-300 rounded mb-2 w-24" />
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-300 rounded w-20" />
        </div>
        <div className="h-8 bg-gray-300 rounded" />
      </div>
    </div>
  )
}
