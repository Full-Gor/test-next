'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { useAuth } from '@/contexts/AuthContext'

interface Category {
  id: string
  name: string
  description: string | null
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

export default function CategoryPage() {
  const params = useParams()
  const { user } = useAuth()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategory()
    fetchProducts()
    if (user) {
      fetchFavorites()
    }
  }, [params.id, user])

  const fetchCategory = async () => {
    const res = await fetch(`/api/categories/${params.id}`)
    if (res.ok) {
      const data = await res.json()
      setCategory(data)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    const res = await fetch(`/api/products?categoryId=${params.id}`)
    if (res.ok) {
      const data = await res.json()
      setProducts(data)
    }
    setLoading(false)
  }

  const fetchFavorites = async () => {
    const res = await fetch('/api/favorites')
    if (res.ok) {
      const data = await res.json()
      setFavorites(data.map((f: { productId: string }) => f.productId))
    }
  }

  const handleFavoriteToggle = async (productId: string) => {
    await fetch('/api/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId })
    })
    fetchFavorites()
  }

  if (loading && !category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800">Catégorie non trouvée</h1>
          <Link href="/categories" className="text-indigo-600 hover:underline mt-4 inline-block">
            Retour aux catégories
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
          <li><Link href="/categories" className="hover:text-indigo-600">Catégories</Link></li>
          <li>/</li>
          <li className="text-gray-800">{category.name}</li>
        </ol>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 mt-2">{category.description}</p>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit dans cette catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}
