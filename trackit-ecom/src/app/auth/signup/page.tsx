'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SignUpForm from '@/components/forms/SignUpForm'
import { useAuth } from '@/contexts/AuthContext'

export default function SignUpPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue-medium"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="h1 text-text-primary mb-2">TrackIt Ecom</h1>
          <p className="body-medium text-text-secondary">
            Join thousands of e-commerce entrepreneurs
          </p>
        </div>

        <SignUpForm />
      </div>
    </div>
  )
}