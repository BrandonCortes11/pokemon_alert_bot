'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Transaction {
  id: string
  type: 'revenue' | 'expense'
  description: string
  amount: number
  date: string
  source: string
}

export default function RecentActivity() {
  // Sample data - in a real app this would come from your API
  const recentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'revenue',
      description: 'Facebook Ad Revenue',
      amount: 2450,
      date: '2 hours ago',
      source: 'Facebook'
    },
    {
      id: '2',
      type: 'expense',
      description: 'Instagram Ad Spend',
      amount: -890,
      date: '4 hours ago',
      source: 'Instagram'
    },
    {
      id: '3',
      type: 'revenue',
      description: 'WhatsApp Business Sales',
      amount: 1250,
      date: '6 hours ago',
      source: 'WhatsApp'
    },
    {
      id: '4',
      type: 'expense',
      description: 'Product Fulfillment',
      amount: -340,
      date: '8 hours ago',
      source: 'Manual'
    },
    {
      id: '5',
      type: 'revenue',
      description: 'Facebook Marketplace',
      amount: 675,
      date: '1 day ago',
      source: 'Facebook'
    }
  ]

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Facebook':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">F</span>
          </div>
        )
      case 'Instagram':
        return (
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">I</span>
          </div>
        )
      case 'WhatsApp':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-green-600">W</span>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-neutral-gray-light rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-gray-light/50 transition-colors">
              <div className="flex items-center space-x-3">
                {getSourceIcon(transaction.source)}
                <div>
                  <p className="font-medium text-text-primary">{transaction.description}</p>
                  <p className="text-sm text-text-tertiary">{transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'revenue' ? 'text-accent-green' : 'text-accent-red'
                }`}>
                  {transaction.type === 'revenue' ? '+' : '-'}{formatAmount(transaction.amount)}
                </p>
                <p className="text-xs text-text-tertiary uppercase">{transaction.type}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}