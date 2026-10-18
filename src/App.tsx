import { useState } from 'react'
import './App.css'

export default function App() {
  const [ready] = useState(true)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#f8fafc',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        maxWidth: '640px',
        padding: '2.5rem',
        borderRadius: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          display: 'inline-flex',
          padding: '0.5rem 1rem',
          borderRadius: '9999px',
          background: 'rgba(37, 99, 235, 0.2)',
          border: '1px solid rgba(37, 99, 235, 0.4)',
          color: '#60a5fa',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          Phase 0 • Baseline Verified
        </div>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          fontFamily: 'Outfit, sans-serif',
          marginBottom: '1rem',
          letterSpacing: '-0.025em'
        }}>
          BrightPath CRM
        </h1>
        <p style={{
          fontSize: '1.125rem',
          color: '#94a3b8',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          Enquiry-to-Admission Management System for Coaching Institutes.
          TypeScript, React 19, and Vite environment successfully initialized.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          textAlign: 'left'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Framework</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#38bdf8' }}>React 19 + Vite</div>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Language</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#38bdf8' }}>TypeScript 5+</div>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: '#4ade80' }}>
              {ready ? 'Ready for Phase 1' : 'Initializing'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
