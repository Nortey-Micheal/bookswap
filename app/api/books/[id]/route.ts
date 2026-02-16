import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const book = await prisma.book.findUnique({
    where: {
      id
    },
    include: {
      reviews: true,
      owner: {
        select: {
          name: true
        }
      },
    }
  })

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  const reviews = await prisma.review.findMany({
    where: {
      book_id: id
    }
  })

  return NextResponse.json({ book, reviews })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const bookIndex = db.books.findIndex((b) => b.id === id)

    if (bookIndex === -1) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    db.books[bookIndex] = {
      ...db.books[bookIndex],
      ...body,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json({ book: db.books[bookIndex] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const bookIndex = db.books.findIndex((b) => b.id === id)

  if (bookIndex === -1) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  db.books.splice(bookIndex, 1)
  return NextResponse.json({ success: true })
}
