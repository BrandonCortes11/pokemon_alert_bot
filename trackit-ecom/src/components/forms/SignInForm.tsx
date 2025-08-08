'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { useAuth } from '@/contexts/AuthContext'

interface SignInFormProps {
  onMFARequired?: (data: any) => void
}

export default function SignInForm({ onMFARequired }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn({ email, password })
      
      if (result.mfaRequired) {
        if (onMFARequired) {
          onMFARequired(result)
        }
      } else {
        // Redirect to dashboard on successful login
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your TrackIt Ecom account
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-accent-red">
              <p className="text-sm text-accent-red">{error}</p>
            </div>
          )}

          <Input
            type="email"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            }
          />

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded border-neutral-gray-medium" />
              Remember me
            </label>
            <Link 
              href="/auth/forgot-password" 
              className="text-primary-blue-medium hover:text-primary-blue-dark"
            >
              Forgot password?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={!email || !password}
          >
            Sign In
          </Button>

          <p className="text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              className="text-primary-blue-medium hover:text-primary-blue-dark font-medium"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}