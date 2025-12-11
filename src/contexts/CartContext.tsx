'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'

interface Product {
  id: string
  name: string
  price: number
  image: string | null
}

interface CartItem {
  id: string
  productId: string
  quantity: number
  product: Product
}

interface CartContextType {
  items: CartItem[]
  loading: boolean
  addToCart: (productId: string, quantity?: number) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const refreshCart = async () => {
    if (!user) {
      setItems([])
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/cart')
      if (res.ok) {
        const data = await res.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Failed to refresh cart:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [user])

  const addToCart = async (productId: string, quantity = 1) => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity })
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error)
    }

    await refreshCart()
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error)
    }

    await refreshCart()
  }

  const removeFromCart = async (itemId: string) => {
    const res = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE'
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error)
    }

    await refreshCart()
  }

  const clearCart = async () => {
    const res = await fetch('/api/cart', { method: 'DELETE' })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error)
    }

    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
