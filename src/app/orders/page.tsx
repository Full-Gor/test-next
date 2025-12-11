'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
  }
}

interface Order {
  id: string
  total: number
  status: string
  createdAt: string
  items: OrderItem[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
  PROCESSING: { label: 'En traitement', color: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800' },
  DELIVERED: { label: 'Livrée', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-800' }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchOrders = async () => {
    const res = await fetch('/api/orders')
    if (res.ok) {
      const data = await res.json()
      setOrders(data)
    }
    setLoading(false)
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Connectez-vous pour voir vos commandes</h1>
          <Link href="/login" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
            Se connecter
          </Link>
        </div>
      </div>
    )
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mes commandes</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aucune commande</h2>
          <p className="text-gray-600 mb-4">Vous n&apos;avez pas encore passé de commande</p>
          <Link href="/products" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition inline-block">
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Commande #{order.id.slice(-8)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusLabels[order.status]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {statusLabels[order.status]?.label || order.status}
                  </span>
                  <span className="font-bold text-indigo-600">{order.total.toFixed(2)} €</span>
                </div>
              </div>

              <div className="p-4">
                <ul className="divide-y">
                  {order.items.map((item) => (
                    <li key={item.id} className="py-2 flex justify-between">
                      <div>
                        <Link href={`/products/${item.product.id}`} className="text-gray-800 hover:text-indigo-600">
                          {item.product.name}
                        </Link>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="text-gray-800">{(item.price * item.quantity).toFixed(2)} €</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
