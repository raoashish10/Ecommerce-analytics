import { ProductCard } from "./product-card"
import { featuredProducts } from "@/lib/products"

export default function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
