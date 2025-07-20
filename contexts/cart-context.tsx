"use client"

import { createContext, useContext, useReducer, type ReactNode } from "react"
import { tracking } from "@/lib/tracking"

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_CART" }

const CartContext = createContext<{
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  getTotalPrice: () => number
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + action.payload.quantity } : item,
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      }
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.payload.id),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
        ),
      }
    }
    case "REMOVE_ITEM": {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      }
    }
    case "CLEAR_CART": {
      return {
        ...state,
        items: [],
      }
    }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })

    // Track the add to cart event
    tracking.addToCart(
      {
        id: item.id,
        name: item.name,
        price: item.price,
      },
      item.quantity,
    )
  }

  const updateQuantity = (id: number, quantity: number) => {
    const existingItem = state.items.find((item) => item.id === id)

    if (existingItem && quantity > 0) {
      // Track quantity update
      tracking.updateCartQuantity(
        {
          id: existingItem.id,
          name: existingItem.name,
          price: existingItem.price,
        },
        existingItem.quantity,
        quantity,
      )
    }

    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    const existingItem = state.items.find((item) => item.id === id)

    if (existingItem) {
      // Track item removal
      tracking.removeFromCart(
        {
          id: existingItem.id,
          name: existingItem.name,
          price: existingItem.price,
        },
        existingItem.quantity,
      )
    }

    dispatch({ type: "REMOVE_ITEM", payload: { id } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
