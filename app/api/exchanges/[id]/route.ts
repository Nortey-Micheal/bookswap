import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const exchangeIndex = db.exchanges.findIndex((e) => e.id === id)

    if (exchangeIndex === -1) {
      return NextResponse.json({ error: 'Exchange not found' }, { status: 404 })
    }

    db.exchanges[exchangeIndex] = {
      ...db.exchanges[exchangeIndex],
      ...body,
      updated_at: new Date().toISOString(),
    }

    // Update book statuses if exchange is completed
    if (body.status === 'completed') {
      const initiatorBookIndex = db.books.findIndex(
        (b) => b.id === db.exchanges[exchangeIndex].initiator_book_id
      )
      const responderBookIndex = db.books.findIndex(
        (b) => b.id === db.exchanges[exchangeIndex].responder_book_id
      )

      if (initiatorBookIndex !== -1) {
        db.books[initiatorBookIndex].status = 'exchanged'
      }
      if (responderBookIndex !== -1) {
        db.books[responderBookIndex].status = 'exchanged'
      }
    }

    return NextResponse.json({ exchange: db.exchanges[exchangeIndex] })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update exchange' }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const exchangeIndex = db.exchanges.findIndex((e) => e.id === id)

  if (exchangeIndex === -1) {
    return NextResponse.json({ error: 'Exchange not found' }, { status: 404 })
  }

  db.exchanges.splice(exchangeIndex, 1)
  return NextResponse.json({ success: true })
}
