'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, Star } from 'lucide-react'
import { useState } from 'react'
import type { Book } from '@/lib/db'

interface BookCardProps {
  book: Book
  onWishlistToggle?: (bookId: string) => void
  isInWishlist?: boolean
}

export function BookCard({ book, onWishlistToggle, isInWishlist }: BookCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavored, setIsFavored] = useState(isInWishlist || false)

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsFavored(!isFavored)
    onWishlistToggle?.(book.id)
  }

  return (
    <Link href={`/book/${book.id}`}>
      <div
        className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Book Cover */}
        <div className="relative h-64 bg-muted overflow-hidden">
          <Image
            src={book.cover}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isFavored ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>

          {/* Condition Badge */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-secondary">
            {book.condition === 'like-new' && 'Like New'}
            {book.condition === 'good' && 'Good'}
            {book.condition === 'fair' && 'Fair'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Genre */}
          <span className="text-xs font-medium text-primary mb-2">{book.genre}</span>

          {/* Title */}
          <h3 className="font-bold text-card-foreground line-clamp-2 mb-1 text-sm">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-xs text-muted-foreground mb-3">{book.author}</p>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(book.rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {book.rating} ({book.reviews})
            </span>
          </div>

          {/* Owner Info */}
          <div className="text-xs text-muted-foreground border-t border-border pt-3 mt-auto">
            <p className="font-medium text-card-foreground">{book.owner_name}</p>
            <p>{book.owner_location}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
