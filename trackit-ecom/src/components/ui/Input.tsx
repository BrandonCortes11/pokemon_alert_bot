import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, type, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-text-primary"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary">
              {icon}
            </div>
          )}
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-md border border-neutral-gray-medium bg-background px-3 py-2 text-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue-medium focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              icon && 'pl-10',
              error && 'border-accent-red focus-visible:ring-accent-red',
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-accent-red">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-text-tertiary">{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }