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

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          include: { category: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du panier' },
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

    const { productId, quantity = 1 } = await request.json()

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId
        }
      }
    })

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      })
      return NextResponse.json(updatedItem)
    }

    const cartItem = await prisma.cartItem.create({
      data: {
        userId: user.id,
        productId,
        quantity
      },
      include: { product: true }
    })

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Cart add error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'ajout au panier' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Non connecté' },
        { status: 401 }
      )
    }

    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart clear error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du panier' },
      { status: 500 }
    )
  }
}
