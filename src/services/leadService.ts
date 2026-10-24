import { supabase } from '../lib/supabaseClient'
import { Lead, LeadSource, LeadStatus, Profile } from '../types/database.types'
import { activityService } from './activityService'

export interface CreateLeadInput {
  full_name: string
  phone: string
  email?: string | null
  course_interest: string
  source: LeadSource
  status?: LeadStatus
  assigned_to?: string | null
  notes?: string | null
}

export const leadService = {
  /**
   * Fetches all registered staff profiles for assignment dropdowns.
   */
  async getStaffProfiles(): Promise<Profile[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at, updated_at')
      .order('full_name', { ascending: true })

    if (error) {
      console.error('Error fetching staff profiles:', error.message)
      return []
    }

    return data || []
  },

  /**
   * Inserts a new student enquiry into public.leads and automatically records
   * an audit log in public.activities.
   */
  async createLead(input: CreateLeadInput, currentUserId: string): Promise<Lead> {
    if (!supabase) {
      throw new Error('Supabase client is not configured. Please verify environment keys.')
    }

    const trimmedName = input.full_name.trim()
    const trimmedPhone = input.phone.trim()
    const trimmedEmail = input.email ? input.email.trim() : null
    const trimmedNotes = input.notes ? input.notes.trim() : null

    // Insert record into public.leads
    const { data, error } = await (supabase.from('leads') as any)
      .insert({
        full_name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail || null,
        course_interest: input.course_interest,
        source: input.source,
        status: input.status || 'New',
        assigned_to: input.assigned_to || currentUserId,
        created_by: currentUserId,
        notes: trimmedNotes || null
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting lead:', error.message)
      throw new Error(error.message)
    }

    const createdLead = data as Lead

    // Automatically trigger activity audit record
    await activityService.logActivity({
      leadId: createdLead.id,
      actorId: currentUserId,
      activityType: 'LEAD_CREATED',
      description: `Enquiry registered for ${createdLead.course_interest} via ${createdLead.source}`,
      metadata: {
        source: createdLead.source,
        course_interest: createdLead.course_interest,
        assigned_to: createdLead.assigned_to
      }
    })

    return createdLead
  },

  /**
   * Fetches the latest leads list (ordered by newest first).
   */
  async getLeads(): Promise<Lead[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching leads:', error.message)
      return []
    }

    return data || []
  }
}
