'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'

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

export default function ProductDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
    if (user) {
      checkFavorite()
    }
  }, [params.id, user])

  const fetchProduct = async () => {
    const res = await fetch(`/api/products/${params.id}`)
    if (res.ok) {
      const data = await res.json()
      setProduct(data)
    }
    setLoading(false)
  }

  const checkFavorite = async () => {
    const res = await fetch('/api/favorites')
    if (res.ok) {
      const data = await res.json()
      setIsFavorite(data.some((f: { productId: string }) => f.productId === params.id))
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    setAddingToCart(true)
    try {
      await addToCart(product!.id, quantity)
      alert('Produit ajouté au panier !')
    } catch (error) {
      console.error('Failed to add to cart:', error)
    } finally {
      setAddingToCart(false)
    }
  }

  const handleToggleFavorite = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product!.id })
    })
    setIsFavorite(!isFavorite)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800">Produit non trouvé</h1>
          <Link href="/products" className="text-indigo-600 hover:underline mt-4 inline-block">
            Retour aux produits
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-indigo-600">Accueil</Link></li>
          <li>/</li>
          <li><Link href="/products" className="hover:text-indigo-600">Produits</Link></li>
          <li>/</li>
          <li className="text-gray-800">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative h-96 md:h-[500px] bg-gray-100 rounded-lg overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Link
              href={`/categories/${product.category.id}`}
              className="text-sm text-indigo-600 hover:underline"
            >
              {product.category.name}
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
          </div>

          <p className="text-4xl font-bold text-indigo-600">{product.price.toFixed(2)} €</p>

          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm ${
              product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="text-gray-700">Quantité :</label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              className="flex-1 bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {addingToCart ? 'Ajout...' : 'Ajouter au panier'}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`p-3 border rounded-md transition ${
                isFavorite
                  ? 'border-red-300 bg-red-50 text-red-500'
                  : 'border-gray-300 hover:border-gray-400 text-gray-600'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isFavorite ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
