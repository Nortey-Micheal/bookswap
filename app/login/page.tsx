'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, AlertCircle, Mail, Lock } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(true)

  if (isAuthenticated) {
    router.replace('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const useDemoAccount = () => {
    setEmail('sarah@example.com')
    setPassword('password123')
    setShowDemo(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary rounded-lg p-3 mb-3">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">BookFlow</h1>
          <p className="text-muted-foreground mt-2 text-center">
            Welcome back! Sign in to your account.
          </p>
        </div>

        {/* Demo Info */}
        {showDemo && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <p className="text-sm text-foreground mb-3 font-medium">
              Demo credentials available:
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              <strong>Email:</strong> sarah@example.com<br />
              <strong>Password:</strong> password123
            </p>
            <Button
              onClick={useDemoAccount}
              variant="outline"
              className="w-full text-sm"
            >
              Use Demo Account
            </Button>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-lg p-8 border border-border">
          {/* Error Message */}
          {error && (
            <div className="mb-6 flex gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 py-2"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 py-2"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-3 text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary/80">
              Create one
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  )
}
