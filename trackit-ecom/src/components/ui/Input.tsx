import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  success?: boolean
  loading?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, success, loading, type, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-semibold text-text-primary mb-2"
          >
            {label}
            {props.required && <span className="text-accent-red ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-tertiary z-10">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-12 w-full rounded-lg border-2 bg-white px-4 py-3 text-base font-medium text-text-primary transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary placeholder:font-normal',
              'focus:outline-none focus:ring-2 focus:ring-primary-blue-medium focus:ring-offset-0 focus:border-primary-blue-medium',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-gray-light',
              // Default border
              !error && !success && 'border-neutral-gray-medium hover:border-neutral-gray-dark',
              // Success state
              success && 'border-accent-green focus:border-accent-green focus:ring-accent-green',
              // Error state
              error && 'border-accent-red focus:border-accent-red focus:ring-accent-red bg-red-50',
              // Icon padding
              icon && 'pl-12',
              // Loading state
              loading && 'pr-12',
              className
            )}
            ref={ref}
            {...props}
          />
          {/* Loading spinner */}
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="h-5 w-5 animate-spin text-text-tertiary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
          {/* Success icon */}
          {success && !loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="h-5 w-5 text-accent-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {/* Error icon */}
          {error && !loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="h-5 w-5 text-accent-red"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center mt-2">
            <svg className="h-4 w-4 text-accent-red mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-accent-red">{error}</p>
          </div>
        )}
        {helperText && !error && (
          <p className="text-sm text-text-tertiary font-medium">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }