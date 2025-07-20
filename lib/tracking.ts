// Generate a simple user ID (in production, this would come from authentication)
const getUserId = () => {
  if (typeof window !== "undefined") {
    let userId = localStorage.getItem("userId")
    if (!userId) {
      userId = `user_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem("userId", userId)
    }
    return userId
  }
  return "anonymous"
}

export interface TrackingEvent {
  userId: string
  event: string
  productId?: string | number
  productName?: string
  price?: number
  quantity?: number
  category?: string
  searchQuery?: string
  page?: string
  metadata?: Record<string, any>
}

export const trackEvent = async (eventData: Omit<TrackingEvent, "userId">) => {
  try {
    const payload: TrackingEvent = {
      userId: getUserId(),
      ...eventData,
    }

    const response = await fetch("/api/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error("Tracking failed:", response.statusText)
    }
  } catch (error) {
    console.error("Error tracking event:", error)
  }
}

// Predefined tracking functions for common ecommerce events
export const tracking = {
  // Product events
  addToCart: (product: { id: number; name: string; price: number; category?: string }, quantity = 1) => {
    trackEvent({
      event: "add_to_cart",
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      category: product.category,
    })
  },

  removeFromCart: (product: { id: number; name: string; price: number; category?: string }, quantity = 1) => {
    trackEvent({
      event: "remove_from_cart",
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      category: product.category,
    })
  },

  updateCartQuantity: (
    product: { id: number; name: string; price: number; category?: string },
    oldQuantity: number,
    newQuantity: number,
  ) => {
    trackEvent({
      event: "update_cart_quantity",
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: newQuantity,
      category: product.category,
      metadata: { oldQuantity, newQuantity },
    })
  },

  viewProduct: (product: { id: number; name: string; price: number; category?: string }) => {
    trackEvent({
      event: "view_product",
      productId: product.id,
      productName: product.name,
      price: product.price,
      category: product.category,
    })
  },

  // Page events
  viewPage: (page: string) => {
    trackEvent({
      event: "page_view",
      page,
    })
  },

  // Search events
  search: (query: string) => {
    trackEvent({
      event: "search",
      searchQuery: query,
    })
  },

  // Checkout events
  beginCheckout: (totalPrice: number, itemCount: number) => {
    trackEvent({
      event: "begin_checkout",
      price: totalPrice,
      quantity: itemCount,
    })
  },

  // Newsletter events
  subscribeNewsletter: (email: string) => {
    trackEvent({
      event: "subscribe_newsletter",
      metadata: { email },
    })
  },
}
