import { supabase } from '../lib/supabaseClient'
import { Profile } from '../types/database.types'

/**
 * Authentication service interacting with Supabase Auth and public.profiles table.
 */
export const authService = {
  /**
   * Signs in an existing staff member with email and password.
   */
  async signIn(email: string, password: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) {
      throw error
    }

    return data
  },

  /**
   * Signs up a new staff member with email, password, and full name.
   * Supabase trigger 'on_auth_user_created' automatically creates their public.profiles record.
   */
  async signUp(email: string, password: string, fullName: string) {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please check your environment variables.')
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim()
        }
      }
    })

    if (error) {
      throw error
    }

    return data
  },

  /**
   * Signs out the currently authenticated user and clears local session.
   */
  async signOut() {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  },

  /**
   * Fetches the user's staff profile and role from the public.profiles table.
   */
  async getProfile(userId: string): Promise<Profile | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    return data
  },

  /**
   * Updates user's own profile display name.
   */
  async updateProfile(userId: string, fullName: string): Promise<Profile | null> {
    if (!supabase) return null

    const { data, error } = await (supabase.from('profiles') as any)
      .update({ full_name: fullName.trim() })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  }
}
