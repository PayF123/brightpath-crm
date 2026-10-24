import { supabase } from '../lib/supabaseClient'
import { Activity, UserRole } from '../types/database.types'

export interface LogActivityInput {
  leadId: string
  actorId?: string | null
  activityType: string
  description: string
  metadata?: Record<string, unknown>
}

export interface ActivityWithActor extends Activity {
  actor_profile?: {
    id: string
    full_name: string
    role: UserRole
  } | null
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
   * Logs an instant consultation note to a lead's activity timeline.
   */
  async addLeadNote(leadId: string, actorId: string, noteText: string): Promise<Activity | null> {
    return this.logActivity({
      leadId,
      actorId,
      activityType: 'NOTE_ADDED',
      description: noteText.trim(),
      metadata: { note: noteText.trim() }
    })
  },

  /**
   * Fetches chronological activity timeline for a specific lead, joined with actor profile.
   */
  async getLeadActivities(leadId: string): Promise<ActivityWithActor[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('activities')
      .select('*, actor_profile:profiles!actor_id(id, full_name, role)')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching activities for lead:', error.message)
      return []
    }

    return (data as unknown as ActivityWithActor[]) || []
  }
}
