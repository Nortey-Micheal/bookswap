'use client'

import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Send, Heart, Users, TrendingUp, Search } from 'lucide-react'
import type { Book } from '@/lib/db'

export default function DashboardPage() {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books')
        const data = await res.json()
        setBooks(data.books)
      } catch (error) {
        console.error('Failed to fetch books:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [])

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage your books, exchanges, and discover new reads.
                </p>
              </div>
              <Link href="/list-book">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-base">
                  <Plus className="w-5 h-5 mr-2" />
                  List a Book
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-4 mb-12">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Books Shared</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {user?.books_shared || 0}
                  </p>
                </div>
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Rating</p>
                  <div className="flex items-center gap-1 mt-2">
                    <p className="text-3xl font-bold text-foreground">
                      {user?.rating?.toFixed(1) || '5.0'}
                    </p>
                    <span className="text-xl">⭐</span>
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Reviews</p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {user?.reviews_count || 0}
                  </p>
                </div>
                <Send className="w-8 h-8 text-primary" />
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Community</p>
                  <p className="text-3xl font-bold text-foreground mt-2">Active</p>
                </div>
                <Users className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>

          {/* Books Section */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">Available Books</h2>
              <Link href="/dashboard?tab=search">
                <Button variant="outline">Browse All</Button>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Books Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-muted rounded-lg h-80 animate-pulse"
                  />
                ))}
              </div>
            ) : filteredBooks.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <Link key={book.id} href={`/book/${book.id}`}>
                    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors group cursor-pointer h-full">
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        <img
                          src={book.cover}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-primary/90 px-2 py-1 rounded text-xs font-medium text-white">
                          {book.condition}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground truncate">
                          {book.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {book.author}
                        </p>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-medium text-foreground">
                              {book.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({book.reviews})
                            </span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-primary hover:text-primary/80"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No books found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  )
}
