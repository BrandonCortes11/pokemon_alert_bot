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
    <div className="min-h-screen bg-gradient-to-br from-neutral-gray-light via-white to-primary-blue-light/20 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-blue-medium rounded-2xl shadow-lg mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-3">Welcome to TrackIt Ecom</h1>
          <p className="text-lg text-text-secondary font-medium">
            Automated Financial Management for E-commerce
          </p>
        </div>

        <div className="relative">
          {showMFA ? (
            <MFAForm 
              factors={mfaData?.factors} 
              onBack={handleBackToSignIn} 
            />
          ) : (
            <SignInForm onMFARequired={handleMFARequired} />
          )}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-text-tertiary">
            Secure • Professional • Trusted by 10,000+ Businesses
          </p>
        </div>
      </div>
    </div>
  )
}