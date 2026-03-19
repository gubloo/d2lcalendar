import { useEffect } from 'react'
import { format } from 'date-fns'

function fmt(date, allDay) {
  if (!date) return '—'
  return allDay
    ? format(date, 'EEEE, MMMM d, yyyy')
    : format(date, 'EEE, MMM d · h:mm a')
}

export default function EventDetailModal({ event, onDelete, onClose }) {
  const isCustom = event.source === 'custom'

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleDelete() {
    if (window.confirm(`Delete "${event.title}"?`)) {
      onDelete(event.id)
    }
  }

  // Format date range nicely
  const startLabel = fmt(event.start, event.allDay)
  const endLabel   = event.end && event.end - event.start > 1000
    ? fmt(event.end, event.allDay)
    : null

  return (
    <div className="modal-backdrop" onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Event detail">
      <div className="modal-panel detail-panel">
        {/* Coloured accent bar */}
        <div
          className="detail-accent-bar"
          style={{ background: event.color || '#3b82f6' }}
        />

        <div className="modal-header">
          <div className="detail-badge-row">
            <span
              className="detail-source-badge"
              style={{
                background: `${event.color || '#3b82f6'}22`,
                color: event.color || '#3b82f6',
                border: `1px solid ${event.color || '#3b82f6'}44`,
              }}
            >
              {isCustom ? '⬡ Custom' : '◈ D2L'}
            </span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="detail-body">
          <h2 className="detail-title">{event.title}</h2>

          <div className="detail-meta">
            <div className="detail-row">
              <span className="detail-icon">📅</span>
              <div className="detail-dates">
                <span>{startLabel}</span>
                {endLabel && (
                  <span className="detail-end">→ {endLabel}</span>
                )}
              </div>
            </div>

            {event.location && (
              <div className="detail-row">
                <span className="detail-icon">📍</span>
                <span>{event.location}</span>
              </div>
            )}

            {event.description && (
              <div className="detail-row detail-desc-row">
                <span className="detail-icon">📝</span>
                <p className="detail-description">{event.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Close</button>
          {isCustom && (
            <button className="btn-danger" onClick={handleDelete}>
              Delete Event
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
