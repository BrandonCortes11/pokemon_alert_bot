'use client'

import React from 'react'
import Sidebar from './Sidebar'
import ProtectedRoute from './ProtectedRoute'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-neutral-gray-light/30">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          {(title || description) && (
            <div className="bg-white border-b border-neutral-gray-light px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-text-primary mb-1">{title}</h1>
                  )}
                  {description && (
                    <p className="text-text-secondary font-medium">{description}</p>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {/* Action buttons can be added here */}
                </div>
              </div>
            </div>
          )}
          
          {/* Scrollable Content */}
          <main className="flex-1 overflow-auto px-8 py-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}