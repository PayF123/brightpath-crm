/**
 * Date and relative time utilities for BrightPath CRM Follow-up Engine.
 */

/**
 * Checks whether a follow-up is overdue:
 * An item is overdue iff status is 'pending' AND due_at is before the current time.
 */
export function isFollowUpOverdue(dueAt: string, status: string): boolean {
  if (status !== 'pending') return false
  const dueDate = new Date(dueAt).getTime()
  return dueDate < Date.now()
}

/**
 * Checks if a date falls on today (in local timezone).
 */
export function isDueToday(dueAt: string): boolean {
  const date = new Date(dueAt)
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Checks if a date is in the future beyond today.
 */
export function isDueUpcoming(dueAt: string): boolean {
  const date = new Date(dueAt).getTime()
  return date > Date.now()
}

/**
 * Returns human-friendly relative time strings (e.g. "Overdue by 2 hours", "Due in 45 mins", "Due Today, 4:00 PM").
 */
export function formatFollowUpDue(dueAt: string, status: string): {
  label: string
  isOverdue: boolean
  formattedTime: string
} {
  const isOverdue = isFollowUpOverdue(dueAt, status)
  const dueDate = new Date(dueAt)
  const now = new Date()

  const formattedTime = dueDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  const formattedDate = dueDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

  if (status === 'completed') {
    return {
      label: `Completed on ${formattedDate}`,
      isOverdue: false,
      formattedTime
    }
  }

  if (status === 'cancelled') {
    return {
      label: 'Cancelled',
      isOverdue: false,
      formattedTime
    }
  }

  const diffMs = dueDate.getTime() - now.getTime()
  const diffSec = Math.floor(Math.abs(diffMs) / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHours = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (isOverdue) {
    if (diffMin < 60) {
      return {
        label: `Overdue by ${diffMin} ${diffMin === 1 ? 'min' : 'mins'}`,
        isOverdue: true,
        formattedTime
      }
    }
    if (diffHours < 24) {
      return {
        label: `Overdue by ${diffHours} ${diffHours === 1 ? 'hr' : 'hrs'}`,
        isOverdue: true,
        formattedTime
      }
    }
    return {
      label: `Overdue by ${diffDays} ${diffDays === 1 ? 'day' : 'days'}`,
      isOverdue: true,
      formattedTime
    }
  }

  // Not overdue (upcoming)
  if (isDueToday(dueAt)) {
    if (diffMin < 60) {
      return {
        label: `Due in ${diffMin} ${diffMin === 1 ? 'min' : 'mins'} (Today, ${formattedTime})`,
        isOverdue: false,
        formattedTime
      }
    }
    return {
      label: `Due Today at ${formattedTime}`,
      isOverdue: false,
      formattedTime
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const isTomorrow =
    dueDate.getDate() === tomorrow.getDate() &&
    dueDate.getMonth() === tomorrow.getMonth() &&
    dueDate.getFullYear() === tomorrow.getFullYear()

  if (isTomorrow) {
    return {
      label: `Due Tomorrow at ${formattedTime}`,
      isOverdue: false,
      formattedTime
    }
  }

  return {
    label: `Due ${formattedDate} at ${formattedTime}`,
    isOverdue: false,
    formattedTime
  }
}

/**
 * Formats a Date object to input datetime-local string (YYYY-MM-DDTHH:mm).
 */
export function toDateTimeLocalString(date: Date): string {
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Returns a default due date: 2 hours from now rounded to nearest 15 mins.
 */
export function getDefaultDueDateTime(): string {
  const d = new Date(Date.now() + 2 * 60 * 60 * 1000)
  const minutes = d.getMinutes()
  const roundedMinutes = Math.ceil(minutes / 15) * 15
  d.setMinutes(roundedMinutes)
  d.setSeconds(0)
  d.setMilliseconds(0)
  return toDateTimeLocalString(d)
}

/**
 * Formats an ISO date string into a clean relative time (e.g. "Just now", "5m ago", "2h ago", "3d ago").
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  if (diffMs < 0) {
    const absDiff = Math.abs(diffMs)
    const mins = Math.floor(absDiff / (1000 * 60))
    if (mins < 60) return `in ${mins}m`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `in ${hours}h`
    const days = Math.floor(hours / 24)
    return `in ${days}d`
  }

  const diffSec = Math.floor(diffMs / 1000)
  if (diffSec < 45) return 'Just now'

  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin}m ago`

  const diffHours = Math.floor(diffMin / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Formats an ISO date string into a standard display date (e.g. "Oct 25, 2026").
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
