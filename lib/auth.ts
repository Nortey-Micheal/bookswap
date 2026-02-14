import { db, User, Session } from './db'
import crypto from 'crypto'
import { prisma } from './prisma'


// Simple password hashing (for demo - in production use bcrypt)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return password === hash
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function createSession(userId: string): Session {
  const token = generateToken()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours

  const session: Session = {
    userId,
    token,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }

  db.sessions.push(session)
  return session
}

export function getSessionByToken(token: string): Session | null {
  const session = db.sessions.find((s) => s.token === token)

  if (!session) {
    return null
  }

  if (new Date(session.expiresAt) < new Date()) {
    // Session expired
    db.sessions = db.sessions.filter((s) => s.token !== token)
    return null
  }

  return session
}

export function deleteSession(token: string): void {
  db.sessions = db.sessions.filter((s) => s.token !== token)
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  // find((u) => u.email === email) || null
  return user
}

export function getUserById(id: string): User | null {
  return db.users.find((u) => u.id === id) || null
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  bio:string,
  location:string,
  avatar:string
): Promise<User | null> {
  // Check if user already exists
  if ( await getUserByEmail(email)) {
    return null
  }

  const user: User = await prisma.user.create({
   data: {
     name,
      email,
      password: hashPassword(password),
      location: '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      bio: '',
      rating: 5,
      reviews_count: 0,
      books_shared: 0,
      member_since: new Date(),
      wishlist: [],
      active_exchanges: [],
    }
  })

  return user
}
