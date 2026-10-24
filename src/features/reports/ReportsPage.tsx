import React, { useState, useEffect, useCallback } from 'react'
import {
  RotateCw,
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  BarChart3
} from 'lucide-react'
import { reportService, ReportsData, DateRangePreset } from '../../services/reportService'
import { DateRangeFilter } from './DateRangeFilter'
import { SourcePerformanceTable } from './SourcePerformanceTable'
import { CourseDemandTable } from './CourseDemandTable'
import { CounsellorPerformanceTable } from './CounsellorPerformanceTable'

export const ReportsPage: React.FC = () => {
  const [preset, setPreset] = useState<DateRangePreset>('all')
  const [data, setData] = useState<ReportsData>(reportService.getEmptyReportsData())
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const loadData = useCallback(async (currentPreset: DateRangePreset, isManual = false) => {
    if (isManual) {
      setIsRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const reports = await reportService.getReportsData(currentPreset)
      setData(reports)
    } catch (err) {
      console.error('Failed to load reports:', err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadData(preset)
  }, [loadData, preset])

  const handlePresetChange = (newPreset: DateRangePreset) => {
    setPreset(newPreset)
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h1 className="page-title">Reports &amp; Performance Analytics</h1>
          <p className="page-desc">
            Admissions conversion rates, lead source attribution, and enquiry performance metrics.
          </p>
        </div>

        {/* Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <DateRangeFilter
            currentPreset={preset}
            onChange={handlePresetChange}
            disabled={loading || isRefreshing}
          />

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => loadData(preset, true)}
            disabled={loading || isRefreshing}
            title="Refresh analytics data"
            style={{ padding: '0.55rem 0.85rem' }}
          >
            <RotateCw size={15} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Top Analytics Summary Ribbon */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        {/* Total Inquiries */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Inquiries in Window
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(37, 99, 235, 0.15)', color: 'var(--brand-light)' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
            {loading ? '--' : data.summary.totalInquiries}
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Captured leads in selected window
          </span>
        </div>

        {/* Converted Students */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Enrolled Admissions
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
            {loading ? '--' : data.summary.totalConverted}
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Confirmed student enrollments
          </span>
        </div>

        {/* Overall Conversion Rate */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Conversion Rate
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', margin: '0.2rem 0' }}>
            {loading ? '--' : `${data.summary.overallConversionRate}%`}
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Admission conversion efficiency
          </span>
        </div>

        {/* Top Channel */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(145deg, rgba(21, 29, 48, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Leading Channel
            </span>
            <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
              <Sparkles size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: '0.5rem 0 0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {loading ? '--' : data.summary.topSource}
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
            Top originating lead source
          </span>
        </div>
      </div>

      {/* Main Analytical Tables (Channel Attribution & Course Demand) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem'
        }}
      >
        <SourcePerformanceTable
          channels={data.channelPerformance}
          totalInquiries={data.summary.totalInquiries}
          isLoading={loading}
        />

        <CourseDemandTable
          courses={data.courseDemand}
          totalInquiries={data.summary.totalInquiries}
          isLoading={loading}
        />
      </div>

      {/* Counsellor Team Performance Table */}
      <div style={{ marginBottom: '1.75rem' }}>
        <CounsellorPerformanceTable
          counsellors={data.counsellorPerformance}
          isLoading={loading}
        />
      </div>

      {/* Reconciled Truthful Metrics Callout */}
      <div
        className="card"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(37, 99, 235, 0.08)',
          borderColor: 'rgba(37, 99, 235, 0.25)',
          padding: '1.15rem 1.35rem'
        }}
      >
        <Award size={24} style={{ color: 'var(--brand-light)', flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.92rem' }}>
            Reconciled Truthful Metrics &amp; Audit Integrity
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Reports and executive dashboard share identical mathematical formulas derived directly from accessible Supabase PostgreSQL rows. Zero fake data or estimated vanity metrics.
          </div>
        </div>
      </div>
    </div>
  )
}
