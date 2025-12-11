import { NextResponse } from 'next/server'
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

    const orders = await prisma.order.findMany({
      where: user.isAdmin ? {} : { userId: user.id },
      include: {
        items: {
          include: { product: true }
        },
        user: {
          select: { username: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des commandes' },
      { status: 500 }
    )
  }
}

export async function POST() {
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
      include: { product: true }
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Le panier est vide' },
        { status: 400 }
      )
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price
          }))
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    })

    await prisma.cartItem.deleteMany({
      where: { userId: user.id }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Order create error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la commande' },
      { status: 500 }
    )
  }
}
