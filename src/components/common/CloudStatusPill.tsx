import React, { useEffect, useState } from 'react'
import { checkSupabaseHealth, ConnectionHealth, isSupabaseConfigured } from '../../lib/supabaseClient'
import { Cloud, CloudOff, RefreshCw } from 'lucide-react'

interface CloudStatusPillProps {
  onInspect?: () => void
}

export const CloudStatusPill: React.FC<CloudStatusPillProps> = ({ onInspect }) => {
  const [health, setHealth] = useState<ConnectionHealth>({
    status: isSupabaseConfigured() ? 'connected' : 'unconfigured'
  })
  const [isChecking, setIsChecking] = useState(false)

  const verifyConnection = async () => {
    setIsChecking(true)
    const result = await checkSupabaseHealth()
    setHealth(result)
    setIsChecking(false)
  }

  useEffect(() => {
    verifyConnection()
  }, [])

  const isConnected = health.status === 'connected'

  return (
    <button
      type="button"
      className={`header-status-pill ${isConnected ? 'success' : 'warning'}`}
      onClick={onInspect || verifyConnection}
      title={health.message || 'Click to inspect cloud connection'}
      aria-label="Cloud Connection Status"
    >
      <span className={`beacon-dot ${isConnected ? 'success' : 'warning'}`} />
      
      {isChecking ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <RefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
          <span>Verifying...</span>
        </span>
      ) : isConnected ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Cloud size={13} />
          <span>Cloud Active ({health.latencyMs}ms)</span>
        </span>
      ) : (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CloudOff size={13} />
          <span>Offline Preview</span>
        </span>
      )}
    </button>
  )
}
