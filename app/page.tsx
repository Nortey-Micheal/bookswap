"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookIcon,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type {  Book } from "@/lib/generated/prisma/client";
import { useSelector } from "react-redux";
import { StoreType } from "@/lib/store";

export default function Home() {
  const user = useSelector((state:StoreType) => state.user);
  const router = useRouter();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!user.id) {
      router.push("/dashboard");
    }
  }, [user.id, router]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books");
        const data = await res.json();
        setFeaturedBooks(data.books.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch books:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);


  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-white to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="px-3 py-1 bg-accent/20 text-primary rounded-full text-sm font-medium">
                  Welcome to BookFlow
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-secondary leading-tight">
                Share Books, Build Community
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover a vibrant community of book lovers. Exchange your
                favorite reads, find hidden gems, and connect with readers who
                share your passion.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href="/signup">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-accent to-primary/40 rounded-3xl h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <BookIcon className="w-24 h-24 text-white/80 mx-auto mb-4" />
                  <p className="text-white/70 font-medium">
                    Your Library Awaits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary text-center mb-12">
            Why BookFlow?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-secondary mb-2">
                Easy Exchange
              </h3>
              <p className="text-muted-foreground">
                Simple, secure book exchanges with detailed profiles and reviews
                from the community.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-secondary mb-2">
                Community Driven
              </h3>
              <p className="text-muted-foreground">
                Connect with thousands of book lovers, share recommendations,
                and grow together.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-background border border-border hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-secondary mb-2">
                Sustainable Reading
              </h3>
              <p className="text-muted-foreground">
                Give books a second life and reduce environmental impact through
                smart sharing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Featured Books
            </h2>
            <Link href="/signup">
              <Button variant="outline">
                Explore More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-muted rounded-lg h-96 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors"
                >
                  <div className="relative aspect-video bg-muted overflow-hidden">
                    <img
                      src={book?.cover!}
                      alt={book.title}
                      className="w-full h-full object-cover"
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
                          reviews
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Exchanging Books?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of readers who share, discover, and build community
            through books.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="px-8 py-3 text-base">
                Already a Member? Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
