'use client'

import ProtectedRoute from '@/components/layout/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function DashboardPage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b border-neutral-gray-medium">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="h3 text-text-primary">TrackIt Ecom</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="body-medium text-text-secondary">
                  Welcome, {user?.user_metadata?.first_name || user?.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="h2 text-text-primary mb-2">Dashboard</h2>
            <p className="body-large text-text-secondary">
              Welcome to your TrackIt Ecom dashboard. Here you'll manage your financial data and integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h2 text-accent-green">$0.00</div>
                <p className="body-small text-text-secondary">No data yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h2 text-accent-red">$0.00</div>
                <p className="body-small text-text-secondary">No data yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h2 text-text-primary">$0.00</div>
                <p className="body-small text-text-secondary">No data yet</p>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="body-medium text-text-secondary">
                    Welcome to TrackIt Ecom! To get started with automated expense and profit tracking:
                  </p>
                  
                  <ol className="space-y-2 body-medium text-text-secondary pl-4">
                    <li>1. Create your first business profile</li>
                    <li>2. Connect your social media accounts (Facebook, Instagram, WhatsApp)</li>
                    <li>3. Set up your expense and revenue categories</li>
                    <li>4. Start tracking your financial data automatically</li>
                  </ol>
                  
                  <div className="pt-4">
                    <Button variant="primary">
                      Set Up Your Business
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}