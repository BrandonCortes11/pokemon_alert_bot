'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function RevenueTrend() {
  // Sample data for the chart
  const chartData = [
    { month: 'Jan', revenue: 25000, expenses: 18000 },
    { month: 'Feb', revenue: 32000, expenses: 22000 },
    { month: 'Mar', revenue: 28000, expenses: 19000 },
    { month: 'Apr', revenue: 41000, expenses: 26000 },
    { month: 'May', revenue: 38000, expenses: 25000 },
    { month: 'Jun', revenue: 45000, expenses: 28000 },
  ]

  const maxValue = Math.max(...chartData.map(d => Math.max(d.revenue, d.expenses)))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Revenue vs Expenses</CardTitle>
            <p className="text-sm text-text-secondary mt-1">Monthly comparison over the last 6 months</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Legend */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary-blue-medium rounded-full mr-2"></div>
            <span className="text-sm text-text-secondary">Revenue</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-accent-orange rounded-full mr-2"></div>
            <span className="text-sm text-text-secondary">Expenses</span>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-text-secondary w-8">{data.month}</span>
                <div className="flex-1 flex space-x-2 ml-4">
                  {/* Revenue Bar */}
                  <div className="flex-1 bg-neutral-gray-light rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-primary-blue-medium h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                      style={{ width: `${(data.revenue / maxValue) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        ${(data.revenue / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  {/* Expenses Bar */}
                  <div className="flex-1 bg-neutral-gray-light rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-accent-orange h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
                      style={{ width: `${(data.expenses / maxValue) * 100}%` }}
                    >
                      <span className="text-xs font-medium text-white">
                        ${(data.expenses / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-gray-light">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-blue-medium">
              ${(chartData.reduce((acc, d) => acc + d.revenue, 0) / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-text-secondary">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-orange">
              ${(chartData.reduce((acc, d) => acc + d.expenses, 0) / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-text-secondary">Total Expenses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-green">
              ${((chartData.reduce((acc, d) => acc + d.revenue, 0) - chartData.reduce((acc, d) => acc + d.expenses, 0)) / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-text-secondary">Net Profit</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}