'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { AuthService, SignUpData, SignInData, MFAEnrollmentData, MFAVerificationData } from '@/lib/services/auth'
import { UserPreferences } from '@/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: any | null
  loading: boolean
  
  // Authentication methods
  signUp: (data: SignUpData) => Promise<any>
  signIn: (data: SignInData) => Promise<any>
  signOut: () => Promise<void>
  
  // User profile methods
  updateUserProfile: (preferences: Partial<UserPreferences>) => Promise<any>
  
  // MFA methods
  enrollMFA: (data: MFAEnrollmentData) => Promise<any>
  challengeMFA: (factorId: string) => Promise<any>
  verifyMFA: (data: MFAVerificationData) => Promise<any>
  listMFAFactors: () => Promise<any>
  unenrollMFA: (factorId: string) => Promise<any>
  
  // Password management
  resetPassword: (email: string) => Promise<any>
  updatePassword: (newPassword: string) => Promise<any>
  updateEmail: (newEmail: string) => Promise<any>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const currentSession = await AuthService.getCurrentSession()
        setSession(currentSession)
        
        if (currentSession?.user) {
          setUser(currentSession.user)
          
          // Get user profile
          try {
            const profile = await AuthService.getUserProfile(currentSession.user.id)
            setUserProfile(profile)
          } catch (error) {
            // Profile might not exist yet, create it
            await AuthService.createUserProfile(currentSession.user.id)
            const newProfile = await AuthService.getUserProfile(currentSession.user.id)
            setUserProfile(newProfile)
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = AuthService.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        try {
          const profile = await AuthService.getUserProfile(session.user.id)
          setUserProfile(profile)
        } catch (error) {
          // Profile might not exist, create it
          await AuthService.createUserProfile(session.user.id)
          const newProfile = await AuthService.getUserProfile(session.user.id)
          setUserProfile(newProfile)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Authentication methods
  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true)
      const result = await AuthService.signUp(data)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (data: SignInData) => {
    try {
      setLoading(true)
      const result = await AuthService.signIn(data)
      return result
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await AuthService.signOut()
      setUser(null)
      setSession(null)
      setUserProfile(null)
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // User profile methods
  const updateUserProfile = async (preferences: Partial<UserPreferences>) => {
    if (!user) throw new Error('User not authenticated')
    
    try {
      const updatedProfile = await AuthService.updateUserProfile(user.id, preferences)
      setUserProfile(updatedProfile)
      return updatedProfile
    } catch (error) {
      throw error
    }
  }

  // MFA methods
  const enrollMFA = async (data: MFAEnrollmentData) => {
    return await AuthService.enrollMFA(data)
  }

  const challengeMFA = async (factorId: string) => {
    return await AuthService.challengeMFA(factorId)
  }

  const verifyMFA = async (data: MFAVerificationData) => {
    return await AuthService.verifyMFA(data)
  }

  const listMFAFactors = async () => {
    return await AuthService.listMFAFactors()
  }

  const unenrollMFA = async (factorId: string) => {
    return await AuthService.unenrollMFA(factorId)
  }

  // Password management
  const resetPassword = async (email: string) => {
    return await AuthService.resetPassword(email)
  }

  const updatePassword = async (newPassword: string) => {
    return await AuthService.updatePassword(newPassword)
  }

  const updateEmail = async (newEmail: string) => {
    return await AuthService.updateEmail(newEmail)
  }

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    enrollMFA,
    challengeMFA,
    verifyMFA,
    listMFAFactors,
    unenrollMFA,
    resetPassword,
    updatePassword,
    updateEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}