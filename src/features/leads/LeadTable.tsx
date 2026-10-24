import React from 'react'
import { Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  ExternalLink,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User
} from 'lucide-react'
import { StatusBadge } from '../../components/common/StatusBadge'
import { TableSkeleton } from '../../components/common/LoadingSkeleton'
import { EmptyState } from '../../components/common/EmptyState'
import { LeadWithProfile } from '../../services/leadService'

interface LeadTableProps {
  leads: LeadWithProfile[]
  loading: boolean
  sortBy: 'created_at' | 'full_name'
  sortOrder: 'asc' | 'desc'
  onSortChange: (column: 'created_at' | 'full_name') => void
  onResetFilters: () => void
  isFiltered: boolean
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  sortBy,
  sortOrder,
  onSortChange,
  onResetFilters,
  isFiltered
}) => {
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const renderSortArrow = (column: 'created_at' | 'full_name') => {
    if (sortBy !== column) {
      return <ArrowUpDown size={13} style={{ color: 'var(--text-muted)' }} />
    }
    return sortOrder === 'asc'
      ? <ArrowUp size={13} style={{ color: 'var(--brand-light)' }} />
      : <ArrowDown size={13} style={{ color: 'var(--brand-light)' }} />
  }

  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.25)' }}>
              <th
                onClick={() => onSortChange('full_name')}
                style={{
                  padding: '1rem 1.25rem',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Student Name</span>
                  {renderSortArrow('full_name')}
                </div>
              </th>

              <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Course Interest
              </th>

              <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Contact Details
              </th>

              <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Source
              </th>

              <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Status
              </th>

              <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Assigned Counsellor
              </th>

              <th
                onClick={() => onSortChange('created_at')}
                style={{
                  padding: '1rem 1.25rem',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  textAlign: 'right'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', width: '100%' }}>
                  <span>Created</span>
                  {renderSortArrow('created_at')}
                </div>
              </th>

              <th style={{ padding: '1rem 1.25rem', fontSize: '0.78rem', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'right' }}>
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <TableSkeleton rows={4} />
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 0 }}>
                  <EmptyState
                    type={isFiltered ? 'no-results' : 'no-data'}
                    onAction={isFiltered ? onResetFilters : undefined}
                    actionLabel={isFiltered ? 'Clear All Filters' : undefined}
                  />
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const counsellor = lead.assigned_profile

                return (
                  <tr
                    key={lead.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    {/* Student Name */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Link
                        to={`/leads/${lead.id}`}
                        style={{
                          fontWeight: 600,
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: '0.94rem'
                        }}
                      >
                        {lead.full_name}
                      </Link>
                      {lead.notes && (
                        <div style={{
                          fontSize: '0.76rem',
                          color: 'var(--text-muted)',
                          marginTop: '3px',
                          maxWidth: '220px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }} title={lead.notes}>
                          "{lead.notes}"
                        </div>
                      )}
                    </td>

                    {/* Course */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        color: 'var(--brand-light)',
                        fontWeight: 500,
                        fontSize: '0.88rem'
                      }}>
                        {lead.course_interest}
                      </span>
                    </td>

                    {/* Contact Details */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <a
                        href={`tel:${lead.phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          fontSize: '0.85rem',
                          color: 'var(--text-primary)',
                          textDecoration: 'none'
                        }}
                        title="Click to call student"
                      >
                        <Phone size={13} style={{ color: 'var(--text-muted)' }} />
                        <span>{lead.phone}</span>
                      </a>
                      {lead.email && (
                        <div style={{ marginTop: '3px' }}>
                          <a
                            href={`mailto:${lead.email}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.78rem',
                              color: 'var(--text-muted)',
                              textDecoration: 'none'
                            }}
                            title="Click to email student"
                          >
                            <Mail size={12} />
                            <span>{lead.email}</span>
                          </a>
                        </div>
                      )}
                    </td>

                    {/* Source */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}>
                        {lead.source}
                      </span>
                    </td>

                    {/* Status */}
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <StatusBadge status={lead.status} />
                    </td>

                    {/* Assigned Counsellor */}
                    <td style={{ padding: '1rem 1.25rem' }}>
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
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#fff'
                          }}>
                            {counsellor.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 500 }}>
                              {counsellor.full_name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                              {counsellor.role}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Unassigned</span>
                      )}
                    </td>

                    {/* Created Date */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Calendar size={13} />
                        <span>{formatDate(lead.created_at)}</span>
                      </div>
                    </td>

                    {/* Action Button */}
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
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
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary Count */}
      <div style={{
        padding: '0.85rem 1.25rem',
        background: 'rgba(0,0,0,0.15)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: '#fff' }}>{leads.length}</strong> matching student enquiries
        </span>
        <span className="badge badge-converted" style={{ fontSize: '0.72rem' }}>
          Real-Time Synced
        </span>
      </div>
    </div>
  )
}
