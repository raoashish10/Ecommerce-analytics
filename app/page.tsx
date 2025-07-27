"use client"

import { useEffect } from "react"
import { tracking } from "@/lib/tracking"
import { Suspense } from "react"
import HeroSection from "@/components/hero-section"
import FeaturedProducts from "@/components/featured-products"
import CategoryGrid from "@/components/category-grid"
import Newsletter from "@/components/newsletter"
import { ProductCardSkeleton } from "@/components/product-card"

function PageTracker() {
  useEffect(() => {
    tracking.viewPage("home")
  }, [])
  return null
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PageTracker />
      <HeroSection />

      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <CategoryGrid />
        </div>
      </section> */}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          <Suspense
            fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>

      <Newsletter />
    </div>
  )
}
