import { User, Session } from '@supabase/supabase-js'
import { Profile, UserRole } from './database.types'

export interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  role: UserRole | null
  loading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{
    data?: { user: User | null; session: Session | null } | null
    error: Error | null
  }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}
