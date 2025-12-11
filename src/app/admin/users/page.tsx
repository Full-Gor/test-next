'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  username: string
  isAdmin: boolean
  createdAt: string
  _count: {
    orders: number
    cart: number
    favorites: number
  }
}

export default function AdminUsersPage() {
  const { user: currentUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !currentUser?.isAdmin) {
      router.push('/')
    } else if (currentUser?.isAdmin) {
      fetchUsers()
    }
  }, [currentUser, authLoading, router])

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users')
    if (res.ok) {
      const data = await res.json()
      setUsers(data)
    }
    setLoading(false)
  }

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    if (userId === currentUser?.id) {
      alert('Vous ne pouvez pas modifier vos propres droits admin.')
      return
    }

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, isAdmin })
    })

    if (res.ok) {
      fetchUsers()
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

  if (!currentUser?.isAdmin) return null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link href="/admin" className="text-indigo-600 hover:underline text-sm">
          ← Retour au dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">Gérer les utilisateurs</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Inscription</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-800">{user.username}</div>
                  <div className="text-sm text-gray-500">
                    {user._count.favorites} favoris • {user._count.cart} articles en panier
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.isAdmin ? 'Admin' : 'Utilisateur'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {user._count.orders}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4">
                  {user.id !== currentUser?.id ? (
                    <button
                      onClick={() => toggleAdmin(user.id, !user.isAdmin)}
                      className={`text-sm ${
                        user.isAdmin ? 'text-red-600 hover:underline' : 'text-indigo-600 hover:underline'
                      }`}
                    >
                      {user.isAdmin ? 'Retirer admin' : 'Rendre admin'}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">Vous</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Aucun utilisateur
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
