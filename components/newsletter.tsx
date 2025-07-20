"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { tracking } from "@/lib/tracking"
import { Check } from "lucide-react"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      // Track newsletter subscription
      tracking.subscribeNewsletter(email)

      setIsSubscribed(true)
      setEmail("")

      // Reset after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  return (
    <section className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special offers.
        </p>

        {isSubscribed ? (
          <div className="max-w-md mx-auto flex items-center justify-center gap-2 text-green-400">
            <Check className="h-5 w-5" />
            <span className="text-lg font-medium">Thank you for subscribing!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-gray-900"
              required
            />
            <Button type="submit" className="bg-white text-gray-900 hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </section>
  )
}
