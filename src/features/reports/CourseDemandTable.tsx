import React from 'react'
import { GraduationCap, Award } from 'lucide-react'
import { CourseDemandItem } from '../../services/reportService'

export interface CourseDemandTableProps {
  courses: CourseDemandItem[]
  totalInquiries: number
  isLoading?: boolean
}

export const CourseDemandTable: React.FC<CourseDemandTableProps> = ({
  courses,
  totalInquiries,
  isLoading = false
}) => {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#c084fc'
            }}
          >
            <GraduationCap size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: '#fff' }}>
              Course Demand Breakdown
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Inquiry volume and student demand across coaching programs
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
        >
          <Award size={12} color="#fbbf24" />
          <span>{courses.length} Active Courses</span>
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ height: '42px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.05)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : courses.length === 0 || totalInquiries === 0 ? (
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
            No course demand data recorded in this timeframe.
          </p>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem', display: 'block' }}>
            Course metrics update automatically when prospective students are logged.
          </span>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>COACHING PROGRAM</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>INQUIRIES</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>ENROLLED</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'center' }}>CONV. RATE</th>
                <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>DEMAND SHARE</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const isConvertedPositive = course.conversionRate > 0

                return (
                  <tr
                    key={course.course}
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
                    {/* Course Program */}
                    <td style={{ padding: '0.8rem 0.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#fff' }}>
                        {course.course}
                      </div>
                    </td>

                    {/* Total Inquiries */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {course.totalInquiries}
                    </td>

                    {/* Enrolled Count */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: course.convertedCount > 0 ? '#34d399' : 'var(--text-muted)'
                        }}
                      >
                        {course.convertedCount}
                      </span>
                    </td>

                    {/* Conversion Rate */}
                    <td style={{ padding: '0.8rem 0.5rem', textAlign: 'center' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '9999px',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          background: isConvertedPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          color: isConvertedPositive ? '#34d399' : 'var(--text-muted)',
                          border: `1px solid ${isConvertedPositive ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.07)'}`
                        }}
                      >
                        {course.conversionRate}%
                      </span>
                    </td>

                    {/* Share Bar */}
                    <td style={{ padding: '0.8rem 0.5rem', minWidth: '130px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div
                          style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: 'rgba(255, 255, 255, 0.06)',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${course.sharePercentage}%`,
                              borderRadius: '3px',
                              background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
                              transition: 'width 0.4s ease'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', minWidth: '38px', textAlign: 'right' }}>
                          {course.sharePercentage}%
                        </span>
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
