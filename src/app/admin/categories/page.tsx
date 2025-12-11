'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  description: string | null
  _count: { products: number }
}

export default function AdminCategoriesPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  })

  useEffect(() => {
    if (!authLoading && !user?.isAdmin) {
      router.push('/')
    } else if (user?.isAdmin) {
      fetchCategories()
    }
  }, [user, authLoading, router])

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
    const method = editingCategory ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      setShowForm(false)
      setEditingCategory(null)
      setFormData({ name: '', description: '', image: '' })
      fetchCategories()
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      image: ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette catégorie ? Tous les produits associés seront également supprimés.')) return

    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchCategories()
    }
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
        </div>
      </div>
    )
  }

  if (!user?.isAdmin) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin" className="text-indigo-600 hover:underline text-sm">
            ← Retour au dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Gérer les catégories</h1>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null)
            setFormData({ name: '', description: '', image: '' })
            setShowForm(true)
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Ajouter une catégorie
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://..."
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  {editingCategory ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
            {category.description && (
              <p className="text-gray-600 mt-2 line-clamp-2">{category.description}</p>
            )}
            <p className="text-indigo-600 mt-2">
              {category._count.products} produit{category._count.products > 1 ? 's' : ''}
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(category)}
                className="text-indigo-600 hover:underline text-sm"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            Aucune catégorie. Cliquez sur &quot;Ajouter une catégorie&quot; pour commencer.
          </div>
        )}
      </div>
    </div>
  )
}
