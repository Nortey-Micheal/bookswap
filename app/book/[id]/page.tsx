'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Star, Heart, Share2, MapPin, Award } from 'lucide-react'
import type { Book } from '@/lib/db'
import { Footer } from '@/components/Footer'
import { Navigation } from '@/components/Navigation'

interface Review {
  id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string
  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFavored, setIsFavored] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' })

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`)
        const data = await res.json()
        setBook(data.book)
        setReviews(data.reviews)
      } catch (error) {
        console.error('Failed to fetch book:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBook()
  }, [bookId])

  const handleAddReview = async () => {
    if (!book) return

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          userId: 'user-1',
          userName: 'You',
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setReviews([...reviews, data.review])
        setNewReview({ rating: 5, comment: '' })
        setShowReviewForm(false)

        // Refresh book data
        const bookRes = await fetch(`/api/books/${bookId}`)
        const bookData = await bookRes.json()
        setBook(bookData.book)
      }
    } catch (error) {
      console.error('Failed to add review:', error)
    }
  }

  const handleExchange = async () => {
    if (!book) return
    alert(`Exchange request sent to ${book.owner_name}! Check your exchanges page for updates.`)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
          <Footer />
        </main>
      </ProtectedRoute>
    )
  }

  if (!book) {
    return (
      <ProtectedRoute >
        <main className="min-h-screen bg-background">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <p className="text-muted-foreground mb-4">Book not found</p>
            <Link href="/browse">
              <Button variant="outline">Back to Browse</Button>
            </Link>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  if (!book) {
    return (
      <ProtectedRoute>
        <Navbar />
        <main className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <p className="text-muted-foreground mb-4">Book not found</p>
          </div>
        </main>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-sm text-muted-foreground">
        <Link href="/browse" className="hover:text-primary">
          Browse
        </Link>
        {' / '}
        <span>{book.title}</span>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg mb-6">
              <Image
                // width={500}
                // height={500}
                src={book.cover}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleExchange}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Propose Exchange
              </Button>
              <button
                onClick={() => setIsFavored(!isFavored)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavored ? 'fill-red-500 text-red-500' : 'text-gray-400'
                  }`}
                />
                {isFavored ? 'Saved' : 'Save to Wishlist'}
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            {/* Title & Meta */}
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-accent/20 text-primary rounded-full text-sm font-medium mb-3">
                {book.genre}
              </span>
              <h1 className="text-4xl font-bold text-secondary mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">by {book.author}</p>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(book.rating)
                            ? 'fill-accent text-accent'
                            : 'text-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{book.rating}</span>
                  <span className="text-muted-foreground">({book.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Book Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-card rounded-lg border border-border">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                  ISBN
                </p>
                <p className="text-foreground font-mono">{book.isbn}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                  Condition
                </p>
                <p className="text-foreground font-medium">
                  {book.condition === 'like-new' && 'Like New'}
                  {book.condition === 'good' && 'Good'}
                  {book.condition === 'fair' && 'Fair'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                  Listed
                </p>
                <p className="text-foreground">{new Date(book.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                  Status
                </p>
                <p className="text-foreground capitalize">{book.status}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-secondary mb-3">About This Book</h2>
              <p className="text-foreground leading-relaxed text-lg">{book.description}</p>
            </div>

            {/* Owner Card */}
            <div className="p-6 bg-card rounded-lg border border-border">
              <h3 className="text-lg font-bold text-secondary mb-4">Book Owner</h3>
              <Link href={`/profile/${book.owner_id}`}>
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <p className="font-bold text-foreground">{book.owner_name}</p>
                  <div className="flex items-center gap-1 text-muted-foreground my-1">
                    <MapPin className="w-4 h-4" />
                    {book.owner_location}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Award className="w-4 h-4" />
                    <span>Member since 2022</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-secondary mb-6">Reviews ({reviews.length})</h2>

          {!showReviewForm && (
            <Button
              onClick={() => setShowReviewForm(true)}
              className="mb-8 bg-primary hover:bg-primary/90 text-white"
            >
              Write a Review
            </Button>
          )}

          {showReviewForm && (
            <div className="bg-background rounded-lg p-6 border border-border mb-8">
              <h3 className="font-bold text-secondary mb-4">Share Your Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        onClick={() => setNewReview({ ...newReview, rating: i })}
                        className="p-2"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            i <= newReview.rating
                              ? 'fill-accent text-accent'
                              : 'text-muted'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Share your thoughts about this book..."
                    className="w-full p-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddReview}
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Submit Review
                  </Button>
                  <Button
                    onClick={() => setShowReviewForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 bg-background rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-foreground">{review.user_name}</p>
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-accent text-accent'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-2">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No reviews yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </section>

      </main>
    </ProtectedRoute>
  )
}
