'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics"
      description="Business performance insights and financial analytics"
    >
      <div className="space-y-8">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-green">$0.00</div>
              <div className="flex items-center text-sm text-text-tertiary">
                <span className="text-accent-green mr-1">↗</span>
                +0% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">Monthly Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent-red">$0.00</div>
              <div className="flex items-center text-sm text-text-tertiary">
                <span className="text-accent-green mr-1">↘</span>
                +0% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-text-primary">0.0%</div>
              <div className="flex items-center text-sm text-text-tertiary">
                <span className="text-text-tertiary mr-1">—</span>
                No change
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-text-secondary">Active Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary-blue-medium">0</div>
              <div className="flex items-center text-sm text-text-tertiary">
                Connect social media accounts
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue vs Expenses Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <p className="text-sm text-text-secondary">Monthly revenue over time</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-neutral-gray-light/20 rounded-lg">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-text-secondary">No revenue data available</p>
                  <p className="text-sm text-text-tertiary mt-1">Start adding transactions to see trends</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <p className="text-sm text-text-secondary">Expenses by category</p>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64 bg-neutral-gray-light/20 rounded-lg">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                  <p className="text-text-secondary">No expense data available</p>
                  <p className="text-sm text-text-tertiary mt-1">Start adding expenses to see breakdown</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
            <p className="text-sm text-text-secondary">Revenue and ad spend by social media platform</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Facebook', 'Instagram', 'WhatsApp'].map((platform) => (
                <div key={platform} className="flex items-center justify-between p-4 bg-neutral-gray-light/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-blue-light rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-blue-medium">
                        {platform[0]}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-text-primary">{platform}</h4>
                      <p className="text-sm text-text-tertiary">Not connected</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-text-secondary">$0.00 revenue</p>
                    <p className="text-sm text-text-tertiary">$0.00 ad spend</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button variant="primary">
                Connect Social Media Accounts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Summary</CardTitle>
            <p className="text-sm text-text-secondary">Latest transactions and automated data fetches</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-text-secondary mb-2">No recent activity</p>
                <p className="text-sm text-text-tertiary mb-4">Add transactions or connect integrations to see activity</p>
                <div className="space-x-3">
                  <Button variant="outline" size="sm">
                    Add Transaction
                  </Button>
                  <Button variant="outline" size="sm">
                    Setup Integrations
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}