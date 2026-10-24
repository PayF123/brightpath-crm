import React from 'react'

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  style?: React.CSSProperties
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = 'var(--radius-sm)',
  style
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s infinite ease-in-out',
        ...style
      }}
    />
  )
}

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <td style={{ padding: '1.1rem 1.25rem' }}>
            <Skeleton width="140px" height="1.1rem" style={{ marginBottom: '0.4rem' }} />
            <Skeleton width="90px" height="0.75rem" />
          </td>
          <td style={{ padding: '1.1rem 1.25rem' }}>
            <Skeleton width="160px" height="1rem" />
          </td>
          <td style={{ padding: '1.1rem 1.25rem' }}>
            <Skeleton width="120px" height="0.9rem" style={{ marginBottom: '0.4rem' }} />
            <Skeleton width="140px" height="0.75rem" />
          </td>
          <td style={{ padding: '1.1rem 1.25rem' }}>
            <Skeleton width="80px" height="0.85rem" />
          </td>
          <td style={{ padding: '1.1rem 1.25rem' }}>
            <Skeleton width="85px" height="1.4rem" borderRadius="var(--radius-full)" />
          </td>
          <td style={{ padding: '1.1rem 1.25rem' }}>
            <Skeleton width="110px" height="1.2rem" borderRadius="var(--radius-sm)" />
          </td>
          <td style={{ padding: '1.1rem 1.25rem' }}>
            <Skeleton width="75px" height="1.8rem" borderRadius="var(--radius-md)" />
          </td>
        </tr>
      ))}
    </>
  )
}

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="card"
          style={{
            padding: '1.15rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Skeleton width="130px" height="1.1rem" />
            <Skeleton width="75px" height="1.3rem" borderRadius="var(--radius-full)" />
          </div>
          <Skeleton width="180px" height="0.9rem" />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Skeleton width="100px" height="0.85rem" />
            <Skeleton width="100px" height="0.85rem" />
          </div>
        </div>
      ))}
    </div>
  )
}
