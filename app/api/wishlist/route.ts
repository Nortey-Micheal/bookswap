import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 })
  }

  const user = db.users.find((u) => u.id === userId)
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const wishlistBooks = db.books.filter((b) => user.wishlist.includes(b.id))
  return NextResponse.json({ wishlist: wishlistBooks })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, bookId, action } = body

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: 'User ID and Book ID required' },
        { status: 400 }
      )
    }

    const user = db.users.find((u) => u.id === userId)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'add') {
      if (!user.wishlist.includes(bookId)) {
        user.wishlist.push(bookId)
      }
    } else if (action === 'remove') {
      user.wishlist = user.wishlist.filter((id) => id !== bookId)
    }

    return NextResponse.json({ wishlist: user.wishlist })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update wishlist' }, { status: 400 })
  }
}
