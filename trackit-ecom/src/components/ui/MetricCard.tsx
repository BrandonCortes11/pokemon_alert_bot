'use client'

import React from 'react'
import { cn } from '@/lib/utils/cn'
import { Card, CardContent } from '@/components/ui/Card'

interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
    trend: 'up' | 'down' | 'neutral'
  }
  icon?: React.ReactNode
  className?: string
  loading?: boolean
}

export default function MetricCard({
  title,
  value,
  change,
  icon,
  className,
  loading = false
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (title.toLowerCase().includes('revenue') || title.toLowerCase().includes('profit') || title.toLowerCase().includes('expense')) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val)
      }
      return val.toLocaleString()
    }
    return val
  }

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-accent-green'
      case 'down':
        return 'text-accent-red'
      default:
        return 'text-text-tertiary'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 14l9-9 9 9M1 21l9-9 9 9" />
          </svg>
        )
      case 'down':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 10l-9 9-9-9M23 3l-9 9-9-9" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
          </svg>
        )
    }
  }

  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-neutral-gray-light rounded w-20"></div>
              <div className="h-6 w-6 bg-neutral-gray-light rounded"></div>
            </div>
            <div className="h-8 bg-neutral-gray-light rounded w-24 mb-2"></div>
            <div className="h-4 bg-neutral-gray-light rounded w-16"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('relative overflow-hidden group hover:shadow-xl transition-all duration-300', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            {title}
          </h3>
          {icon && (
            <div className="p-2 bg-primary-blue-light rounded-lg text-primary-blue-medium group-hover:bg-primary-blue-medium group-hover:text-white transition-colors duration-300">
              {icon}
            </div>
          )}
        </div>
        
        <div className="mb-3">
          <div className="text-3xl font-bold text-text-primary mb-1">
            {formatValue(value)}
          </div>
          
          {change && (
            <div className={cn('flex items-center text-sm font-medium', getTrendColor(change.trend))}>
              <span className="mr-1">
                {getTrendIcon(change.trend)}
              </span>
              <span>
                {change.value > 0 ? '+' : ''}{change.value}% {change.label}
              </span>
            </div>
          )}
        </div>

        {/* Mini chart placeholder */}
        <div className="h-12 flex items-end space-x-1 opacity-40">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-primary-blue-light rounded-sm"
              style={{
                height: `${Math.random() * 100}%`,
                minHeight: '4px'
              }}
            ></div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}