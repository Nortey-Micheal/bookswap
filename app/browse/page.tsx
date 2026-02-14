"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import type { Book } from "@/lib/db";
import { BookCard } from "@/components/BookCard";

const GENRES = ["All", "Fiction", "Science Fiction", "Biography", "Self-Help"];

export default function BrowsePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setBooks(data.books);
        setFilteredBooks(data.books);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    let filtered = books;

    if (selectedGenre !== "All") {
      filtered = filtered.filter((b) => b.genre === selectedGenre);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(searchLower) ||
          b.author.toLowerCase().includes(searchLower),
      );
    }

    setFilteredBooks(filtered);
  }, [books, selectedGenre, searchTerm]);

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-card border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-6">
              Browse Books
            </h1>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, author, or genre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <div
              className={`${
                showFilters ? "block" : "hidden"
              } md:block w-full md:w-64 flex-shrink-0`}
            >
              <div className="bg-card rounded-lg p-6 border border-border sticky top-20">
                <div className="flex items-center justify-between mb-4 md:block">
                  <h3 className="font-bold text-secondary">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden text-muted-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">
                    Genre
                  </p>
                  <div className="space-y-2">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                          selectedGenre === genre
                            ? "bg-primary text-white"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase">
                    Condition
                  </p>
                  <div className="space-y-2">
                    {["Like New", "Good", "Fair"].map((condition) => (
                      <label
                        key={condition}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm text-foreground">
                          {condition}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Books Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {filteredBooks.length} books found
                </p>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-muted"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {isLoading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-muted rounded-lg h-96 animate-pulse"
                    />
                  ))}
                </div>
              ) : filteredBooks.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBooks.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground mb-4">
                    No books found
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedGenre("All");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
