import React from 'react'
import { SearchX, Inbox, RefreshCw, Plus } from 'lucide-react'

interface EmptyStateProps {
  type?: 'no-results' | 'no-data'
  title?: string
  description?: string
  onAction?: () => void
  actionLabel?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'no-results',
  title,
  description,
  onAction,
  actionLabel
}) => {
  const isSearchEmpty = type === 'no-results'

  const defaultTitle = isSearchEmpty
    ? 'No Matching Student Enquiries'
    : 'No Leads Registered Yet'

  const defaultDescription = isSearchEmpty
    ? 'No student leads match your current search criteria or filter selections. Try clearing your filters.'
    : 'Capture your first student consultation enquiry to start tracking admissions and follow-ups.'

  return (
    <div
      style={{
        padding: '4rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--text-muted)',
          marginBottom: '1rem'
        }}
      >
        {isSearchEmpty ? <SearchX size={26} /> : <Inbox size={26} />}
      </div>

      <h3
        style={{
          fontSize: '1.15rem',
          fontWeight: 600,
          color: '#fff',
          marginBottom: '0.4rem'
        }}
      >
        {title || defaultTitle}
      </h3>

      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.88rem',
          maxWidth: '420px',
          lineHeight: 1.5,
          marginBottom: onAction ? '1.5rem' : '0'
        }}
      >
        {description || defaultDescription}
      </p>

      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className={`btn ${isSearchEmpty ? 'btn-secondary' : 'btn-primary'}`}
          style={{ padding: '0.6rem 1.25rem', fontSize: '0.88rem' }}
        >
          {isSearchEmpty ? (
            <>
              <RefreshCw size={15} />
              <span>{actionLabel || 'Reset All Filters'}</span>
            </>
          ) : (
            <>
              <Plus size={15} />
              <span>{actionLabel || 'Add First Lead'}</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}
