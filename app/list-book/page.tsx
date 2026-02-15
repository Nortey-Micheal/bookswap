'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'

const GENRES = ['Fiction', 'Science Fiction', 'Biography', 'Self-Help', 'Mystery', 'Romance', 'History', 'Other']
const CONDITIONS = ['like-new', 'good', 'fair']

export default function ListBookPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    genre: 'Fiction',
    condition: 'good',
    cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600&fit=crop',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          owner_id: 'user-1',
          owner_name: 'You',
          owner_location: 'San Francisco, CA',
          location: 'San Francisco, CA',
          status: 'available',
          rating: 0,
          reviews: 0,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/book/${data.book.id}`)
      } else {
        alert('Failed to list book')
      }
    } catch (error) {
      console.error('Error listing book:', error)
      alert('Error listing book')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background">

      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-2">
            List Your Book
          </h1>
          <p className="text-muted-foreground">
            Share your books with the community and find the perfect exchange
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Cover Image Preview */}
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-foreground block mb-3">
                  Book Cover
                </label>
                <div className="relative h-64 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center cursor-pointer group hover:border-primary transition-colors">
                  <img
                    src={formData.cover}
                    alt="Book cover preview"
                    className="w-full h-full object-cover group-hover:opacity-80"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Book Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Author *
                </label>
                <Input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                  required
                />
              </div>

              {/* ISBN */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  ISBN
                </label>
                <Input
                  type="text"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="ISBN (optional)"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Genre *
                </label>
                <select
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="text-sm font-semibold text-foreground block mb-2">
                  Book Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c}>
                      {c === 'like-new' ? 'Like New' : c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="text-sm font-semibold text-foreground block mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the book, its condition, and why you're sharing it..."
                rows={5}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white px-8"
              >
                {isSubmitting ? 'Listing...' : 'List Book'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              * Required fields. Your listing will be reviewed before being posted to the community.
            </p>
          </form>
        </div>
      </section>
      </main>
    </ProtectedRoute>
  )
}
