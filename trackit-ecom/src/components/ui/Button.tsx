import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error' | 'warning'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, icon, children, disabled, fullWidth = false, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm'
    
    const variants = {
      primary: 'bg-primary-blue-medium hover:bg-primary-blue-dark text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus-visible:ring-primary-blue-medium active:scale-[0.98]',
      secondary: 'bg-white hover:bg-neutral-gray-light text-text-primary border border-neutral-gray-medium hover:border-neutral-gray-dark focus-visible:ring-neutral-gray-medium',
      outline: 'border-2 border-primary-blue-medium hover:bg-primary-blue-medium text-primary-blue-medium hover:text-white focus-visible:ring-primary-blue-medium transition-colors',
      ghost: 'hover:bg-neutral-gray-light text-text-primary focus-visible:ring-neutral-gray-medium',
      success: 'bg-accent-green hover:bg-green-600 text-white shadow-lg hover:shadow-xl focus-visible:ring-accent-green',
      error: 'bg-accent-red hover:bg-red-600 text-white shadow-lg hover:shadow-xl focus-visible:ring-accent-red',
      warning: 'bg-accent-orange hover:bg-orange-600 text-white shadow-lg hover:shadow-xl focus-visible:ring-accent-orange',
    }
    
    const sizes = {
      sm: 'h-9 px-3 text-sm font-medium',
      md: 'h-11 px-5 text-sm font-semibold',
      lg: 'h-12 px-6 text-base font-semibold',
      xl: 'h-14 px-8 text-lg font-semibold',
    }

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          loading && 'cursor-not-allowed',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-5 w-5 animate-spin"
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
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {icon && !loading && <span className="mr-2 flex-shrink-0">{icon}</span>}
        <span className={loading ? 'opacity-70' : ''}>{children}</span>
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button }