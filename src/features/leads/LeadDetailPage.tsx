import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  BookOpen,
  Compass,
  User,
  Clock,
  Edit3,
  CalendarClock,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { leadService, LeadWithProfile } from '../../services/leadService'
import { activityService, ActivityWithActor } from '../../services/activityService'
import { StatusBadge } from '../../components/common/StatusBadge'
import { LeadStatusStepper } from './LeadStatusStepper'
import { LostReasonModal } from './LostReasonModal'
import { EditLeadModal } from './EditLeadModal'
import { LeadActivityTimeline } from './LeadActivityTimeline'
import { EmptyState } from '../../components/common/EmptyState'
import { LeadStatus, Profile } from '../../types/database.types'

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [lead, setLead] = useState<LeadWithProfile | null>(null)
  const [activities, setActivities] = useState<ActivityWithActor[]>([])
  const [staffProfiles, setStaffProfiles] = useState<Profile[]>([])

  const [loading, setLoading] = useState(true)
  const [loadingActivities, setLoadingActivities] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Modals state
  const [isLostModalOpen, setIsLostModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Fetch lead data
  const loadLead = useCallback(async () => {
    if (!id) return
    setLoading(true)
    try {
      const data = await leadService.getLeadById(id)
      setLead(data)
    } catch (err) {
      console.error('Failed to load lead details:', err)
    } finally {
      setLoading(false)
    }
  }, [id])

  // Fetch activity logs
  const loadActivities = useCallback(async () => {
    if (!id) return
    setLoadingActivities(true)
    try {
      const data = await activityService.getLeadActivities(id)
      setActivities(data)
    } catch (err) {
      console.error('Failed to load activities:', err)
    } finally {
      setLoadingActivities(false)
    }
  }, [id])

  // Fetch staff profiles for reassignment
  useEffect(() => {
    leadService.getStaffProfiles()
      .then(setStaffProfiles)
      .catch((err) => console.error('Failed to load staff profiles:', err))
  }, [])

  useEffect(() => {
    loadLead()
    loadActivities()
  }, [loadLead, loadActivities])

  // Status Change Handler
  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!id || !user?.id || !lead || lead.status === newStatus) return

    setIsUpdatingStatus(true)
    try {
      const updated = await leadService.updateLeadStatus(id, newStatus, user.id)
      if (updated) {
        setLead(updated)
        showToast(`Status updated to "${newStatus}"!`)
        loadActivities()
      }
    } catch (err) {
      console.error('Error advancing status:', err)
      alert('Failed to update status. Please try again.')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Lost Reason Submit Handler
  const handleLostSubmit = async (reason: string, remarks: string) => {
    if (!id || !user?.id) return

    setIsUpdatingStatus(true)
    try {
      const updated = await leadService.updateLeadStatus(id, 'Lost', user.id, reason, remarks)
      if (updated) {
        setLead(updated)
        showToast('Lead marked as Lost.')
        loadActivities()
      }
    } catch (err) {
      console.error('Error marking lead as lost:', err)
      throw err
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // Lead Details Update Handler
  const handleLeadUpdated = (updated: LeadWithProfile) => {
    setLead(updated)
    showToast('Lead details updated successfully!')
    loadActivities()
  }

  // Note Added Handler
  const handleNoteAdded = (newActivity: ActivityWithActor) => {
    setActivities((prev) => [newActivity, ...prev])
    showToast('Consultation note recorded!')
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—'
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Loading student enquiry profile...</span>
        </div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <Link to="/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-light)', fontSize: '0.88rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Leads Directory</span>
          </Link>
        </div>
        <div className="card" style={{ padding: 0 }}>
          <EmptyState
            type="no-data"
            title="Student Enquiry Not Found"
            description="The requested lead record could not be found or you may not have permission to view it."
            onAction={() => navigate('/leads')}
            actionLabel="Return to Leads Directory"
          />
        </div>
      </div>
    )
  }

  const counsellor = lead.assigned_profile
  const creator = lead.created_profile

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
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
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Link */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link
          to="/leads"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--brand-light)',
            fontSize: '0.88rem',
            fontWeight: 500,
            textDecoration: 'none'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Leads Directory</span>
        </Link>
      </div>

      {/* Profile Header Banner */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <h1 className="page-title">{lead.full_name}</h1>
            <StatusBadge status={lead.status} size="md" />
          </div>
          <p className="page-desc" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span>Record ID: <code style={{ color: 'var(--text-muted)' }}>{lead.id}</code></span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Calendar size={13} />
              <span>Created {formatDate(lead.created_at)}</span>
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit3 size={15} />
            <span>Edit Details</span>
          </button>

          <Link
            to="/followups"
            className="btn btn-primary"
          >
            <CalendarClock size={16} />
            <span>Schedule Follow-up</span>
          </Link>
        </div>
      </div>

      {/* Interactive Visual Status Pipeline Stepper */}
      <LeadStatusStepper
        currentStatus={lead.status}
        onStatusChange={handleStatusChange}
        onMarkLost={() => setIsLostModalOpen(true)}
        isUpdating={isUpdatingStatus}
      />

      {/* Main 2-Column Grid */}
      <div className="grid-cols-2">
        {/* Left Column: Student Details & Consultation Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Contact & Program Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem' }}>
              Enquiry Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone Number</span>
                <a
                  href={`tel:${lead.phone}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#fff', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}
                >
                  <Phone size={14} style={{ color: 'var(--brand-light)' }} />
                  <span>{lead.phone}</span>
                </a>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Address</span>
                {lead.email ? (
                  <a
                    href={`mailto:${lead.email}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--brand-light)', fontSize: '0.88rem', textDecoration: 'none' }}
                  >
                    <Mail size={14} />
                    <span>{lead.email}</span>
                  </a>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not provided</span>
                )}
              </div>

              {/* Course Interest */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Course Interest</span>
                <span style={{
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(37, 99, 235, 0.15)',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: 'var(--brand-light)',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}>
                  {lead.course_interest}
                </span>
              </div>

              {/* Source */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lead Source</span>
                <span style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem'
                }}>
                  {lead.source}
                </span>
              </div>

              {/* Assigned Counsellor */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Assigned Counsellor</span>
                {counsellor ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--brand-primary), #1d4ed8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#fff'
                    }}>
                      {counsellor.full_name.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>
                      {counsellor.full_name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      ({counsellor.role})
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Unassigned</span>
                )}
              </div>

              {/* Registered By */}
              {creator && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Captured By</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {creator.full_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Consultation Notes Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                Consultation Notes
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--brand-light)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Edit3 size={13} />
                <span>Edit</span>
              </button>
            </div>

            {lead.notes ? (
              <div style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap'
              }}>
                {lead.notes}
              </div>
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                No initial counsellor notes recorded for this enquiry.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div>
          <LeadActivityTimeline
            leadId={lead.id}
            activities={activities}
            loading={loadingActivities}
            onNoteAdded={handleNoteAdded}
            currentUserId={user?.id || ''}
          />
        </div>
      </div>

      {/* Lost Reason Modal */}
      <LostReasonModal
        isOpen={isLostModalOpen}
        onClose={() => setIsLostModalOpen(false)}
        onSubmit={handleLostSubmit}
      />

      {/* Edit Details Modal */}
      <EditLeadModal
        isOpen={isEditModalOpen}
        lead={lead}
        staffProfiles={staffProfiles}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleLeadUpdated}
        currentUserId={user?.id || ''}
      />
    </div>
  )
}
