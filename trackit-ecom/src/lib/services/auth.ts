import { createClient } from '@/lib/auth/supabase-client'
import { UserPreferences } from '@/types'

const supabase = createClient()

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface SignInData {
  email: string
  password: string
}

export interface MFAEnrollmentData {
  factorType: 'totp' | 'phone'
  friendlyName: string
  phone?: string // Required for SMS MFA
}

export interface MFAVerificationData {
  factorId: string
  challengeId: string
  code: string
}

export class AuthService {
  // Sign up new user with email verification
  static async signUp({ email, password, firstName, lastName }: SignUpData) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
          },
        },
      })

      if (error) throw error

      // Create user profile in our users table
      if (data.user && !data.session) {
        // User needs to confirm email first
        return {
          user: data.user,
          session: null,
          message: 'Please check your email to confirm your account.',
        }
      }

      // Auto-create user profile if email confirmation is disabled
      if (data.user && data.session) {
        await this.createUserProfile(data.user.id)
      }

      return { user: data.user, session: data.session }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create account')
    }
  }

  // Sign in existing user
  static async signIn({ email, password }: SignInData) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user has MFA enabled
      if (data.user && data.session) {
        const { data: factors } = await supabase.auth.mfa.listFactors()
        
        if (factors?.totp?.length || factors?.phone?.length) {
          return {
            user: data.user,
            session: data.session,
            mfaRequired: true,
            factors: factors,
          }
        }
      }

      return { user: data.user, session: data.session, mfaRequired: false }
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign in')
    }
  }

  // Sign out user
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out')
    }
  }

  // Get current user
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return user
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get current user')
    }
  }

  // Get current session
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get current session')
    }
  }

  // Create user profile in our custom users table
  static async createUserProfile(userId: string, preferences?: UserPreferences) {
    try {
      const defaultPreferences: UserPreferences = {
        theme: 'light',
        default_currency: 'USD',
        default_date_range: 'last_30_days',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        notifications: {
          email: true,
          push: false,
          approval_reminders: true,
        },
      }

      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          preferences: preferences || defaultPreferences,
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      // If user already exists, just return success
      if (error.message?.includes('duplicate key value')) {
        return null
      }
      throw new Error(error.message || 'Failed to create user profile')
    }
  }

  // Update user profile
  static async updateUserProfile(userId: string, preferences: Partial<UserPreferences>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ preferences })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update user profile')
    }
  }

  // Get user profile
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to get user profile')
    }
  }

  // MFA: Enroll a new factor (TOTP or SMS)
  static async enrollMFA({ factorType, friendlyName, phone }: MFAEnrollmentData) {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType,
        friendlyName,
        ...(phone && { phone }),
      })

      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to enroll MFA factor')
    }
  }

  // MFA: Challenge a factor (initiate verification)
  static async challengeMFA(factorId: string) {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId })
      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to challenge MFA factor')
    }
  }

  // MFA: Verify a challenge with code
  static async verifyMFA({ factorId, challengeId, code }: MFAVerificationData) {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      })

      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to verify MFA code')
    }
  }

  // MFA: List user's factors
  static async listMFAFactors() {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors()
      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to list MFA factors')
    }
  }

  // MFA: Remove a factor
  static async unenrollMFA(factorId: string) {
    try {
      const { data, error } = await supabase.auth.mfa.unenroll({ factorId })
      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to remove MFA factor')
    }
  }

  // Password reset
  static async resetPassword(email: string) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send password reset email')
    }
  }

  // Update password
  static async updatePassword(newPassword: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update password')
    }
  }

  // Update user email
  static async updateEmail(newEmail: string) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      })

      if (error) throw error
      return data
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update email')
    }
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
}