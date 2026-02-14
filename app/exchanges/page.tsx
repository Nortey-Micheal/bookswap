'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Exchange {
  id: string
  initiator_name: string
  responder_name: string
  initiator_book_id: string
  responder_book_id: string
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

const mockExchanges: Exchange[] = [
  {
    id: 'exchange-1',
    initiator_name: 'Sarah Chen',
    responder_name: 'Marcus Rodriguez',
    initiator_book_id: 'book-1',
    responder_book_id: 'book-2',
    status: 'pending',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exchange-2',
    initiator_name: 'Marcus Rodriguez',
    responder_name: 'Emma Watson',
    initiator_book_id: 'book-5',
    responder_book_id: 'book-6',
    status: 'accepted',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'exchange-3',
    initiator_name: 'Emma Watson',
    responder_name: 'Sarah Chen',
    initiator_book_id: 'book-3',
    responder_book_id: 'book-4',
    status: 'completed',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function ExchangesPage() {
  const [exchanges, setExchanges] = useState<Exchange[]>(mockExchanges)
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'accepted' | 'completed'>(
    'all'
  )

  const filteredExchanges =
    activeFilter === 'all'
      ? exchanges
      : exchanges.filter((e) => e.status === activeFilter)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500 fill-green-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Awaiting Response</Badge>
      case 'accepted':
        return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return null
    }
  }

  const handleStatusChange = async (exchangeId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/exchanges/${exchangeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.ok) {
        setExchanges(
          exchanges.map((e) =>
            e.id === exchangeId ? { ...e, status: newStatus as any } : e
          )
        )
      }
    } catch (error) {
      console.error('Failed to update exchange:', error)
    }
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background">

      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            My Exchanges
          </h1>
          <p className="text-muted-foreground">
            Track and manage your book exchanges with the community
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-card border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'accepted', 'completed'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeFilter === filter
                    ? 'bg-primary text-white'
                    : 'bg-background border border-border text-foreground hover:border-primary'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                {filter !== 'all' && (
                  <span className="ml-2">
                    ({exchanges.filter((e) => e.status === filter).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Exchanges List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredExchanges.length > 0 ? (
            <div className="space-y-4">
              {filteredExchanges.map((exchange) => (
                <div
                  key={exchange.id}
                  className="p-6 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(exchange.status)}
                        <h3 className="font-bold text-lg text-secondary">
                          Exchange with {exchange.responder_name}
                        </h3>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">
                        <span className="text-foreground font-medium">Book ID: </span>
                        {exchange.initiator_book_id} → {exchange.responder_book_id}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Started:{' '}
                        {new Date(exchange.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>

                    {/* Right Content */}
                    <div className="flex items-center gap-3">
                      {getStatusBadge(exchange.status)}

                      <div className="flex gap-2">
                        {exchange.status === 'pending' && (
                          <>
                            <Button
                              onClick={() =>
                                handleStatusChange(exchange.id, 'accepted')
                              }
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Accept
                            </Button>
                            <Button
                              onClick={() =>
                                handleStatusChange(exchange.id, 'cancelled')
                              }
                              size="sm"
                              variant="outline"
                            >
                              Decline
                            </Button>
                          </>
                        )}

                        {exchange.status === 'accepted' && (
                          <Button
                            onClick={() =>
                              handleStatusChange(exchange.id, 'completed')
                            }
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Mark Complete
                          </Button>
                        )}

                        <Button variant="ghost" size="sm">
                          Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                <ArrowRight className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2">
                No exchanges yet
              </h2>
              <p className="text-muted-foreground mb-6">
                Start proposing exchanges to other members
              </p>
              <Link href="/browse">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Browse Books
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      </main>
    </ProtectedRoute>
  )
}
