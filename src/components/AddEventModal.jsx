import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { CUSTOM_COLORS } from '../config'

const toDatetimeLocal = (date) =>
  date ? format(date, "yyyy-MM-dd'T'HH:mm") : ''

const toDateLocal = (date) =>
  date ? format(date, 'yyyy-MM-dd') : ''

export default function AddEventModal({ defaultDate, onSave, onClose }) {
  const firstInput = useRef(null)

  const [title,       setTitle]       = useState('')
  const [allDay,      setAllDay]      = useState(false)
  const [startStr,    setStartStr]    = useState('')
  const [endStr,      setEndStr]      = useState('')
  const [description, setDescription] = useState('')
  const [color,       setColor]       = useState(CUSTOM_COLORS[0].value)
  const [error,       setError]       = useState('')

  // Pre-fill date from calendar click
  useEffect(() => {
    if (defaultDate) {
      const d = new Date(defaultDate)
      d.setHours(9, 0, 0, 0)
      const e = new Date(d)
      e.setHours(10, 0, 0, 0)
      setStartStr(toDatetimeLocal(d))
      setEndStr(toDatetimeLocal(e))
    } else {
      const now = new Date()
      now.setMinutes(0, 0, 0)
      const later = new Date(now)
      later.setHours(later.getHours() + 1)
      setStartStr(toDatetimeLocal(now))
      setEndStr(toDatetimeLocal(later))
    }
    firstInput.current?.focus()
  }, [defaultDate])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!title.trim()) { setError('Title is required.'); return }
    if (!startStr)     { setError('Start date is required.'); return }

    const start = new Date(allDay ? startStr + 'T00:00:00' : startStr)
    const end   = endStr
      ? new Date(allDay ? endStr + 'T00:00:00' : endStr)
      : new Date(start.getTime() + 60 * 60 * 1000)

    if (end < start) { setError('End must be after start.'); return }

    onSave({ title, start, end, allDay, description, color })
  }

  // Close on backdrop click
  function handleBackdrop(e) {
    if (e.target === e.currentTarget) onClose()
  }

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-backdrop" onClick={handleBackdrop} role="dialog" aria-modal="true" aria-label="Add event">
      <div className="modal-panel">
        <div className="modal-header">
          <h2 className="modal-title">New Event</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Title */}
          <div className="field">
            <label className="field-label">Title <span className="required">*</span></label>
            <input
              ref={firstInput}
              className="field-input"
              type="text"
              placeholder="e.g. Study session, Lab due…"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={120}
            />
          </div>

          {/* All-day toggle */}
          <div className="field field-row">
            <label className="field-label toggle-label">
              <span>All day</span>
              <button
                type="button"
                role="switch"
                aria-checked={allDay}
                className={`toggle ${allDay ? 'toggle-on' : ''}`}
                onClick={() => setAllDay(v => !v)}
              >
                <span className="toggle-thumb" />
              </button>
            </label>
          </div>

          {/* Start */}
          <div className="field">
            <label className="field-label">Start</label>
            {allDay ? (
              <input
                className="field-input"
                type="date"
                value={startStr.slice(0, 10)}
                onChange={e => setStartStr(e.target.value)}
              />
            ) : (
              <input
                className="field-input"
                type="datetime-local"
                value={startStr}
                onChange={e => {
                  setStartStr(e.target.value)
                  // Auto-advance end by 1h
                  if (!endStr || new Date(endStr) <= new Date(e.target.value)) {
                    const d = new Date(e.target.value)
                    d.setHours(d.getHours() + 1)
                    setEndStr(toDatetimeLocal(d))
                  }
                }}
              />
            )}
          </div>

          {/* End */}
          <div className="field">
            <label className="field-label">End</label>
            {allDay ? (
              <input
                className="field-input"
                type="date"
                value={endStr.slice(0, 10)}
                onChange={e => setEndStr(e.target.value)}
              />
            ) : (
              <input
                className="field-input"
                type="datetime-local"
                value={endStr}
                onChange={e => setEndStr(e.target.value)}
              />
            )}
          </div>

          {/* Description */}
          <div className="field">
            <label className="field-label">Notes <span className="optional">(optional)</span></label>
            <textarea
              className="field-input field-textarea"
              placeholder="Any extra details…"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Color picker */}
          <div className="field">
            <label className="field-label">Color</label>
            <div className="color-picker">
              {CUSTOM_COLORS.map(c => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  className={`color-swatch ${color === c.value ? 'color-swatch-active' : ''}`}
                  style={{ background: c.value }}
                  onClick={() => setColor(c.value)}
                  aria-pressed={color === c.value}
                  aria-label={c.label}
                />
              ))}
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary-modal" style={{ background: color }}>
              Save Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
