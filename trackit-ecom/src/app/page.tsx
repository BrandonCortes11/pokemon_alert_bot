'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Redirect authenticated users to dashboard
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

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="h1 mb-6">TrackIt Ecom</h1>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Automated Expense & Profit Tracking for E-commerce Entrepreneurs
            </p>
            
            <div className="max-w-2xl mx-auto mb-12">
              <p className="body-large text-text-secondary mb-6">
                Simplify your financial management with automated data collection from Facebook, Instagram, and WhatsApp. 
                Track expenses and profits with minimal manual effort.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-blue-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="h4 mb-2">Automated Tracking</h3>
                <p className="body-medium text-text-secondary">
                  Connect Facebook, Instagram, and WhatsApp to automatically fetch expense and revenue data
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-blue-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="h4 mb-2">Smart Approval</h3>
                <p className="body-medium text-text-secondary">
                  Review and approve automatically fetched data with intelligent categorization and duplicate detection
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-blue-light rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-blue-medium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="h4 mb-2">Real-time Reports</h3>
                <p className="body-medium text-text-secondary">
                  Get instant insights with customizable dashboards, P&L statements, and profitability analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return null
}