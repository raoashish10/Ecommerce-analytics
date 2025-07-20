import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div
        className="relative container mx-auto px-4 py-24 md:py-32 bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/hero-background.png')`,
        }}
      >
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Discover Amazing Products</h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 animate-fade-in">
            Shop the latest trends in electronics, fashion, and home decor with unbeatable prices and fast shipping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
              <Link href="/products">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-gray-900 bg-transparent"
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
