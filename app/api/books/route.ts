import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const genre = searchParams.get('genre')
  const search = searchParams.get('search')
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  let books = [...db.books]

  if (genre && genre !== 'all') {
    books = books.filter((b) => b.genre === genre)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(searchLower) ||
        b.author.toLowerCase().includes(searchLower) ||
        b.description.toLowerCase().includes(searchLower)
    )
  }

  if (userId) {
    books = books.filter((b) => b.owner_id === userId)
  }

  if (status) {
    books = books.filter((b) => b.status === status)
  }

  return NextResponse.json({ books })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newBook = {
      id: `book-${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rating: 0,
      reviews: 0,
    }

    db.books.push(newBook)
    return NextResponse.json({ book: newBook }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create book' }, { status: 400 })
  }
}
