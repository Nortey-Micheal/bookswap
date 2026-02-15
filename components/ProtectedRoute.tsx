'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { StoreType } from '@/lib/store'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useSelector((state:StoreType) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (!user.id) {
      router.replace('/login')
    }
  }, [user.id, router])

  if (!user.id) {
    return null
  }

  return <>{children}</>
}
