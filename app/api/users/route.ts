import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (userId) {
    const user = db.users.find((u) => u.id === userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ user })
  }

  return NextResponse.json({ users: db.users })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newUser = {
      id: `user-${Date.now()}`,
      ...body,
      wishlist: [],
      active_exchanges: [],
      member_since: new Date().toISOString().split('T')[0],
      rating: 5,
      reviews_count: 0,
      books_shared: 0,
    }

    db.users.push(newUser)
    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 })
  }
}
