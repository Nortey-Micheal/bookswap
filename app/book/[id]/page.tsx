"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Star,
  Heart,
  Share2,
  MapPin,
  Award,
  Edit2,
  Trash2,
  Upload,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { useSelector } from "react-redux";
import { StoreType } from "@/lib/store";
import type { Prisma } from "@/lib/generated/prisma/client";
import { formatDate } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BookFull = Prisma.BookGetPayload<{
  include: {
    owner: true;
    reviews: true;
  };
}>;

interface Review {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const [book, setBook] = useState<BookFull | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavored, setIsFavored] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedBook, setEditedBook] = useState<Partial<BookFull> | null>(null);
  const [imageError, setImageError] = useState(false);
  const user = useSelector((state: StoreType) => state.user);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        const data = await res.json();
        setBook(data.book);
        setEditedBook(data.book);
        setReviews(data.reviews);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleAddReview = async () => {
    if (!book) return;

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book.id,
          userId: user.id,
          userName: user.name,
          rating: newReview.rating,
          comment: newReview.comment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews([...reviews, data.review]);
        setNewReview({ rating: 5, comment: "" });
        setShowReviewForm(false);

        // Refresh book data
        const bookRes = await fetch(`/api/books/${bookId}`);
        const bookData = await bookRes.json();
        setBook(bookData.book);
      }
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  const handleExchange = async () => {
    if (!book) return;
    alert(
      `Exchange request sent to ${book.owner.name}! Check your exchanges page for updates.`,
    );
  };

  const isOwner = book && user?.id === book.ownerId;

  const handleEditClick = () => {
    if (book) {
      setEditedBook(book);
      setImageError(false);
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!book || !editedBook) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editedBook.title,
          author: editedBook.author,
          description: editedBook.description,
          condition: editedBook.condition,
          status: editedBook.status,
          genre: editedBook.genre,
          cover: editedBook.cover,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBook(data.book);
        setShowEditModal(false);
      } else {
        alert("Failed to update book");
      }
    } catch (error) {
      console.error("Failed to save book:", error);
      alert("Failed to update book");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!book) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        alert("Failed to delete book");
      }
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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
    );
  }

  if (!book) {
    return (
      <ProtectedRoute>
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
    );
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
    );
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
          {" / "}
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
                  src={book.cover!}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isOwner && (
                  <>
                    <Button
                      onClick={handleEditClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Book
                    </Button>
                    <Button
                      onClick={() => setShowDeleteDialog(true)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Book
                    </Button>
                  </>
                )}
                {!isOwner && (
                  <Button
                    onClick={handleExchange}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    Propose Exchange
                  </Button>
                )}
                <button
                  onClick={() => setIsFavored(!isFavored)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavored ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                  {isFavored ? "Saved" : "Save to Wishlist"}
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
                <h1 className="text-4xl font-bold text-secondary mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                  by {book.author}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Math.floor(book.rating)
                              ? "fill-accent text-accent"
                              : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{book.rating}</span>
                    <span className="text-muted-foreground">
                      ({book?.reviews?.length} reviews)
                    </span>
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
                    {book.condition === "like-new" && "Like New"}
                    {book.condition === "good" && "Good"}
                    {book.condition === "fair" && "Fair"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">
                    Listed
                  </p>
                  <p className="text-foreground">
                    {formatDate(new Date(book.createdAt), "dd MMM yyyy")}
                  </p>
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
                <h2 className="text-xl font-bold text-secondary mb-3">
                  About This Book
                </h2>
                <p className="text-foreground leading-relaxed text-lg">
                  {book.description}
                </p>
              </div>

              {/* Owner Card */}
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="text-lg font-bold text-secondary mb-4">
                  Book Owner
                </h3>
                <Link href={`/profile/${book.ownerId}`}>
                  <div className="cursor-pointer hover:opacity-80 transition-opacity">
                    <p className="font-bold text-foreground">
                      {book.owner.name}
                    </p>
                    <div className="flex items-center gap-1 text-muted-foreground my-1">
                      <MapPin className="w-4 h-4" />
                      {book.location}
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
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Reviews ({reviews.length})
            </h2>

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
                <h3 className="font-bold text-secondary mb-4">
                  Share Your Review
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button
                          key={i}
                          onClick={() =>
                            setNewReview({ ...newReview, rating: i })
                          }
                          className="p-2"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              i <= newReview.rating
                                ? "fill-accent text-accent"
                                : "text-muted"
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
                  <div
                    key={review.id}
                    className="p-6 bg-background rounded-lg border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-foreground">
                        {review.user_name}
                      </p>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-accent text-accent"
                                : "text-muted"
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

      {/* Edit Modal */}
      {showEditModal && editedBook && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Edit Book
            </h2>

            <div className="space-y-6">
              {/* Book Cover Image URL Input */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Book Cover Image URL
                </label>
                <input
                  type="url"
                  value={editedBook.cover || ""}
                  onChange={(e) => {
                    setEditedBook({ ...editedBook, cover: e.target.value });
                    setImageError(false);
                  }}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Paste image URL (e.g., https://example.com/book.jpg)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Provide a direct link to your book cover image
                </p>
              </div>

              {/* Cover Image Preview */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-3">
                  Preview
                </label>
                <div className="relative h-64 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center">
                  {editedBook.cover && !imageError ? (
                    <img
                      src={editedBook.cover}
                      alt="Book cover preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {imageError
                          ? "Failed to load image. Check the URL and try again."
                          : "Enter an image URL above to see preview"}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={editedBook.title || ""}
                  onChange={(e) =>
                    setEditedBook({ ...editedBook, title: e.target.value })
                  }
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={editedBook.author || ""}
                  onChange={(e) =>
                    setEditedBook({ ...editedBook, author: e.target.value })
                  }
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Genre
                </label>
                <select
                  value={editedBook.genre || ""}
                  onChange={(e) =>
                    setEditedBook({ ...editedBook, genre: e.target.value })
                  }
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a genre</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Mystery">Mystery</option>
                  <option value="Romance">Romance</option>
                  <option value="Self-Help">Self-Help</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Condition
                </label>
                <select
                  value={editedBook.condition || ""}
                  onChange={(e) =>
                    setEditedBook({ ...editedBook, condition: e.target.value })
                  }
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="like-new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Status
                </label>
                <select
                  value={editedBook.status || ""}
                  onChange={(e) =>
                    setEditedBook({
                      ...editedBook,
                      status: e.target.value as any,
                    })
                  }
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="available">Available</option>
                  <option value="borrowed">Borrowed</option>
                  <option value="returned">Returned</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  Description
                </label>
                <textarea
                  value={editedBook.description || ""}
                  onChange={(e) =>
                    setEditedBook({
                      ...editedBook,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={6}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  onClick={() => setShowEditModal(false)}
                  variant="outline"
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this book? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </ProtectedRoute>
  );
}
