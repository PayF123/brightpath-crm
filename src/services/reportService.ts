import { supabase } from '../lib/supabaseClient'
import { LeadSource, UserRole } from '../types/database.types'

export type DateRangePreset = 'all' | '30d' | '7d' | 'today'

export interface ChannelPerformance {
  source: LeadSource
  totalInquiries: number
  convertedCount: number
  conversionRate: number
  sharePercentage: number
}

export interface CourseDemandItem {
  course: string
  totalInquiries: number
  convertedCount: number
  conversionRate: number
  sharePercentage: number
}

export interface CounsellorPerformanceItem {
  id: string
  name: string
  role: UserRole
  assignedCount: number
  convertedCount: number
  lostCount: number
  conversionRate: number
}

export interface ReportsSummary {
  totalInquiries: number
  totalConverted: number
  overallConversionRate: number
  topSource: string
  topCourse: string
}

export interface ReportsData {
  summary: ReportsSummary
  channelPerformance: ChannelPerformance[]
  courseDemand: CourseDemandItem[]
  counsellorPerformance: CounsellorPerformanceItem[]
}

const ALL_SOURCES: LeadSource[] = [
  'Website',
  'Walk-in',
  'Referral',
  'Social Media',
  'Phone Inquiry',
  'Other'
]

export const reportService = {
  /**
   * Computes the ISO timestamp boundary corresponding to a date range preset.
   */
  getStartDateForPreset(preset: DateRangePreset): string | null {
    const now = new Date()

    if (preset === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return today.toISOString()
    }

    if (preset === '7d') {
      const past7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      return past7.toISOString()
    }

    if (preset === '30d') {
      const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      return past30.toISOString()
    }

    return null
  },

  /**
   * Fetches and aggregates performance analytics reconciled from Supabase leads.
   */
  async getReportsData(preset: DateRangePreset = 'all'): Promise<ReportsData> {
    if (!supabase) {
      return this.getEmptyReportsData()
    }

    try {
      let query = supabase
        .from('leads')
        .select(`
          id,
          status,
          source,
          course_interest,
          created_at,
          assigned_to,
          assigned_profile:profiles!assigned_to(id, full_name, role)
        `)

      const startDate = this.getStartDateForPreset(preset)
      if (startDate) {
        query = query.gte('created_at', startDate)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching leads for reports:', error.message)
        return this.getEmptyReportsData()
      }

      const rawLeads = (data as unknown as Array<{
        id: string
        status: string
        source: LeadSource
        course_interest: string
        created_at: string
        assigned_to: string | null
        assigned_profile?: { id: string; full_name: string; role: UserRole } | null
      }>) || []

      const totalInquiries = rawLeads.length
      let totalConverted = 0

      // 1. Channel Attribution Mapping
      const sourceMap: Record<LeadSource, { total: number; converted: number }> = {
        Website: { total: 0, converted: 0 },
        'Walk-in': { total: 0, converted: 0 },
        Referral: { total: 0, converted: 0 },
        'Social Media': { total: 0, converted: 0 },
        'Phone Inquiry': { total: 0, converted: 0 },
        Other: { total: 0, converted: 0 }
      }

      // 2. Course Demand Mapping
      const courseMap: Record<string, { total: number; converted: number }> = {}

      // 3. Counsellor Performance Mapping
      const counsellorMap: Record<string, {
        id: string
        name: string
        role: UserRole
        assigned: number
        converted: number
        lost: number
      }> = {}

      rawLeads.forEach((lead) => {
        const isConverted = lead.status === 'Converted'
        const isLost = lead.status === 'Lost'

        if (isConverted) totalConverted++

        // Channel
        if (lead.source && lead.source in sourceMap) {
          sourceMap[lead.source].total++
          if (isConverted) sourceMap[lead.source].converted++
        }

        // Course
        const course = lead.course_interest || 'General Enquiry'
        if (!courseMap[course]) {
          courseMap[course] = { total: 0, converted: 0 }
        }
        courseMap[course].total++
        if (isConverted) courseMap[course].converted++

        // Counsellor
        if (lead.assigned_profile) {
          const profile = lead.assigned_profile
          if (!counsellorMap[profile.id]) {
            counsellorMap[profile.id] = {
              id: profile.id,
              name: profile.full_name,
              role: profile.role,
              assigned: 0,
              converted: 0,
              lost: 0
            }
          }
          counsellorMap[profile.id].assigned++
          if (isConverted) counsellorMap[profile.id].converted++
          if (isLost) counsellorMap[profile.id].lost++
        }
      })

      const overallConversionRate = totalInquiries > 0
        ? Number(((totalConverted / totalInquiries) * 100).toFixed(1))
        : 0

      // Format Channel Performance
      const channelPerformance: ChannelPerformance[] = ALL_SOURCES.map((source) => {
        const item = sourceMap[source]
        const rate = item.total > 0
          ? Number(((item.converted / item.total) * 100).toFixed(1))
          : 0
        const share = totalInquiries > 0
          ? Number(((item.total / totalInquiries) * 100).toFixed(1))
          : 0
        return {
          source,
          totalInquiries: item.total,
          convertedCount: item.converted,
          conversionRate: rate,
          sharePercentage: share
        }
      }).sort((a, b) => b.totalInquiries - a.totalInquiries)

      // Format Course Demand
      const courseDemand: CourseDemandItem[] = Object.keys(courseMap).map((course) => {
        const item = courseMap[course]
        const rate = item.total > 0
          ? Number(((item.converted / item.total) * 100).toFixed(1))
          : 0
        const share = totalInquiries > 0
          ? Number(((item.total / totalInquiries) * 100).toFixed(1))
          : 0
        return {
          course,
          totalInquiries: item.total,
          convertedCount: item.converted,
          conversionRate: rate,
          sharePercentage: share
        }
      }).sort((a, b) => b.totalInquiries - a.totalInquiries)

      // Format Counsellor Performance
      const counsellorPerformance: CounsellorPerformanceItem[] = Object.values(counsellorMap).map((c) => {
        const rate = c.assigned > 0
          ? Number(((c.converted / c.assigned) * 100).toFixed(1))
          : 0
        return {
          id: c.id,
          name: c.name,
          role: c.role,
          assignedCount: c.assigned,
          convertedCount: c.converted,
          lostCount: c.lost,
          conversionRate: rate
        }
      }).sort((a, b) => b.assignedCount - a.assignedCount)

      // Determine Top Performing Channel & Course
      const topSource = channelPerformance.length > 0 && channelPerformance[0].totalInquiries > 0
        ? `${channelPerformance[0].source} (${channelPerformance[0].totalInquiries})`
        : 'None recorded'

      const topCourse = courseDemand.length > 0 && courseDemand[0].totalInquiries > 0
        ? `${courseDemand[0].course} (${courseDemand[0].totalInquiries})`
        : 'None recorded'

      return {
        summary: {
          totalInquiries,
          totalConverted,
          overallConversionRate,
          topSource,
          topCourse
        },
        channelPerformance,
        courseDemand,
        counsellorPerformance
      }
    } catch (err) {
      console.error('Unexpected error aggregating reports:', err)
      return this.getEmptyReportsData()
    }
  },

  getEmptyReportsData(): ReportsData {
    return {
      summary: {
        totalInquiries: 0,
        totalConverted: 0,
        overallConversionRate: 0,
        topSource: 'None recorded',
        topCourse: 'None recorded'
      },
      channelPerformance: ALL_SOURCES.map((source) => ({
        source,
        totalInquiries: 0,
        convertedCount: 0,
        conversionRate: 0,
        sharePercentage: 0
      })),
      courseDemand: [],
      counsellorPerformance: []
    }
  }
}
