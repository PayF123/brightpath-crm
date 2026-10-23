import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabaseClient'
import { authService } from '../services/authService'
import { Profile, UserRole } from '../types/database.types'
import { AuthContextType } from '../types/auth.types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const staffProfile = await authService.getProfile(userId)
      if (staffProfile) {
        setProfile(staffProfile)
        setRole(staffProfile.role)
      } else {
        // Fallback if profile row is still being populated by trigger
        setRole('counsellor')
      }
    } catch (err) {
      console.error('Failed to load profile:', err)
      setRole('counsellor')
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // 1. Check current active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // 2. Listen to real-time auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await loadProfile(newSession.user.id)
      } else {
        setProfile(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadProfile])

  const signIn = async (email: string, password: string) => {
    setError(null)
    try {
      await authService.signIn(email, password)
      return { error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      setError(message)
      return { error: err instanceof Error ? err : new Error(message) }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setError(null)
    try {
      const data = await authService.signUp(email, password, fullName)
      return { data, error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to register account'
      setError(message)
      return { data: null, error: err instanceof Error ? err : new Error(message) }
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
      setUser(null)
      setSession(null)
      setProfile(null)
      setRole(null)
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
