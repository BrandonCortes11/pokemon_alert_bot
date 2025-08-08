import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  icon?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, icon, children, ...props }, ref) => {
    const variants = {
      success: {
        container: 'bg-green-50 border-green-200 text-green-800',
        icon: 'text-green-600',
        title: 'text-green-800',
        description: 'text-green-700'
      },
      error: {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-600',
        title: 'text-red-800',
        description: 'text-red-700'
      },
      warning: {
        container: 'bg-orange-50 border-orange-200 text-orange-800',
        icon: 'text-orange-600',
        title: 'text-orange-800',
        description: 'text-orange-700'
      },
      info: {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-600',
        title: 'text-blue-800',
        description: 'text-blue-700'
      }
    }

    const defaultIcons = {
      success: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      warning: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      info: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border-2 p-4 transition-all duration-200',
          variants[variant].container,
          className
        )}
        {...props}
      >
        <div className="flex items-start">
          <div className={cn('flex-shrink-0 mr-3', variants[variant].icon)}>
            {icon || defaultIcons[variant]}
          </div>
          <div className="flex-1">
            {title && (
              <h4 className={cn('font-semibold mb-1', variants[variant].title)}>
                {title}
              </h4>
            )}
            <div className={cn('text-sm font-medium', variants[variant].description)}>
              {children}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
Alert.displayName = 'Alert'

export { Alert }