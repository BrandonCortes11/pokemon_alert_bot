'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()
  const firstName = user?.user_metadata?.first_name || 'there'

  return (
    <DashboardLayout
      title={`Welcome back, ${firstName}!`}
      description="Here's what's happening with your business today."
    >
      <div className="space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <Card>
          <CardHeader>
            <CardTitle>Getting Started with TrackIt Ecom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="body-medium text-text-secondary">
                Welcome to TrackIt Ecom! To get started with automated expense and profit tracking:
              </p>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-blue-medium text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Connect Your Social Media</h4>
                  <p className="text-text-secondary text-sm">Link your Facebook, Instagram, and WhatsApp Business accounts to automatically track revenue and ad spending.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-blue-medium text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Set Up Categories</h4>
                  <p className="text-text-secondary text-sm">Organize your expenses and revenue streams with custom categories for better insights.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary-blue-medium text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary mb-1">Start Tracking</h4>
                  <p className="text-text-secondary text-sm">Begin automatically tracking your e-commerce financial data and generating insights.</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="primary" size="lg">
                  Complete Setup Guide
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}