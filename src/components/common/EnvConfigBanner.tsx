import React, { useState } from 'react'
import { getSupabaseEnvDiagnostics, isSupabaseConfigured } from '../../lib/supabaseClient'
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  X,
  Server,
  Cloud
} from 'lucide-react'

interface EnvConfigBannerProps {
  onDismiss?: () => void
}

export const EnvConfigBanner: React.FC<EnvConfigBannerProps> = ({ onDismiss }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedLocal, setCopiedLocal] = useState(false)
  const [activeTab, setActiveTab] = useState<'local' | 'vercel'>('local')
  const [isDismissed, setIsDismissed] = useState(false)

  const diagnostics = getSupabaseEnvDiagnostics()
  const configured = isSupabaseConfigured()

  if (isDismissed || configured) {
    return null
  }

  const envSnippet = `# BrightPath CRM — Environment Configuration
# Copy this into .env at the root of your project:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-client-anon-key`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(envSnippet)
      setCopiedLocal(true)
      setTimeout(() => setCopiedLocal(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) onDismiss()
  }

  return (
    <div className="sentinel-banner" role="alert" aria-live="polite">
      <div className="sentinel-header-row">
        <div className="sentinel-left-content">
          <span className="beacon-dot warning" aria-hidden="true" />
          <div>
            <div className="sentinel-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Supabase Cloud Database Disconnected</span>
              <span className="badge badge-pending" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                Offline Preview
              </span>
            </div>
            <div className="sentinel-subtitle">
              CRM running with static shell data. Connect your Supabase project credentials to enable live PostgreSQL persistence.
            </div>
          </div>
        </div>

        <div className="sentinel-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Hide Setup Guide' : 'How to Connect'}</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            style={{
              padding: '0.4rem',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.15s ease'
            }}
            title="Dismiss until next session"
            aria-label="Dismiss banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Accordion Expandable Setup Guide */}
      {isExpanded && (
        <div className="sentinel-drawer">
          {/* Live Validation Diagnostics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>VITE_SUPABASE_URL</span>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: diagnostics.urlValid ? 'var(--status-converted)' : 'var(--status-overdue)'
              }}>
                {diagnostics.urlValid ? '✓ Valid HTTPS URL' : diagnostics.urlProvided ? '⚠ Default Placeholder' : '✗ Missing'}
              </span>
            </div>

            <div style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>VITE_SUPABASE_ANON_KEY</span>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: diagnostics.keyValid ? 'var(--status-converted)' : 'var(--status-overdue)'
              }}>
                {diagnostics.keyValid ? '✓ Valid Public Key' : diagnostics.keyProvided ? '⚠ Default Placeholder' : '✗ Missing'}
              </span>
            </div>
          </div>

          {/* Setup Guide Tabs */}
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setActiveTab('local')}
                className={`btn ${activeTab === 'local' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
              >
                <Server size={14} />
                <span>1. Local Setup (.env)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('vercel')}
                className={`btn ${activeTab === 'vercel' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
              >
                <Cloud size={14} />
                <span>2. Vercel Cloud Setup</span>
              </button>
            </div>

            {activeTab === 'local' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  In your project root, create a file named <code style={{ color: 'var(--brand-light)' }}>.env</code> and paste your project API credentials retrieved from your Supabase dashboard:
                </p>

                <div className="code-box">
                  <button
                    type="button"
                    className={`code-box-copy-btn ${copiedLocal ? 'copied' : ''}`}
                    onClick={handleCopy}
                  >
                    {copiedLocal ? (
                      <>
                        <Check size={13} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy .env</span>
                      </>
                    )}
                  </button>
                  <pre style={{ margin: 0, paddingRight: '90px' }}>{envSnippet}</pre>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  To enable database connectivity on your deployed Vercel site:
                </p>
                <ol style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <li>Go to your project on <strong style={{ color: '#fff' }}>Vercel</strong> &gt; <strong style={{ color: '#fff' }}>Settings</strong> &gt; <strong style={{ color: '#fff' }}>Environment Variables</strong>.</li>
                  <li>Add <code style={{ color: 'var(--brand-light)' }}>VITE_SUPABASE_URL</code> and paste your project URL.</li>
                  <li>Add <code style={{ color: 'var(--brand-light)' }}>VITE_SUPABASE_ANON_KEY</code> and paste your public anon client key.</li>
                  <li>Trigger a redeployment from the Vercel Deployments tab.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Security & Dashboard Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} style={{ color: 'var(--status-converted)' }} />
              <span>Public anon key is safe for browser client. Never paste service-role keys here.</span>
            </div>

            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                color: 'var(--brand-light)',
                fontWeight: 600
              }}
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
