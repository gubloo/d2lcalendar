import ICAL from 'ical.js'
import { D2L_COLOR } from '../config'

/**
 * Fetch the iCal feed via the CORS proxy and return FullCalendar-compatible events.
 * @param {string} proxyUrl — your Cloudflare Worker URL
 */
export async function fetchAndParseICal(proxyUrl) {
  if (!proxyUrl || proxyUrl.includes('YOUR-WORKER')) {
    console.warn('[icalParser] ICAL_PROXY_URL not configured — skipping D2L fetch.')
    return []
  }

  const response = await fetch(proxyUrl, { cache: 'no-cache' })
  if (!response.ok) throw new Error(`Proxy returned HTTP ${response.status}`)
  const text = await response.text()
  return parseICalText(text)
}

/**
 * Parse raw .ics text into FullCalendar event objects.
 */
export function parseICalText(icsText) {
  let jcal
  try {
    jcal = ICAL.parse(icsText)
  } catch (e) {
    console.error('[icalParser] Failed to parse iCal:', e)
    return []
  }

  const comp    = new ICAL.Component(jcal)
  const vevents = comp.getAllSubcomponents('vevent')

  return vevents.map(vevent => {
    try {
      const ev = new ICAL.Event(vevent)

      const allDay = ev.startDate?.isDate ?? false
      const start  = ev.startDate?.toJSDate()
      const end    = ev.endDate?.toJSDate() ?? start

      if (!start) return null

      return {
        id:              `ical-${ev.uid || Math.random().toString(36)}`,
        title:           ev.summary   || 'Untitled',
        start,
        end,
        allDay,
        backgroundColor: D2L_COLOR,
        borderColor:     D2L_COLOR,
        textColor:       '#ffffff',
        extendedProps: {
          source:      'ical',
          description: ev.description ?? '',
          location:    ev.location    ?? '',
          uid:         ev.uid         ?? '',
        },
      }
    } catch {
      return null
    }
  }).filter(Boolean)
}
