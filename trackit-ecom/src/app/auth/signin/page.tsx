'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SignInForm from '@/components/forms/SignInForm'
import MFAForm from '@/components/forms/MFAForm'
import { useAuth } from '@/contexts/AuthContext'

export default function SignInPage() {
  const [showMFA, setShowMFA] = useState(false)
  const [mfaData, setMFAData] = useState<any>(null)
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  const handleMFARequired = (data: any) => {
    setMFAData(data)
    setShowMFA(true)
  }

  const handleBackToSignIn = () => {
    setShowMFA(false)
    setMFAData(null)
  }

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
            Automated Financial Management for E-commerce
          </p>
        </div>

        {showMFA ? (
          <MFAForm 
            factors={mfaData?.factors} 
            onBack={handleBackToSignIn} 
          />
        ) : (
          <SignInForm onMFARequired={handleMFARequired} />
        )}
      </div>
    </div>
  )
}