import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Non connecté' },
        { status: 401 }
      )
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Favorites fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des favoris' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Non connecté' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    })

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id }
      })
      return NextResponse.json({ removed: true })
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        productId
      },
      include: { product: true }
    })

    return NextResponse.json(favorite)
  } catch (error) {
    console.error('Favorite toggle error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification des favoris' },
      { status: 500 }
    )
  }
}
