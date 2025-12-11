import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Non connecté' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { quantity } = await request.json()

    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      await prisma.cartItem.delete({
        where: { id }
      })
      return NextResponse.json({ success: true, deleted: true })
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Cart update error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du panier' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSession()

    if (!user) {
      return NextResponse.json(
        { error: 'Non connecté' },
        { status: 401 }
      )
    }

    const { id } = await params

    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: user.id }
    })

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    await prisma.cartItem.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart delete error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    )
  }
}
