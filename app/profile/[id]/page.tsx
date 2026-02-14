'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navigation } from '@/components/Navigation'
import { BookCard } from '@/components/BookCard'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Star, MapPin, Award, Calendar, Users } from 'lucide-react'
import type { User, Book } from '@/lib/db'

export default function ProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<User | null>(null)
  const [userBooks, setUserBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'books' | 'stats'>('books')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, booksRes] = await Promise.all([
          fetch(`/api/users?userId=${userId}`),
          fetch(`/api/books?userId=${userId}`),
        ])

        const userData = await userRes.json()
        const booksData = await booksRes.json()

        setUser(userData.user)
        setUserBooks(booksData.books)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground mb-4">User not found</p>
          <Link href="/browse">
            <Button variant="outline">Back to Browse</Button>
          </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Profile Header */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                {user.name}
              </h1>
              <p className="text-muted-foreground mb-4 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {user.location}
              </p>

              <p className="text-foreground mb-6 max-w-2xl">{user.bio}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-2xl font-bold text-primary">{user.books_shared}</p>
                  <p className="text-xs text-muted-foreground">Books Shared</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{user.reviews_count}</p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-primary">{user.rating}</p>
                    <Star className="w-5 h-5 fill-accent text-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="mt-4 flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Member since {new Date(user.member_since).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                Contact Member
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('books')}
              className={`px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'books'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Books ({userBooks.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Statistics
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'books' && (
            <div>
              {userBooks.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No books listed yet</p>
                  <Link href="/list-book">
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      List Your First Book
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Detailed Stats */}
              <div className="p-8 bg-card rounded-lg border border-border">
                <h3 className="text-lg font-bold text-secondary mb-6">Member Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-foreground">Total Books Shared</span>
                    <span className="font-bold text-primary text-lg">{user.books_shared}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-foreground">Total Reviews Received</span>
                    <span className="font-bold text-primary text-lg">{user.reviews_count}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-foreground">Average Rating</span>
                    <span className="font-bold text-primary text-lg">{user.rating}/5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Member Duration</span>
                    <span className="font-bold text-primary text-lg">
                      {new Date().getFullYear() - new Date(user.member_since).getFullYear()} years
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="p-8 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-primary/20">
                <h3 className="text-lg font-bold text-secondary mb-6">Trust & Reputation</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Highly Rated Member</p>
                      <p className="text-xs text-muted-foreground">
                        {user.rating >= 4.7 ? 'Excellent' : 'Good'} reputation
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Active Community Member</p>
                      <p className="text-xs text-muted-foreground">
                        Verified in good standing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Trusted Exchanger</p>
                      <p className="text-xs text-muted-foreground">
                        Safe exchanges guaranteed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
