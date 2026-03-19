// ─────────────────────────────────────────────────────────────────────────────
// EVENT STORE  (localStorage stub — replace with API calls when you add a backend)
// ─────────────────────────────────────────────────────────────────────────────
//
// Each function has a TODO comment showing the equivalent REST call.
// Search for "TODO: BACKEND" to find every swap point.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'scholaris-custom-events'

/** Retrieve all custom events. */
export function getCustomEvents() {
  // TODO: BACKEND → GET /api/events
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Save a new custom event and return the stored version (with generated id).
 * @param {{ title, start, end, allDay, description, color }} data
 */
export function saveCustomEvent(data) {
  // TODO: BACKEND → POST /api/events  body: data
  const events   = getCustomEvents()
  const newEvent = {
    ...buildFCEvent(data),
    id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  }
  events.push(newEvent)
  _persist(events)
  return newEvent
}

/**
 * Update an existing custom event in place.
 * @param {string} id
 * @param {{ title, start, end, allDay, description, color }} data
 */
export function updateCustomEvent(id, data) {
  // TODO: BACKEND → PUT /api/events/:id  body: data
  const events = getCustomEvents().map(e =>
    e.id === id ? { ...buildFCEvent(data), id } : e
  )
  _persist(events)
  return events.find(e => e.id === id)
}

/**
 * Delete a custom event by id.
 * @param {string} id
 */
export function deleteCustomEvent(id) {
  // TODO: BACKEND → DELETE /api/events/:id
  _persist(getCustomEvents().filter(e => e.id !== id))
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildFCEvent({ title, start, end, allDay, description, color }) {
  return {
    title:           title.trim(),
    start,
    end:             end || start,
    allDay:          allDay ?? false,
    backgroundColor: color,
    borderColor:     color,
    textColor:       '#ffffff',
    extendedProps: {
      source:      'custom',
      description: description?.trim() ?? '',
      color,
    },
  }
}

function _persist(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
  } catch (e) {
    console.error('[eventStore] localStorage write failed:', e)
  }
}
