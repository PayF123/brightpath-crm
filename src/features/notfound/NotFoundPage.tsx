import React from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, Home } from 'lucide-react'

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        padding: '1rem',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(244, 63, 94, 0.15)',
        color: 'var(--status-overdue)',
        marginBottom: '1rem'
      }}>
        <AlertTriangle size={36} />
      </div>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#fff' }}>
        404 — Page Not Found
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: '1.75rem' }}>
        The requested CRM view does not exist or may have been moved.
      </p>

      <Link to="/" className="btn btn-primary">
        <Home size={16} />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  )
}
