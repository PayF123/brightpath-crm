import React, { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Plus,
  Calendar,
  RotateCw,
  Filter
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { metricService, DashboardMetrics } from '../../services/metricService'
import { followupService, FollowUpWithDetails } from '../../services/followupService'
import { leadService } from '../../services/leadService'
import { Lead, Profile } from '../../types/database.types'
import { KpiCard } from './KpiCard'
import { PipelineDistributionWidget } from './PipelineDistributionWidget'
import { SourceDistributionWidget } from './SourceDistributionWidget'
import { UrgentFollowupsWidget } from './UrgentFollowupsWidget'
import { RecentActivityWidget } from './RecentActivityWidget'
import { LeadFormModal } from '../leads/LeadFormModal'
import { FollowUpModal } from '../followups/FollowUpModal'

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth()
  const isElevated = role === 'admin' || role === 'manager'

  const [metrics, setMetrics] = useState<DashboardMetrics>(metricService.getEmptyMetrics())
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [staffProfiles, setStaffProfiles] = useState<Profile[]>([])
  const [selectedCounsellor, setSelectedCounsellor] = useState<string>('All')

  // Modals
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false)
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const showToast = (message: string) => {
    setSuccessToast(message)
    setTimeout(() => {
      setSuccessToast(null)
    }, 4500)
  }

  // Load staff members for dropdown filter (if admin or manager)
  useEffect(() => {
    if (isElevated) {
      leadService.getStaffProfiles().then(setStaffProfiles).catch(console.error)
    }
  }, [isElevated])

  // Fetch live metrics strictly reconciled from Supabase tables
  const fetchMetrics = useCallback(async (counsellorId?: string, isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      // If user is a counsellor, metrics are scoped to their own id (or governed by RLS)
      const targetCounsellor = isElevated ? counsellorId : user?.id
      const data = await metricService.getDashboardMetrics(targetCounsellor)
      setMetrics(data)
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [isElevated, user?.id])

  useEffect(() => {
    fetchMetrics(selectedCounsellor)
  }, [fetchMetrics, selectedCounsellor])

  // Handle in-place follow-up completion from UrgentFollowupsWidget
  const handleCompleteFollowUp = async (id: string) => {
    if (!user) return
    try {
      await followupService.completeFollowUp(id, user.id)
      showToast('Follow-up task marked completed!')
      // Optimistically update and silent re-fetch
      await fetchMetrics(selectedCounsellor, true)
    } catch (err) {
      console.error('Error completing follow-up from dashboard:', err)
    }
  }

  const handleLeadCreated = (newLead: Lead) => {
    showToast(`Lead for "${newLead.full_name}" captured successfully!`)
    fetchMetrics(selectedCounsellor, true)
  }

  const handleFollowUpCreated = (newFollowUp: FollowUpWithDetails) => {
    const studentName = newFollowUp.lead?.full_name || 'student'
    showToast(`Follow-up scheduled for ${studentName}!`)
    fetchMetrics(selectedCounsellor, true)
  }

  return (
    <div>
      {/* Toast Notification */}
      {successToast && (
        <div
          style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.85rem 1.25rem',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: 'var(--radius-md)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            color: '#34d399',
            fontSize: '0.88rem',
            fontWeight: 500,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Executive Admissions Dashboard</h1>
          <p className="page-desc">
            Enquiry-to-admission pipeline, counsellor follow-ups, and live conversion metrics.
          </p>
        </div>

        {/* Action Buttons & Staff Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Counsellor Filter for Admins/Managers */}
          {isElevated && staffProfiles.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Filter size={15} color="var(--text-muted)" />
              <select
                className="form-control"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem', minWidth: '160px' }}
                value={selectedCounsellor}
                onChange={(e) => setSelectedCounsellor(e.target.value)}
              >
                <option value="All">All Counsellors (Aggregate)</option>
                {staffProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Refresh Button */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => fetchMetrics(selectedCounsellor, true)}
            disabled={isRefreshing || loading}
            title="Refresh live metrics from database"
            style={{ padding: '0.55rem 0.85rem' }}
          >
            <RotateCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>

          {/* Quick Schedule Follow-up */}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsFollowUpModalOpen(true)}
            style={{ padding: '0.55rem 0.95rem' }}
          >
            <Calendar size={15} />
            <span>Schedule Task</span>
          </button>

          {/* Quick Add Lead */}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsLeadModalOpen(true)}
            style={{ padding: '0.55rem 1rem' }}
          >
            <Plus size={16} />
            <span>Quick Add Lead</span>
          </button>
        </div>
      </div>

      {/* Top 5 KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <KpiCard
          title="Total Inquiries"
          value={metrics.totalLeads}
          subtext={`${metrics.activeLeads} active in funnel`}
          icon={Users}
          iconBg="rgba(37, 99, 235, 0.15)"
          iconColor="var(--brand-light)"
          badgeText="Active Funnel"
          badgeVariant="primary"
          to="/leads"
          isLoading={loading}
        />

        <KpiCard
          title="New Inquiries"
          value={metrics.newLeads}
          subtext="Pending initial outreach"
          icon={Sparkles}
          iconBg="rgba(6, 182, 212, 0.15)"
          iconColor="#22d3ee"
          badgeText={metrics.newLeads > 0 ? 'Needs Action' : 'Cleared'}
          badgeVariant="info"
          to="/leads?status=New"
          isLoading={loading}
        />

        <KpiCard
          title="Admissions Converted"
          value={metrics.convertedLeads}
          subtext="Enrolled students"
          icon={CheckCircle2}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#34d399"
          badgeText={`${metrics.conversionRate}% rate`}
          badgeVariant="success"
          to="/leads?status=Converted"
          isLoading={loading}
        />

        <KpiCard
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          subtext="Inquiry-to-enrollment"
          icon={TrendingUp}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#34d399"
          badgeText={metrics.conversionRate >= 20 ? 'Optimal' : 'Tracking'}
          badgeVariant="success"
          isLoading={loading}
        />

        <KpiCard
          title="Overdue Reminders"
          value={metrics.overdueFollowups}
          subtext={metrics.overdueFollowups > 0 ? 'Requires immediate action' : 'Zero overdue items'}
          icon={AlertCircle}
          iconBg={metrics.overdueFollowups > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)'}
          iconColor={metrics.overdueFollowups > 0 ? '#fb7185' : '#34d399'}
          badgeText={metrics.overdueFollowups > 0 ? `${metrics.overdueFollowups} Overdue` : 'All Clear'}
          badgeVariant={metrics.overdueFollowups > 0 ? 'danger' : 'success'}
          to="/followups"
          isLoading={loading}
        />
      </div>

      {/* Middle Analytics Grid (Pipeline Funnel & Acquisition Sources) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        <PipelineDistributionWidget
          distribution={metrics.stageDistribution}
          totalLeads={metrics.totalLeads}
          isLoading={loading}
        />

        <SourceDistributionWidget
          distribution={metrics.sourceDistribution}
          totalLeads={metrics.totalLeads}
          isLoading={loading}
        />
      </div>

      {/* Operational Actions Grid (Urgent Follow-ups & Activity Audit Stream) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.25rem'
        }}
      >
        <UrgentFollowupsWidget
          followups={metrics.urgentFollowups}
          onComplete={handleCompleteFollowUp}
          isLoading={loading}
        />

        <RecentActivityWidget
          activities={metrics.recentActivities}
          isLoading={loading}
        />
      </div>

      {/* Quick Add Lead Modal */}
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={handleLeadCreated}
      />

      {/* Quick Schedule Follow-up Modal */}
      {user && (
        <FollowUpModal
          isOpen={isFollowUpModalOpen}
          onClose={() => setIsFollowUpModalOpen(false)}
          onSuccess={handleFollowUpCreated}
          currentUserId={user.id}
        />
      )}
    </div>
  )
}
