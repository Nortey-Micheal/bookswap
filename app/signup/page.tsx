'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, AlertCircle, Mail, Lock, User, Check } from 'lucide-react'
import { useSignup } from '@/hooks/auth/useSignup'
import { useSelector } from 'react-redux'
import { StoreType } from '@/lib/store'

export default function SignupPage() {
  const router = useRouter()
  const { signup } = useSignup()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state:StoreType) => state.user)

  if (user.id) {
    router.replace('/dashboard')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await signup({name, email, password, confirmPassword})
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const passwordValid = password.length >= 6

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
            Create your account to start exchanging books.
          </p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-lg p-8 border border-border">
          {/* Error Message */}
          {error && (
            <div className="mb-6 flex gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 py-2"
              />
            </div>
          </div>

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
          <div className="mb-4">
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
                minLength={6}
                className="pl-10 py-2"
              />
            </div>
            {password && !passwordValid && (
              <p className="text-xs text-destructive mt-1">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="pl-10 py-2"
              />
            </div>
            {confirmPassword && passwordsMatch && (
              <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                <Check className="w-4 h-4" />
                Passwords match
              </div>
            )}
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-destructive mt-1">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={
              isLoading ||
              !name ||
              !email ||
              !passwordValid ||
              !passwordsMatch
            }
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-border"></div>
            <span className="px-3 text-xs text-muted-foreground">or</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  )
}
