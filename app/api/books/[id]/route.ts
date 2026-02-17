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
    const book = await prisma.book.update({
      data: {...body},
      where: {
        id
      },
      include: {
        owner: {
          select: {
            name: true
          }
        },
        reviews: true
      }
    }) 

    

    return NextResponse.json({ book })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update book' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const book = await prisma.book.delete({
    where: {id}
  })

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
