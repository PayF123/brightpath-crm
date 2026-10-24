import { supabase } from '../lib/supabaseClient'
import { LeadStatus, LeadSource } from '../types/database.types'
import { isFollowUpOverdue, isDueToday } from '../utils/dateUtils'
import { FollowUpWithDetails } from './followupService'

export interface StageDistributionItem {
  status: LeadStatus
  count: number
  percentage: number
  color: string
}

export interface SourceDistributionItem {
  source: LeadSource
  count: number
  percentage: number
}

export interface ActivityDashboardItem {
  id: string
  lead_id: string
  lead_name: string
  actor_name: string
  activity_type: string
  description: string
  created_at: string
}

export interface DashboardMetrics {
  totalLeads: number
  newLeads: number
  convertedLeads: number
  conversionRate: number
  activeLeads: number
  overdueFollowups: number
  todayFollowups: number
  pendingFollowups: number
  completedFollowups: number
  stageDistribution: StageDistributionItem[]
  sourceDistribution: SourceDistributionItem[]
  urgentFollowups: FollowUpWithDetails[]
  recentActivities: ActivityDashboardItem[]
}

const STAGE_COLORS: Record<LeadStatus, string> = {
  New: '#06b6d4',       // Cyan
  Contacted: '#f59e0b', // Amber
  Qualified: '#3b82f6', // Blue
  Converted: '#10b981', // Emerald
  Lost: '#64748b'       // Slate
}

const ALL_SOURCES: LeadSource[] = [
  'Website',
  'Walk-in',
  'Referral',
  'Social Media',
  'Phone Inquiry',
  'Other'
]

