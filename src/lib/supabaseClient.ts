import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Checks whether the environment contains real, valid Supabase configuration.
 * Returns false if keys are undefined, empty, or default placeholders.
 */
export function isSupabaseConfigured(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) {
    return false
  }

  // Reject placeholder values
  if (
    supabaseUrl.includes('your-project-id') ||
    supabaseAnonKey.includes('your-public-client') ||
    supabaseUrl === '' ||
    supabaseAnonKey === ''
  ) {
    return false
  }

  // Basic format validation
  try {
    const parsed = new URL(supabaseUrl)
    if (!parsed.protocol.startsWith('https')) return false
  } catch {
    return false
  }

  return supabaseAnonKey.length > 20
}

/**
 * Returns configuration diagnostics for the environment sentinel UI.
 */
export function getSupabaseEnvDiagnostics() {
  const urlProvided = Boolean(supabaseUrl && supabaseUrl.trim() !== '')
  const urlIsPlaceholder = Boolean(supabaseUrl?.includes('your-project-id'))
  const keyProvided = Boolean(supabaseAnonKey && supabaseAnonKey.trim() !== '')
  const keyIsPlaceholder = Boolean(supabaseAnonKey?.includes('your-public-client'))

  return {
    urlProvided,
    urlValid: urlProvided && !urlIsPlaceholder && (supabaseUrl?.startsWith('https://') ?? false),
    urlValue: supabaseUrl || 'Missing',
    keyProvided,
    keyValid: keyProvided && !keyIsPlaceholder && ((supabaseAnonKey?.length ?? 0) > 20),
    isConfigured: isSupabaseConfigured()
  }
}

/**
 * Supabase client singleton instance.
 * Initialized only when valid environment credentials are provided.
 */
export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null

export interface ConnectionHealth {
  status: 'connected' | 'unconfigured' | 'error'
  latencyMs?: number
  message?: string
}

/**
 * Pings the Supabase cloud instance to measure real latency and verify connection health.
 */
export async function checkSupabaseHealth(): Promise<ConnectionHealth> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      status: 'unconfigured',
      message: 'Supabase credentials are not configured in environment variables.'
    }
  }

  const startTime = performance.now()
  try {
    // Ping Supabase auth settings endpoint (standard lightweight handshake)
    const { error } = await supabase.auth.getSession()
    const latencyMs = Math.round(performance.now() - startTime)

    if (error) {
      return {
        status: 'error',
        latencyMs,
        message: error.message
      }
    }

    return {
      status: 'connected',
      latencyMs,
      message: `Connected to Supabase PostgreSQL (${latencyMs}ms)`
    }
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime)
    const message = err instanceof Error ? err.message : 'Connection handshake failed'
    return {
      status: 'error',
      latencyMs,
      message
    }
  }
}
