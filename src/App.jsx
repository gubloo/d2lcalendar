import { useState, useEffect, useCallback } from 'react'
import CalendarView from './components/CalendarView'
import AddEventModal from './components/AddEventModal'
import EventDetailModal from './components/EventDetailModal'
import { fetchAndParseICal } from './utils/icalParser'
import { getCustomEvents, saveCustomEvent, deleteCustomEvent } from './utils/eventStore'
import { ICAL_PROXY_URL } from './config'

export default function App() {
  const [icalEvents,   setIcalEvents]   = useState([])
  const [customEvents, setCustomEvents] = useState([])
  const [isAddOpen,    setIsAddOpen]    = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [defaultDate,  setDefaultDate]  = useState(null)
  const [syncStatus,   setSyncStatus]   = useState('idle') // idle | loading | error | ok
  const [syncMsg,      setSyncMsg]      = useState('')

  // ── load D2L iCal ──────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      setSyncStatus('loading')
      try {
        const events = await fetchAndParseICal(ICAL_PROXY_URL)
        setIcalEvents(events)
        setSyncStatus('ok')
        setSyncMsg(`${events.length} D2L events loaded`)
        setTimeout(() => setSyncStatus('idle'), 3000)
      } catch (err) {
        console.error(err)
        setSyncStatus('error')
        setSyncMsg('Could not load D2L calendar — check your proxy URL')
      }
    }
    load()
  }, [])

  // ── load saved custom events ───────────────────────────────────────────────
  useEffect(() => {
    setCustomEvents(getCustomEvents())
  }, [])

  // ── handlers ───────────────────────────────────────────────────────────────
  const openAddModal = useCallback((date = null) => {
    setDefaultDate(date)
    setIsAddOpen(true)
  }, [])

  const handleSave = useCallback((data) => {
    const ev = saveCustomEvent(data)
    setCustomEvents(prev => [...prev, ev])
    setIsAddOpen(false)
  }, [])

  const handleDelete = useCallback((id) => {
    deleteCustomEvent(id)
    setCustomEvents(prev => prev.filter(e => e.id !== id))
    setSelectedEvent(null)
  }, [])

  const allEvents = [...icalEvents, ...customEvents]

  return (
    <div className="app-root">
      {/* ── animated mesh background ── */}
      <div className="bg-mesh" aria-hidden="true" />

      {/* ── header ── */}
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-glyph">◈</span>
          <span className="brand-name">Scholaris</span>
        </div>

        <div className="header-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#3b82f6' }} />
            D2L
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#8b5cf6' }} />
            Custom
          </span>
        </div>

        <div className="header-actions">
          {syncStatus === 'loading' && (
            <span className="sync-badge loading">
              <span className="spin-dot" /> Syncing D2L…
            </span>
          )}
          {syncStatus === 'ok' && (
            <span className="sync-badge ok">✓ {syncMsg}</span>
          )}
          {syncStatus === 'error' && (
            <span className="sync-badge error" title={syncMsg}>⚠ D2L sync failed</span>
          )}
          <button className="btn-add" onClick={() => openAddModal()}>
            <span className="btn-plus">+</span>
            <span className="btn-label">Add Event</span>
          </button>
        </div>
      </header>

      {/* ── calendar ── */}
      <main className="app-main">
        <CalendarView
          events={allEvents}
          onEventClick={setSelectedEvent}
          onDateClick={openAddModal}
        />
      </main>

      {/* ── modals ── */}
      {isAddOpen && (
        <AddEventModal
          defaultDate={defaultDate}
          onSave={handleSave}
          onClose={() => setIsAddOpen(false)}
        />
      )}
      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onDelete={handleDelete}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}
