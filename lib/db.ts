// Dummy in-memory database for BookFlow
export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  cover: string
  description: string
  genre: string
  condition: 'like-new' | 'good' | 'fair'
  owner_id: string
  owner_name: string
  owner_location: string
  location: string
  status: 'available' | 'exchanged' | 'borrowed'
  rating: number
  reviews: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string // hashed password
  location: string
  avatar: string
  bio: string
  rating: number
  reviews_count: number
  books_shared: number
  member_since: Date
  wishlist: string[]
  active_exchanges: string[]
}

export interface Session {
  userId: string
  token: string
  createdAt: string
  expiresAt: string
}

export interface Exchange {
  id: string
  initiator_id: string
  initiator_name: string
  responder_id: string
  responder_name: string
  initiator_book_id: string
  responder_book_id: string
  status: 'pending' | 'accepted' | 'completed' | 'cancelled'
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  book_id: string
  user_id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}

// Dummy data storage
export const db = {
  books: [] as Book[],
  users: [] as User[],
  exchanges: [] as Exchange[],
  reviews: [] as Review[],
  sessions: [] as Session[],
}

// Initialize with sample data
export function initializeDatabase() {
  const sampleBooks: Book[] = [
    {
      id: 'book-1',
      title: 'The Midnight Library',
      author: 'Matt Haig',
      isbn: '978-0525559474',
      cover: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=600&fit=crop',
      description: 'A dazzling novel about all the choices that go into a life well lived.',
      genre: 'Fiction',
      condition: 'like-new',
      owner_id: 'user-1',
      owner_name: 'Sarah Chen',
      owner_location: 'San Francisco, CA',
      location: 'San Francisco, CA',
      status: 'available',
      rating: 4.8,
      reviews: 324,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'book-2',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      isbn: '978-0593135204',
      cover: 'https://images.unsplash.com/photo-1521984160485-ba08979f5053?w=400&h=600&fit=crop',
      description: 'A lone astronaut must save Earth from extinction in this thrilling sci-fi adventure.',
      genre: 'Science Fiction',
      condition: 'good',
      owner_id: 'user-2',
      owner_name: 'Marcus Rodriguez',
      owner_location: 'Austin, TX',
      location: 'Austin, TX',
      status: 'available',
      rating: 4.9,
      reviews: 512,
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'book-3',
      title: 'Educated',
      author: 'Tara Westover',
      isbn: '978-0399590504',
      cover: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=400&h=600&fit=crop',
      description: 'A memoir about a young woman who leaves her survivalist family to pursue education.',
      genre: 'Biography',
      condition: 'fair',
      owner_id: 'user-3',
      owner_name: 'Emma Watson',
      owner_location: 'New York, NY',
      location: 'New York, NY',
      status: 'available',
      rating: 4.7,
      reviews: 289,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'book-4',
      title: 'The Seven Husbands of Evelyn Hugo',
      author: 'Taylor Jenkins Reid',
      isbn: '978-0525432051',
      cover: 'https://images.unsplash.com/photo-1543002588-d4d8fdf5d2c2?w=400&h=600&fit=crop',
      description: 'A reclusive Hollywood icon shares her glamorous past with an unknown reporter.',
      genre: 'Fiction',
      condition: 'like-new',
      owner_id: 'user-1',
      owner_name: 'Sarah Chen',
      owner_location: 'San Francisco, CA',
      location: 'San Francisco, CA',
      status: 'available',
      rating: 4.6,
      reviews: 401,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'book-5',
      title: 'Atomic Habits',
      author: 'James Clear',
      isbn: '978-0735211292',
      cover: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
      description: 'Tiny habits, remarkable results. An easy and practical way to build good habits.',
      genre: 'Self-Help',
      condition: 'good',
      owner_id: 'user-2',
      owner_name: 'Marcus Rodriguez',
      owner_location: 'Austin, TX',
      location: 'Austin, TX',
      status: 'available',
      rating: 4.9,
      reviews: 678,
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'book-6',
      title: 'Dune',
      author: 'Frank Herbert',
      isbn: '978-0441013593',
      cover: 'https://images.unsplash.com/photo-1518932458119-e5bf12dd3b16?w=400&h=600&fit=crop',
      description: 'An epic science fiction novel set on the desert planet Arrakis.',
      genre: 'Science Fiction',
      condition: 'like-new',
      owner_id: 'user-3',
      owner_name: 'Emma Watson',
      owner_location: 'New York, NY',
      location: 'New York, NY',
      status: 'available',
      rating: 4.8,
      reviews: 445,
      created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]

  const sampleUsers: User[] = [
    {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: 'password123', // demo password hashed
      location: 'San Francisco, CA',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      bio: 'Passionate reader and coffee enthusiast. Always looking to discover new authors.',
      rating: 4.9,
      reviews_count: 47,
      books_shared: 23,
      member_since: new Date('2022-03-15'),
      wishlist: [],
      active_exchanges: [],
    },
    {
      id: 'user-2',
      name: 'Marcus Rodriguez',
      email: 'marcus@example.com',
      password: 'password123',
      location: 'Austin, TX',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      bio: 'Science fiction lover and tech enthusiast. Happy to exchange or recommend books.',
      rating: 4.8,
      reviews_count: 38,
      books_shared: 31,
      member_since: new Date('2021-07-22'),
      wishlist: [],
      active_exchanges: [],
    },
    {
      id: 'user-3',
      name: 'Emma Watson',
      email: 'emma@example.com',
      password: 'pasword123',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=100&h=100&fit=crop',
      bio: 'Biography and memoir collector. Love reading about inspiring life stories.',
      rating: 4.7,
      reviews_count: 52,
      books_shared: 18,
      member_since: new Date('2020-11-08'),
      wishlist: [],
      active_exchanges: [],
    },
  ]

  db.books = sampleBooks
  db.users = sampleUsers
  db.exchanges = []
  db.reviews = []
}

// Initialize on module load
initializeDatabase()
