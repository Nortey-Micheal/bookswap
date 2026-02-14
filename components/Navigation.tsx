'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X, Search, User, Heart, Zap } from 'lucide-react'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser] = useState('user-1') // Mock current user

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-secondary">BookFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/browse"
              className="text-foreground hover:text-primary transition-colors"
            >
              Browse Books
            </Link>
            <Link
              href="/exchanges"
              className="text-foreground hover:text-primary transition-colors"
            >
              Exchanges
            </Link>
            <Link
              href="/how-it-works"
              className="text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Search className="w-5 h-5 text-foreground" />
            </button>
            <Link href={`/profile/${currentUser}`}>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <User className="w-5 h-5 text-foreground" />
              </button>
            </Link>
            <Link href={`/wishlist/${currentUser}`}>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Heart className="w-5 h-5 text-foreground" />
              </button>
            </Link>
            <Link href="/list-book">
              <Button className="bg-primary hover:bg-primary/90 text-white">
                List Book
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-muted rounded-lg"
          >
            {isOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link
              href="/browse"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              Browse Books
            </Link>
            <Link
              href="/exchanges"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              Exchanges
            </Link>
            <Link
              href="/how-it-works"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              How It Works
            </Link>
            <Link
              href={`/profile/${currentUser}`}
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              My Profile
            </Link>
            <Link
              href={`/wishlist/${currentUser}`}
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg"
            >
              My Wishlist
            </Link>
            <Link href="/list-book" className="block px-4 py-2">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                List Book
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