export const metricService = {
  /**
   * Fetches and aggregates all executive dashboard metrics strictly reconciled
   * from active Supabase database records.
   */
  async getDashboardMetrics(counsellorId?: string): Promise<DashboardMetrics> {
    if (!supabase) {
      return this.getEmptyMetrics()
    }

    try {
      // 1. Concurrently query leads, follow-ups, and recent activities
      let leadsQuery = supabase
        .from('leads')
        .select('id, status, source, assigned_to')

      let followupsQuery = supabase
        .from('follow_ups')
        .select(`
          id,
          lead_id,
          due_at,
          note,
          status,
          completed_at,
          created_by,
          created_at,
          assigned_to,
          lead:leads(id, full_name, phone, email, course_interest, status),
          assigned_profile:profiles!assigned_to(id, full_name, role)
        `)
        .order('due_at', { ascending: true })

      let activitiesQuery = supabase
        .from('activities')
        .select(`
          id,
          lead_id,
          activity_type,
          description,
          created_at,
          lead:leads(id, full_name),
          actor_profile:profiles!actor_id(id, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(6)

      if (counsellorId && counsellorId !== 'All') {
        leadsQuery = leadsQuery.eq('assigned_to', counsellorId)
        followupsQuery = followupsQuery.eq('assigned_to', counsellorId)
      }

      const [leadsRes, followupsRes, activitiesRes] = await Promise.all([
        leadsQuery,
        followupsQuery,
        activitiesQuery
      ])

      const leads = (leadsRes.data as unknown as Array<{ id: string; status: LeadStatus; source: LeadSource }>) || []
      const followups = (followupsRes.data as unknown as FollowUpWithDetails[]) || []
      const rawActivities = (activitiesRes.data as unknown as Array<{
        id: string
        lead_id: string
        activity_type: string
        description: string
        created_at: string
        lead?: { id: string; full_name: string } | null
        actor_profile?: { id: string; full_name: string } | null
      }>) || []

      // 2. Compute Lead KPIs and Status Distribution
      const totalLeads = leads.length
      let newLeads = 0
      let contactedLeads = 0
      let qualifiedLeads = 0
      let convertedLeads = 0
      let lostLeads = 0

      const sourceCounts: Record<LeadSource, number> = {
        Website: 0,
        'Walk-in': 0,
        Referral: 0,
        'Social Media': 0,
        'Phone Inquiry': 0,
        Other: 0
      }

      leads.forEach((l) => {
        if (l.status === 'New') newLeads++
        else if (l.status === 'Contacted') contactedLeads++
        else if (l.status === 'Qualified') qualifiedLeads++
        else if (l.status === 'Converted') convertedLeads++
        else if (l.status === 'Lost') lostLeads++

        if (l.source && l.source in sourceCounts) {
          sourceCounts[l.source]++
        }
      })

      const conversionRate = totalLeads > 0
        ? Number(((convertedLeads / totalLeads) * 100).toFixed(1))
        : 0

      const activeLeads = totalLeads - convertedLeads - lostLeads

      const stageDistribution: StageDistributionItem[] = [
        {
          status: 'New',
          count: newLeads,
          percentage: totalLeads > 0 ? Number(((newLeads / totalLeads) * 100).toFixed(1)) : 0,
          color: STAGE_COLORS.New
        },
        {
          status: 'Contacted',
          count: contactedLeads,
          percentage: totalLeads > 0 ? Number(((contactedLeads / totalLeads) * 100).toFixed(1)) : 0,
          color: STAGE_COLORS.Contacted
        },
        {
          status: 'Qualified',
          count: qualifiedLeads,
          percentage: totalLeads > 0 ? Number(((qualifiedLeads / totalLeads) * 100).toFixed(1)) : 0,
          color: STAGE_COLORS.Qualified
        },
        {
          status: 'Converted',
          count: convertedLeads,
          percentage: totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0,
          color: STAGE_COLORS.Converted
        },
        {
          status: 'Lost',
          count: lostLeads,
          percentage: totalLeads > 0 ? Number(((lostLeads / totalLeads) * 100).toFixed(1)) : 0,
          color: STAGE_COLORS.Lost
        }
      ]

      const sourceDistribution: SourceDistributionItem[] = ALL_SOURCES.map((source) => ({
        source,
        count: sourceCounts[source] || 0,
        percentage: totalLeads > 0 ? Number(((sourceCounts[source] / totalLeads) * 100).toFixed(1)) : 0
      }))

      // 3. Compute Follow-up KPIs and Urgent Action Queue
      let overdueFollowups = 0
      let todayFollowups = 0
      let pendingFollowups = 0
      let completedFollowups = 0

      const pendingList: FollowUpWithDetails[] = []

      followups.forEach((fu) => {
        if (fu.status === 'completed') {
          completedFollowups++
        } else if (fu.status === 'pending') {
          pendingFollowups++
          pendingList.push(fu)

          if (isFollowUpOverdue(fu.due_at, fu.status)) {
            overdueFollowups++
          } else if (isDueToday(fu.due_at)) {
            todayFollowups++
          }
        }
      })

      // Sort urgent follow-ups: overdue first, then today, then upcoming
      pendingList.sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())
      const urgentFollowups = pendingList.slice(0, 5)

      // 4. Format Recent Activities
      const recentActivities: ActivityDashboardItem[] = rawActivities.map((act) => ({
        id: act.id,
        lead_id: act.lead_id,
        lead_name: act.lead?.full_name || 'Student Enquiry',
        actor_name: act.actor_profile?.full_name || 'Staff Member',
        activity_type: act.activity_type,
        description: act.description,
        created_at: act.created_at
      }))

      return {
        totalLeads,
        newLeads,
        convertedLeads,
        conversionRate,
        activeLeads,
        overdueFollowups,
        todayFollowups,
        pendingFollowups,
        completedFollowups,
        stageDistribution,
        sourceDistribution,
        urgentFollowups,
        recentActivities
      }
    } catch (err) {
      console.error('Error computing dashboard metrics:', err)
      return this.getEmptyMetrics()
    }
  },

  getEmptyMetrics(): DashboardMetrics {
    return {
      totalLeads: 0,
      newLeads: 0,
      convertedLeads: 0,
      conversionRate: 0,
      activeLeads: 0,
      overdueFollowups: 0,
      todayFollowups: 0,
      pendingFollowups: 0,
      completedFollowups: 0,
      stageDistribution: [
        { status: 'New', count: 0, percentage: 0, color: STAGE_COLORS.New },
        { status: 'Contacted', count: 0, percentage: 0, color: STAGE_COLORS.Contacted },
        { status: 'Qualified', count: 0, percentage: 0, color: STAGE_COLORS.Qualified },
        { status: 'Converted', count: 0, percentage: 0, color: STAGE_COLORS.Converted },
        { status: 'Lost', count: 0, percentage: 0, color: STAGE_COLORS.Lost }
      ],
      sourceDistribution: ALL_SOURCES.map((source) => ({ source, count: 0, percentage: 0 })),
      urgentFollowups: [],
      recentActivities: []
    }
  }
}
