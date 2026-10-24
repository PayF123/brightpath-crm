import { supabase } from '../lib/supabaseClient'
import { FollowUp, FollowUpStatus, LeadStatus, UserRole } from '../types/database.types'
import { activityService } from './activityService'
import { isFollowUpOverdue, isDueToday, isDueUpcoming } from '../utils/dateUtils'

export interface CreateFollowUpInput {
  lead_id: string
  due_at: string
  note: string
  assigned_to?: string | null
}

export interface FollowUpWithDetails extends FollowUp {
  lead?: {
    id: string
    full_name: string
    phone: string
    email: string | null
    course_interest: string
    status: LeadStatus
  } | null
  assigned_profile?: {
    id: string
    full_name: string
    role: UserRole
  } | null
}

export interface FollowUpCounts {
  all: number
  overdue: number
  today: number
  upcoming: number
  completed: number
}

export const followupService = {
  /**
   * Schedules a new follow-up task and records an activity audit log.
   */
  async createFollowUp(input: CreateFollowUpInput, currentUserId: string): Promise<FollowUpWithDetails> {
    if (!supabase) {
      throw new Error('Supabase client is not configured.')
    }

    const { data, error } = await (supabase.from('follow_ups') as any)
      .insert({
        lead_id: input.lead_id,
        due_at: new Date(input.due_at).toISOString(),
        note: input.note.trim(),
        status: 'pending',
        assigned_to: input.assigned_to || currentUserId,
        created_by: currentUserId
      })
      .select('*, lead:leads(id, full_name, phone, email, course_interest, status), assigned_profile:profiles!assigned_to(id, full_name, role)')
      .single()

    if (error) {
      console.error('Error scheduling follow-up:', error.message)
      throw new Error(error.message)
    }

    const createdFollowUp = data as FollowUpWithDetails

    // Automatically trigger activity audit record
    const formattedDue = new Date(input.due_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

    await activityService.logActivity({
      leadId: input.lead_id,
      actorId: currentUserId,
      activityType: 'FOLLOW_UP_SCHEDULED',
      description: `Follow-up scheduled for ${formattedDue}: "${input.note.trim()}"`,
      metadata: {
        due_at: input.due_at,
        assigned_to: input.assigned_to || currentUserId,
        note: input.note.trim()
      }
    })

    return createdFollowUp
  },

  /**
   * Fetches follow-up tasks with joined lead and staff profile details.
   */
  async getFollowUps(
    tab: 'all' | 'overdue' | 'today' | 'upcoming' | 'completed' = 'all',
    assignedTo?: string
  ): Promise<FollowUpWithDetails[]> {
    if (!supabase) return []

    let query = supabase
      .from('follow_ups')
      .select('*, lead:leads(id, full_name, phone, email, course_interest, status), assigned_profile:profiles!assigned_to(id, full_name, role)')

    if (assignedTo && assignedTo !== 'All') {
      query = query.eq('assigned_to', assignedTo)
    }

    if (tab === 'completed') {
      query = query.eq('status', 'completed').order('completed_at', { ascending: false })
    } else {
      // Pending tasks ordered by urgency (soonest due first)
      query = query.order('due_at', { ascending: true })
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching follow-ups:', error.message)
      return []
    }

    const allRecords = (data as unknown as FollowUpWithDetails[]) || []

    // Apply tab filters in memory to guarantee real-time timestamp calculation
    if (tab === 'all') {
      return allRecords
    }

    if (tab === 'overdue') {
      return allRecords.filter((item) => isFollowUpOverdue(item.due_at, item.status))
    }

    if (tab === 'today') {
      return allRecords.filter((item) => item.status === 'pending' && isDueToday(item.due_at))
    }

    if (tab === 'upcoming') {
      return allRecords.filter((item) => item.status === 'pending' && !isFollowUpOverdue(item.due_at, item.status) && !isDueToday(item.due_at))
    }

    if (tab === 'completed') {
      return allRecords.filter((item) => item.status === 'completed')
    }

    return allRecords
  },

  /**
   * Fetches all follow-ups linked to a specific lead.
   */
  async getLeadFollowUps(leadId: string): Promise<FollowUpWithDetails[]> {
    if (!supabase) return []

    const { data, error } = await supabase
      .from('follow_ups')
      .select('*, lead:leads(id, full_name, phone, email, course_interest, status), assigned_profile:profiles!assigned_to(id, full_name, role)')
      .eq('lead_id', leadId)
      .order('due_at', { ascending: true })

    if (error) {
      console.error('Error fetching lead follow-ups:', error.message)
      return []
    }

    return (data as unknown as FollowUpWithDetails[]) || []
  },

  /**
   * Marks a follow-up as completed. Immediately ceases being overdue.
   */
  async completeFollowUp(id: string, currentUserId: string): Promise<FollowUpWithDetails> {
    if (!supabase) {
      throw new Error('Supabase client is not configured.')
    }

    const completedAt = new Date().toISOString()

    const { data, error } = await (supabase.from('follow_ups') as any)
      .update({
        status: 'completed',
        completed_at: completedAt
      })
      .eq('id', id)
      .select('*, lead:leads(id, full_name, phone, email, course_interest, status), assigned_profile:profiles!assigned_to(id, full_name, role)')
      .single()

    if (error) {
      console.error('Error completing follow-up:', error.message)
      throw new Error(error.message)
    }

    const completedRecord = data as FollowUpWithDetails

    // Log activity
    if (completedRecord.lead_id) {
      await activityService.logActivity({
        leadId: completedRecord.lead_id,
        actorId: currentUserId,
        activityType: 'FOLLOW_UP_COMPLETED',
        description: `Follow-up completed: "${completedRecord.note}"`,
        metadata: {
          follow_up_id: id,
          completed_at: completedAt
        }
      })
    }

    return completedRecord
  },

  /**
   * Cancels a scheduled follow-up task.
   */
  async cancelFollowUp(id: string, currentUserId: string): Promise<FollowUpWithDetails> {
    if (!supabase) {
      throw new Error('Supabase client is not configured.')
    }

    const { data, error } = await (supabase.from('follow_ups') as any)
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select('*, lead:leads(id, full_name, phone, email, course_interest, status), assigned_profile:profiles!assigned_to(id, full_name, role)')
      .single()

    if (error) {
      console.error('Error cancelling follow-up:', error.message)
      throw new Error(error.message)
    }

    const record = data as FollowUpWithDetails

    if (record.lead_id) {
      await activityService.logActivity({
        leadId: record.lead_id,
        actorId: currentUserId,
        activityType: 'FOLLOW_UP_CANCELLED',
        description: `Follow-up cancelled: "${record.note}"`,
        metadata: { follow_up_id: id }
      })
    }

    return record
  },

  /**
   * Returns live counts for the filter tabs.
   */
  async getFollowUpCounts(assignedTo?: string): Promise<FollowUpCounts> {
    if (!supabase) {
      return { all: 0, overdue: 0, today: 0, upcoming: 0, completed: 0 }
    }

    let query = supabase
      .from('follow_ups')
      .select('id, status, due_at, assigned_to')

    if (assignedTo && assignedTo !== 'All') {
      query = query.eq('assigned_to', assignedTo)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching follow-up counts:', error.message)
      return { all: 0, overdue: 0, today: 0, upcoming: 0, completed: 0 }
    }

    const rows = (data as unknown as Array<{ id: string; status: FollowUpStatus; due_at: string }>) || []

    let overdue = 0
    let today = 0
    let upcoming = 0
    let completed = 0

    rows.forEach((row) => {
      if (row.status === 'completed') {
        completed++
      } else if (row.status === 'pending') {
        if (isFollowUpOverdue(row.due_at, row.status)) {
          overdue++
        } else if (isDueToday(row.due_at)) {
          today++
        } else if (isDueUpcoming(row.due_at)) {
          upcoming++
        }
      }
    })

    return {
      all: rows.length,
      overdue,
      today,
      upcoming,
      completed
    }
  }
}
