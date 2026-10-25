import React, { useState, useEffect, useCallback } from 'react'
import {
  Users,
  Shield,
  Copy,
  Check,
  Calendar,
  RotateCw,
  Search
} from 'lucide-react'
import { leadService } from '../../services/leadService'
import { Profile, UserRole } from '../../types/database.types'
import { formatDate } from '../../utils/dateUtils'

export const TeamMembersList: React.FC = () => {
  const [team, setTeam] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const loadTeam = useCallback(async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const profiles = await leadService.getStaffProfiles()
      setTeam(profiles)
    } catch (err) {
      console.error('Failed to fetch team profiles:', err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadTeam()
  }, [loadTeam])

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Administrator',
          bg: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          border: 'rgba(239, 68, 68, 0.3)'
        }
      case 'manager':
        return {
          label: 'Manager',
          bg: 'rgba(59, 130, 246, 0.15)',
          color: 'var(--brand-light)',
          border: 'rgba(59, 130, 246, 0.3)'
        }
      default:
        return {
          label: 'Counsellor',
          bg: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          border: 'rgba(16, 185, 129, 0.3)'
        }
    }
  }

  const getInitials = (name: string) => {
    if (!name) return 'ST'
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const filteredTeam = team.filter((member) =>
    member.full_name.toLowerCase().includes(search.toLowerCase()) ||
    member.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399'
            }}
          >
            <Users size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Institutional Team Directory
            </h2>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Active staff members, assigned operational roles, and lead delegation IDs
            </span>
          </div>
        </div>

        {/* Controls: Search & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Filter staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem 0.4rem 1.85rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: '#fff',
                width: '160px'
              }}
            />
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => loadTeam(true)}
            disabled={loading || isRefreshing}
            title="Refresh staff directory"
            style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
          >
            <RotateCw size={13} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '1rem 0' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '54px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.04)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : filteredTeam.length === 0 ? (
        <div
          style={{
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed rgba(255, 255, 255, 0.1)'
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: 0 }}>
            {search ? 'No staff members match your search criteria.' : 'No registered staff members found.'}
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>STAFF MEMBER</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>ROLE PRIVILEGE</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>ONBOARDED DATE</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>STAFF USER ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeam.map((member) => {
                const roleBadge = getRoleBadge(member.role)
                const isCopied = copiedId === member.id

                return (
                  <tr
                    key={member.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                  >
                    {/* Staff Name & Initials */}
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--brand-primary), #1d4ed8)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            flexShrink: 0
                          }}
                        >
                          {getInitials(member.full_name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#fff' }}>
                            {member.full_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Pill */}
                    <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          padding: '0.25rem 0.65rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: roleBadge.bg,
                          color: roleBadge.color,
                          border: `1px solid ${roleBadge.border}`
                        }}
                      >
                        <Shield size={11} />
                        <span>{roleBadge.label}</span>
                      </span>
                    </td>

                    {/* Join Date */}
                    <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--text-muted)" />
                        <span>{formatDate(member.created_at)}</span>
                      </div>
                    </td>

                    {/* User ID & Copy */}
                    <td style={{ padding: '0.85rem 0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontSize: '0.76rem',
                            color: '#94a3b8',
                            maxWidth: '180px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={member.id}
                        >
                          {member.id}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(member.id)}
                          title="Copy Staff ID"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: isCopied ? '#34d399' : 'var(--brand-light)',
                            cursor: 'pointer',
                            padding: '3px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          {isCopied ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
