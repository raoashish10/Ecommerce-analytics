"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import CartDrawer from "./cart-drawer"
import { tracking } from "@/lib/tracking"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-gray-900">
              ModernShop
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-gray-900 transition-colors">
                Products
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-gray-900 transition-colors">
                Categories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const query = (e.target as HTMLInputElement).value
                      if (query.trim()) {
                        tracking.search(query.trim())
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>

              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(true)} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 w-full"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const query = (e.target as HTMLInputElement).value
                        if (query.trim()) {
                          tracking.search(query.trim())
                        }
                      }
                    }}
                  />
                </div>
                <Link href="/products" className="text-gray-700 hover:text-gray-900 py-2">
                  Products
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-gray-900 py-2">
                  Categories
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-gray-900 py-2">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900 py-2">
                  Contact
                </Link>
                <Button variant="ghost" className="justify-start p-0">
                  <User className="h-5 w-5 mr-2" />
                  Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}
