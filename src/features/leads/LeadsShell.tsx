import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Users,
  Calendar
} from 'lucide-react'
import { LeadFormModal } from './LeadFormModal'
import { leadService } from '../../services/leadService'
import { Lead, LeadStatus } from '../../types/database.types'

export const LeadsShell: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const loadLeads = useCallback(async () => {
    setLoading(true)
    try {
      const data = await leadService.getLeads()
      setLeads(data)
    } catch (err) {
      console.error('Failed to load leads:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLeads()
  }, [loadLeads])

  const handleLeadCreated = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev])
    setToastMessage(`Lead for "${newLead.full_name}" created successfully!`)
    setTimeout(() => {
      setToastMessage(null)
    }, 4500)
  }

  const getStatusBadgeClass = (status: LeadStatus) => {
    switch (status) {
      case 'New': return 'badge-new'
      case 'Contacted': return 'badge-contacted'
      case 'Qualified': return 'badge-qualified'
      case 'Converted': return 'badge-converted'
      case 'Lost': return 'badge-lost'
      default: return 'badge-secondary'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
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
          <h1 className="page-title">Leads Directory</h1>
          <p className="page-desc">
            Manage student enquiries, update consultation statuses, and track counsellor assignments.
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

      {/* Search and Filters Bar (Preview placeholder for Phase 6) */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search across student name, phone, or email..."
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem 0.6rem 2.25rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-card)',
                color: '#fff',
                fontSize: '0.9rem'
              }}
              readOnly
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                fontSize: '0.88rem'
              }}
              disabled
            >
              <option>Status: All</option>
            </select>

            <select
              style={{
                padding: '0.6rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-canvas)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-secondary)',
                fontSize: '0.88rem'
              }}
              disabled
            >
              <option>Source: All</option>
            </select>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={loadLeads}
              disabled={loading}
              title="Refresh database records"
              style={{ padding: '0.6rem 0.9rem' }}
            >
              <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Student Name</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Course Interest</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Contact Details</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Source</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                      <RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Loading records from Supabase...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem 1.5rem', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: 'var(--text-muted)',
                      marginBottom: '0.75rem'
                    }}>
                      <Users size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.05rem', color: '#fff', marginBottom: '0.25rem' }}>
                      No Leads Registered Yet
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                      Capture your first student enquiry by clicking the "+ Add New Lead" button above.
                    </p>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <Plus size={15} />
                      <span>Create First Lead</span>
                    </button>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>{lead.full_name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <Calendar size={12} />
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ color: 'var(--brand-light)', fontWeight: 500, fontSize: '0.9rem' }}>
                        {lead.course_interest}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{lead.phone}</span>
                      </div>
                      {lead.email && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          <Mail size={13} />
                          <span>{lead.email}</span>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {lead.source}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Link
                        to={`/leads/${lead.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        <span>Details</span>
                        <ExternalLink size={13} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div style={{
          padding: '0.9rem 1.25rem',
          background: 'rgba(0,0,0,0.1)',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Total Enquiries: <strong style={{ color: '#fff' }}>{leads.length}</strong>
          </span>
          <span className="badge badge-converted">Live Supabase Database</span>
        </div>
      </div>

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleLeadCreated}
      />
    </div>
  )
}
