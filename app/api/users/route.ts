import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ user })
  }

  return NextResponse.json({ error: 'User not found' }, { status: 404 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newUser = await prisma.user.create({
      data: {
        ...body,
        wishlist: [],
        active_exchanges: [],
        member_since: new Date().toISOString().split('T')[0],
        rating: 5,
        books_shared: 0,
      }
    })

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
  }
}
