"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { ToastContainer } from "@/components/ui/toast"

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  duration?: number
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  const toast = (options: Omit<Toast, "id">) => {
    context.addToast(options)
  }

  // Convenience methods
  toast.success = (title: string, description?: string) => {
    context.addToast({ title, description, variant: "success" })
  }

  toast.error = (title: string, description?: string) => {
    context.addToast({ title, description, variant: "destructive" })
  }

  toast.default = (title: string, description?: string) => {
    context.addToast({ title, description, variant: "default" })
  }

  return { toast }
}
