import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const status = searchParams.get('status')

  let exchanges = [...db.exchanges]

  if (userId) {
    exchanges = exchanges.filter(
      (e) => e.initiator_id === userId || e.responder_id === userId
    )
  }

  if (status) {
    exchanges = exchanges.filter((e) => e.status === status)
  }

  return NextResponse.json({ exchanges })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newExchange = {
      id: `exchange-${Date.now()}`,
      ...body,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    db.exchanges.push(newExchange)
    return NextResponse.json({ exchange: newExchange }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create exchange' }, { status: 400 })
  }
}
