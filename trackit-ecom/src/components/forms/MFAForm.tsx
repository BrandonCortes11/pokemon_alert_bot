'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Alert } from '@/components/ui/Alert'
import { useAuth } from '@/contexts/AuthContext'

interface MFAFormProps {
  factors: any
  onBack: () => void
}

export default function MFAForm({ factors, onBack }: MFAFormProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [challengeId, setChallengeId] = useState('')
  const [selectedFactorId, setSelectedFactorId] = useState('')

  const { challengeMFA, verifyMFA } = useAuth()
  const router = useRouter()

  // Get the first available factor
  useEffect(() => {
    const totpFactors = factors?.totp || []
    const phoneFactors = factors?.phone || []
    
    if (totpFactors.length > 0) {
      setSelectedFactorId(totpFactors[0].id)
      initiateMFAChallenge(totpFactors[0].id)
    } else if (phoneFactors.length > 0) {
      setSelectedFactorId(phoneFactors[0].id)
      initiateMFAChallenge(phoneFactors[0].id)
    }
  }, [factors])

  const initiateMFAChallenge = async (factorId: string) => {
    try {
      const challenge = await challengeMFA(factorId)
      setChallengeId(challenge.id)
    } catch (err: any) {
      setError(err.message || 'Failed to initiate MFA challenge')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = await verifyMFA({
        factorId: selectedFactorId,
        challengeId,
        code,
      })

      if (result) {
        setSuccess('Verification successful! Redirecting to dashboard...')
        setTimeout(() => router.push('/dashboard'), 1000)
      }
    } catch (err: any) {
      setError(err.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    if (!selectedFactorId) return
    
    setError('')
    try {
      await initiateMFAChallenge(selectedFactorId)
    } catch (err: any) {
      setError(err.message || 'Failed to resend code')
    }
  }

  const totpFactors = factors?.totp || []
  const phoneFactors = factors?.phone || []

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Two-Factor Authentication</CardTitle>
        <CardDescription className="text-center">
          Enter the verification code from your authenticator app or SMS
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="error" title="Verification Failed">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" title="Success">
              {success}
            </Alert>
          )}

          {/* Factor Selection */}
          {totpFactors.length > 0 && phoneFactors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Verification Method
              </label>
              <div className="space-y-2">
                {totpFactors.map((factor: any) => (
                  <label key={factor.id} className="flex items-center">
                    <input
                      type="radio"
                      name="mfa-factor"
                      value={factor.id}
                      checked={selectedFactorId === factor.id}
                      onChange={(e) => {
                        setSelectedFactorId(e.target.value)
                        initiateMFAChallenge(e.target.value)
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      Authenticator App ({factor.friendly_name || 'TOTP'})
                    </span>
                  </label>
                ))}
                {phoneFactors.map((factor: any) => (
                  <label key={factor.id} className="flex items-center">
                    <input
                      type="radio"
                      name="mfa-factor"
                      value={factor.id}
                      checked={selectedFactorId === factor.id}
                      onChange={(e) => {
                        setSelectedFactorId(e.target.value)
                        initiateMFAChallenge(e.target.value)
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      SMS ({factor.friendly_name || 'Phone'})
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <Input
            type="text"
            label="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            disabled={loading}
            placeholder="Enter 6-digit code"
            maxLength={6}
            icon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />

          <div className="text-center">
            <button
              type="button"
              onClick={resendCode}
              className="text-sm text-primary-blue-medium hover:text-primary-blue-dark"
            >
              Resend Code
            </button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={code.length !== 6 || loading}
            fullWidth
          >
            Verify & Continue
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onBack}
          >
            Back to Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}