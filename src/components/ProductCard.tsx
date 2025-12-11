'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { useState } from 'react'

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image: string | null
  stock: number
  category: Category
}

interface ProductCardProps {
  product: Product
  onFavoriteToggle?: (productId: string) => void
  isFavorite?: boolean
}

export default function ProductCard({ product, onFavoriteToggle, isFavorite = false }: ProductCardProps) {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      window.location.href = '/login'
      return
    }

    setLoading(true)
    try {
      await addToCart(product.id)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      window.location.href = '/login'
      return
    }
    onFavoriteToggle?.(product.id)
  }

  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 bg-gray-100">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}

          {user && (
            <button
              onClick={handleFavorite}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isFavorite ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-5 h-5 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          )}

          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold">Rupture de stock</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <span className="text-xs text-indigo-600 font-medium">{product.category.name}</span>
          <h3 className="text-lg font-semibold text-gray-800 mt-1 group-hover:text-indigo-600 transition">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <span className="text-xl font-bold text-indigo-600">{product.price.toFixed(2)} €</span>
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}
