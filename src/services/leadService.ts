import { supabase } from '../lib/supabaseClient'
import { Lead, LeadSource, LeadStatus, Profile, UserRole } from '../types/database.types'
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

export interface LeadWithProfile extends Lead {
  assigned_profile?: {
    id: string
    full_name: string
    role: UserRole
  } | null
  created_profile?: {
    id: string
    full_name: string
    role: UserRole
  } | null
}

export interface LeadFilterParams {
  search?: string
  status?: string
  source?: string
  course?: string
  assignedTo?: string
  sortBy?: 'created_at' | 'full_name'
  sortOrder?: 'asc' | 'desc'
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
  },

  /**
   * Fetches filtered leads supporting debounced text search, multi-field filters,
   * column sorting, and joined staff profile data.
   */
  async getFilteredLeads(filters: LeadFilterParams = {}): Promise<LeadWithProfile[]> {
    if (!supabase) return []

    let query = supabase
      .from('leads')
      .select('*, assigned_profile:profiles!assigned_to(id, full_name, role)')

    // 1. Text Search across name, phone, email
    if (filters.search && filters.search.trim()) {
      const term = filters.search.trim()
      query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`)
    }

    // 2. Status Filter
    if (filters.status && filters.status !== 'All') {
      query = query.eq('status', filters.status)
    }

    // 3. Source Filter
    if (filters.source && filters.source !== 'All') {
      query = query.eq('source', filters.source)
    }

    // 4. Course Filter
    if (filters.course && filters.course !== 'All') {
      query = query.eq('course_interest', filters.course)
    }

    // 5. Assignee Filter
    if (filters.assignedTo && filters.assignedTo !== 'All') {
      query = query.eq('assigned_to', filters.assignedTo)
    }

    // 6. Sorting
    const sortColumn = filters.sortBy || 'created_at'
    const isAscending = filters.sortOrder === 'asc'
    query = query.order(sortColumn, { ascending: isAscending })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching filtered leads:', error.message)
      return []
    }

    return (data as unknown as LeadWithProfile[]) || []
  },

  /**
   * Fetches a single lead by its UUID, including joined counsellor and creator profiles.
   */
  async getLeadById(id: string): Promise<LeadWithProfile | null> {
    if (!supabase) return null

    const { data, error } = await supabase
      .from('leads')
      .select('*, assigned_profile:profiles!assigned_to(id, full_name, role), created_profile:profiles!created_by(id, full_name, role)')
      .eq('id', id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching lead by id:', error.message)
      return null
    }

    return (data as unknown as LeadWithProfile) || null
  },

  /**
   * Updates lead status along the progression pipeline and records an audit log.
   */
  async updateLeadStatus(
    id: string,
    newStatus: LeadStatus,
    currentUserId: string,
    reason?: string,
    notes?: string
  ): Promise<LeadWithProfile | null> {
    if (!supabase) throw new Error('Supabase client is not configured.')

    // Fetch current lead to record previous_status
    const currentLead = await this.getLeadById(id)
    if (!currentLead) throw new Error('Lead not found.')

    const previousStatus = currentLead.status

    const updatePayload: Record<string, unknown> = {
      status: newStatus,
      updated_at: new Date().toISOString()
    }

    // If a cancellation reason or explanation is given, append/update notes
    if (reason) {
      const reasonNote = `[Status: ${newStatus}] Reason: ${reason}${notes ? ` - ${notes}` : ''}`
      updatePayload.notes = currentLead.notes ? `${currentLead.notes}\n${reasonNote}` : reasonNote
    }

    const { data, error } = await (supabase.from('leads') as any)
      .update(updatePayload)
      .eq('id', id)
      .select('*, assigned_profile:profiles!assigned_to(id, full_name, role)')
      .single()

    if (error) {
      console.error('Error updating lead status:', error.message)
      throw new Error(error.message)
    }

    // Automatically record activity log
    const activityDesc = reason
      ? `Lead marked as ${newStatus}: ${reason}`
      : `Status advanced from ${previousStatus} to ${newStatus}`

    await activityService.logActivity({
      leadId: id,
      actorId: currentUserId,
      activityType: 'STATUS_CHANGED',
      description: activityDesc,
      metadata: {
        previous_status: previousStatus,
        new_status: newStatus,
        reason: reason || null,
        notes: notes || null
      }
    })

    return data as LeadWithProfile
  },

  /**
   * Updates lead contact details, counsellor assignment, or course interest.
   */
  async updateLead(
    id: string,
    updates: Partial<CreateLeadInput>,
    currentUserId: string
  ): Promise<LeadWithProfile | null> {
    if (!supabase) throw new Error('Supabase client is not configured.')

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString()
    }

    if (updates.full_name !== undefined) payload.full_name = updates.full_name.trim()
    if (updates.phone !== undefined) payload.phone = updates.phone.trim()
    if (updates.email !== undefined) payload.email = updates.email ? updates.email.trim() : null
    if (updates.course_interest !== undefined) payload.course_interest = updates.course_interest
    if (updates.source !== undefined) payload.source = updates.source
    if (updates.assigned_to !== undefined) payload.assigned_to = updates.assigned_to
    if (updates.notes !== undefined) payload.notes = updates.notes ? updates.notes.trim() : null

    const { data, error } = await (supabase.from('leads') as any)
      .update(payload)
      .eq('id', id)
      .select('*, assigned_profile:profiles!assigned_to(id, full_name, role)')
      .single()

    if (error) {
      console.error('Error updating lead:', error.message)
      throw new Error(error.message)
    }

    // Log update activity
    await activityService.logActivity({
      leadId: id,
      actorId: currentUserId,
      activityType: 'LEAD_UPDATED',
      description: 'Lead profile details updated by staff',
      metadata: { updated_fields: Object.keys(updates) }
    })

    return data as LeadWithProfile
  },

  /**
   * Returns counts of leads grouped by status for quick status badges.
   */
  async getStatusCounts(): Promise<Record<string, number>> {
    if (!supabase) return {}

    const { data, error } = await supabase
      .from('leads')
      .select('status')

    if (error) {
      console.error('Error fetching status counts:', error.message)
      return {}
    }

    const rows = (data as unknown as Array<{ status: string }>) || []

    const counts: Record<string, number> = {
      All: rows.length,
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Converted: 0,
      Lost: 0
    }

    rows.forEach((row) => {
      if (row.status && row.status in counts) {
        counts[row.status] = (counts[row.status] || 0) + 1
      }
    })

    return counts
  }
}
