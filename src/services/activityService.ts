import { supabase } from '../lib/supabaseClient'
import { Activity } from '../types/database.types'

export interface LogActivityInput {
  leadId: string
  actorId?: string | null
  activityType: string
  description: string
  metadata?: Record<string, unknown>
}

/**
 * Service for managing audit activity timeline logs.
 */
export const activityService = {
  /**
   * Records an audit log entry in the public.activities table.
   */
  async logActivity({
    leadId,
    actorId = null,
    activityType,
    description,
    metadata = {}
  }: LogActivityInput): Promise<Activity | null> {
    if (!supabase) {
      console.warn('Supabase client not initialized; skipping activity logging.')
      return null
    }

    try {
      const { data, error } = await (supabase.from('activities') as any)
        .insert({
          lead_id: leadId,
          actor_id: actorId,
          activity_type: activityType,
          description,
          metadata: metadata
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to log activity to database:', error.message)
        return null
      }

      return data as Activity
    } catch (err) {
      console.error('Unexpected error logging activity:', err)
      return null
    }
  },

  /**
   * Fetches chronological activity timeline for a specific lead.
   */
  async getLeadActivities(leadId: string): Promise<Activity[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching activities for lead:', error.message)
      return []
    }

    return data || []
  }
}
