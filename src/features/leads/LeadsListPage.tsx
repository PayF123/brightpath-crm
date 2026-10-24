import React, { useState, useEffect, useCallback } from 'react'
import { Plus, RefreshCw, CheckCircle2, Layers } from 'lucide-react'
import { LeadFilters, FilterState } from './LeadFilters'
import { LeadTable } from './LeadTable'
import { LeadCardsMobile } from './LeadCardsMobile'
import { LeadFormModal } from './LeadFormModal'
import { leadService, LeadWithProfile } from '../../services/leadService'
import { Profile, Lead } from '../../types/database.types'

const COURSE_OPTIONS = [
  'Full Stack Web Development',
  'Data Science & AI',
  'UI/UX Design Masterclass',
  'Cloud & DevOps Engineering',
  'Cybersecurity & Ethical Hacking',
  'Digital Marketing & Growth',
  'Other'
]

const SOURCE_OPTIONS = [
  'Website',
  'Walk-in',
  'Referral',
  'Social Media',
  'Phone Inquiry',
  'Other'
]

export const LeadsListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leads, setLeads] = useState<LeadWithProfile[]>([])
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})
  const [staffProfiles, setStaffProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'All',
    course: 'All',
    source: 'All',
    assignedTo: 'All'
  })

  // Sorting State
  const [sortBy, setSortBy] = useState<'created_at' | 'full_name'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Screen Width State for Responsive Toggle
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load Staff Profiles once
  useEffect(() => {
    leadService.getStaffProfiles()
      .then(setStaffProfiles)
      .catch((err) => console.error('Failed to load staff profiles:', err))
  }, [])

  // Load Status Counts
  const loadStatusCounts = useCallback(async () => {
    try {
      const counts = await leadService.getStatusCounts()
      setStatusCounts(counts)
    } catch (err) {
      console.error('Failed to load status counts:', err)
    }
  }, [])

  // Fetch Filtered Leads from Supabase
  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const results = await leadService.getFilteredLeads({
        search: filters.search,
        status: filters.status,
        course: filters.course,
        source: filters.source,
        assignedTo: filters.assignedTo,
        sortBy,
        sortOrder
      })
      setLeads(results)
    } catch (err) {
      console.error('Error fetching filtered leads:', err)
    } finally {
      setLoading(false)
    }
  }, [filters, sortBy, sortOrder])

  // Trigger data fetch on filter/sort change
  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // Initial load of status counts
  useEffect(() => {
    loadStatusCounts()
  }, [loadStatusCounts])

  const handleSortChange = (column: 'created_at' | 'full_name') => {
    if (sortBy === column) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortOrder(column === 'full_name' ? 'asc' : 'desc')
    }
  }

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'All',
      course: 'All',
      source: 'All',
      assignedTo: 'All'
    })
  }

  const handleLeadCreated = (newLead: Lead) => {
    // Refresh leads list and status counts
    fetchLeads()
    loadStatusCounts()

    setToastMessage(`Lead for "${newLead.full_name}" registered successfully!`)
    setTimeout(() => {
      setToastMessage(null)
    }, 4500)
  }

  const isFiltered = Boolean(
    filters.search ||
    filters.status !== 'All' ||
    filters.course !== 'All' ||
    filters.source !== 'All' ||
    filters.assignedTo !== 'All'
  )

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
          <h1 className="page-title">Leads Directory</h1>
          <p className="page-desc">
            Search, filter, and monitor prospective student enquiries across coaching programs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Real-time Multi-Criteria Filter Bar */}
      <LeadFilters
        filters={filters}
        onFilterChange={setFilters}
        statusCounts={statusCounts}
        staffProfiles={staffProfiles}
        courseOptions={COURSE_OPTIONS}
        sourceOptions={SOURCE_OPTIONS}
      />

      {/* Dual Layout: Desktop Table vs Mobile Cards */}
      {isMobile ? (
        <LeadCardsMobile
          leads={leads}
          loading={loading}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />
      ) : (
        <LeadTable
          leads={leads}
          loading={loading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />
      )}

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLeadCreated}
      />
    </div>
  )
}
