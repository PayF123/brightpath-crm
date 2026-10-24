import React, { useState, useEffect, useCallback } from 'react'
import { Plus, RefreshCw, CheckCircle2, CalendarClock, AlertCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { followupService, FollowUpWithDetails, FollowUpCounts } from '../../services/followupService'
import { leadService } from '../../services/leadService'
import { FollowUpCard } from './FollowUpCard'
import { FollowUpModal } from './FollowUpModal'
import { FollowUpFilterTabs, FollowUpTab } from './FollowUpFilterTabs'
import { EmptyState } from '../../components/common/EmptyState'
import { CardSkeleton } from '../../components/common/LoadingSkeleton'
import { Profile } from '../../types/database.types'

export const FollowUpsPage: React.FC = () => {
  const { user } = useAuth()

  const [followUps, setFollowUps] = useState<FollowUpWithDetails[]>([])
  const [counts, setCounts] = useState<FollowUpCounts>({
    all: 0,
    overdue: 0,
    today: 0,
    upcoming: 0,
    completed: 0
  })
  const [staffProfiles, setStaffProfiles] = useState<Profile[]>([])
  const [activeTab, setActiveTab] = useState<FollowUpTab>('all')
  const [assignedTo, setAssignedTo] = useState<string>('All')

  const [loading, setLoading] = useState(true)
  const [completingId, setCompletingId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Load staff profiles
  useEffect(() => {
    leadService.getStaffProfiles()
      .then(setStaffProfiles)
      .catch((err) => console.error('Failed to load staff profiles:', err))
  }, [])

  // Load counts
  const loadCounts = useCallback(async () => {
    try {
      const data = await followupService.getFollowUpCounts(assignedTo)
      setCounts(data)
    } catch (err) {
      console.error('Failed to load follow-up counts:', err)
    }
  }, [assignedTo])

  // Load follow-ups
  const fetchFollowUps = useCallback(async () => {
    setLoading(true)
    try {
      const records = await followupService.getFollowUps(activeTab, assignedTo)
      setFollowUps(records)
    } catch (err) {
      console.error('Error fetching follow-ups:', err)
    } finally {
      setLoading(false)
    }
  }, [activeTab, assignedTo])

  useEffect(() => {
    fetchFollowUps()
    loadCounts()
  }, [fetchFollowUps, loadCounts])

  // Complete Follow-up
  const handleComplete = async (id: string) => {
    if (!user?.id) return
    setCompletingId(id)

    try {
      await followupService.completeFollowUp(id, user.id)
      showToast('Task marked as completed! Ceases being overdue.')
      await fetchFollowUps()
      await loadCounts()
    } catch (err) {
      console.error('Failed to complete follow-up:', err)
      alert('Failed to mark task completed.')
    } finally {
      setCompletingId(null)
    }
  }

  // Follow-up scheduled callback
  const handleScheduled = (newFollowUp: FollowUpWithDetails) => {
    showToast('New follow-up task scheduled!')
    fetchFollowUps()
    loadCounts()
  }

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

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Follow-ups Queue</h1>
          <p className="page-desc">
            Monitor student consultation appointments, callback deadlines, and overdue tasks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            <span>Schedule Follow-up</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Assignee Selector */}
      <FollowUpFilterTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
        staffProfiles={staffProfiles}
        assignedTo={assignedTo}
        onAssigneeChange={setAssignedTo}
      />

      {/* Follow-up Tasks List */}
      {loading ? (
        <CardSkeleton count={3} />
      ) : followUps.length === 0 ? (
        <div className="card" style={{ padding: 0 }}>
          <EmptyState
            type="no-data"
            title={activeTab === 'overdue' ? 'No Overdue Follow-ups! 🎉' : 'No Follow-up Tasks in Queue'}
            description={
              activeTab === 'overdue'
                ? 'All pending follow-ups are up to date! Great job staying ahead of deadlines.'
                : activeTab === 'completed'
                ? 'No completed tasks found in this view.'
                : 'Schedule a consultation reminder for any student to ensure no enquiry is missed.'
            }
            onAction={() => setIsModalOpen(true)}
            actionLabel="Schedule a Follow-up"
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {followUps.map((item) => (
            <FollowUpCard
              key={item.id}
              followUp={item}
              onComplete={handleComplete}
              isActionLoading={completingId === item.id}
            />
          ))}
        </div>
      )}

      {/* Schedule Follow-up Modal */}
      <FollowUpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleScheduled}
        currentUserId={user?.id || ''}
      />
    </div>
  )
}
