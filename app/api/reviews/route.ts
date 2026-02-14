import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const bookId = searchParams.get('bookId')

  if (!bookId) {
    return NextResponse.json({ reviews: db.reviews })
  }

  const reviews = db.reviews.filter((r) => r.book_id === bookId)
  return NextResponse.json({ reviews })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bookId, userId, userName, rating, comment } = body

    if (!bookId || !userId || !rating) {
      return NextResponse.json(
        { error: 'Book ID, User ID, and rating are required' },
        { status: 400 }
      )
    }

    const newReview = {
      id: `review-${Date.now()}`,
      book_id: bookId,
      user_id: userId,
      user_name: userName,
      rating,
      comment: comment || '',
      created_at: new Date().toISOString(),
    }

    db.reviews.push(newReview)

    // Update book rating
    const bookIndex = db.books.findIndex((b) => b.id === bookId)
    if (bookIndex !== -1) {
      const bookReviews = db.reviews.filter((r) => r.book_id === bookId)
      const avgRating =
        bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length
      db.books[bookIndex].rating = Math.round(avgRating * 10) / 10
      db.books[bookIndex].reviews = bookReviews.length
    }

    return NextResponse.json({ review: newReview }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 400 })
  }
}
