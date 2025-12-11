import Link from 'next/link'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } }
    },
    orderBy: { name: 'asc' }
  })
  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Nos catégories</h1>

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucune catégorie disponible.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition group"
            >
              <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-gray-600 mt-2 line-clamp-2">{category.description}</p>
              )}
              <p className="text-indigo-600 mt-4 font-medium">
                {category._count.products} produit{category._count.products > 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
