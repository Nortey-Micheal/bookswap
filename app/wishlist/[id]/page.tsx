'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { BookCard } from '@/components/BookCard'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Heart, ArrowRight } from 'lucide-react'
import type { Book } from '@/lib/db'

export default function WishlistPage() {
  const params = useParams()
  const userId = params.id as string
  const [wishlistBooks, setWishlistBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`/api/wishlist?userId=${userId}`)
        const data = await res.json()
        setWishlistBooks(data.wishlist)
      } catch (error) {
        console.error('Failed to fetch wishlist:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [userId])

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, bookId, action: 'remove' }),
      })

      setWishlistBooks(wishlistBooks.filter((b) => b.id !== bookId))
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-3xl md:text-4xl font-bold text-secondary">My Wishlist</h1>
          </div>
          <p className="text-muted-foreground">
            {wishlistBooks.length} {wishlistBooks.length === 1 ? 'book' : 'books'} saved
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-muted rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : wishlistBooks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistBooks.map((book) => (
                <div key={book.id} className="relative">
                  <BookCard book={book} />
                  <button
                    onClick={() => handleRemoveFromWishlist(book.id)}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all z-10"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-6">
                Start exploring and save books you'd like to read
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

      <Footer />
    </main>
  )
}
