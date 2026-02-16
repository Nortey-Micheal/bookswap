"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useSelector } from "react-redux";
import { StoreType } from "@/lib/store";
import { toast } from "sonner";

const GENRES = [
  "Fiction",
  "Science Fiction",
  "Biography",
  "Self-Help",
  "Mystery",
  "Romance",
  "History",
  "Other",
];
const CONDITIONS = ["like-new", "good", "fair"];

export default function ListBookPage() {
  const router = useRouter();
  const user = useSelector((state: StoreType) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    genre: "Fiction",
    condition: "good",
    cover: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "cover") {
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cover) {
      toast.error("Please provide a book cover image URL");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ownerId: user.id,
          location: user.location || "Teshie",
          status: "available",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/book/${data.book.id}`);
      } else {
        toast.error("Failed to list book");
      }
    } catch (error) {
      console.error("Error listing book:", error);
      alert("Error listing book");
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-lg border border-border p-8"
            >
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Cover Image URL Input */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Book Cover Image URL *
                  </label>
                  <Input
                    type="url"
                    name="cover"
                    value={formData.cover}
                    onChange={handleChange}
                    placeholder="Paste image URL (e.g., https://example.com/book.jpg)"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Provide a direct link to your book cover image
                  </p>
                </div>

                {/* Cover Image Preview */}
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-foreground block mb-3">
                    Preview
                  </label>
                  <div className="relative h-64 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-border flex items-center justify-center">
                    {formData.cover && !imageError ? (
                      <>
                        <img
                          src={formData.cover}
                          alt="Book cover preview"
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      </>
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
                        {c === "like-new"
                          ? "Like New"
                          : c.charAt(0).toUpperCase() + c.slice(1)}
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
                  {isSubmitting ? "Listing..." : "List Book"}
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
                * Required fields. Your listing will be reviewed before being
                posted to the community.
              </p>
            </form>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
