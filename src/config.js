// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
//
// ICAL_PROXY_URL: Your Cloudflare Worker URL that proxies the D2L iCal feed.
//
// How to set this up (free, ~5 min):
//   1. Go to https://dash.cloudflare.com → Workers & Pages → Create Worker
//   2. Replace the default code with the contents of cloudflare-worker/worker.js
//   3. Click "Save and Deploy" — copy the *.workers.dev URL shown
//   4. Paste that URL below (no trailing slash)
//
// Until you do this, D2L events won't load (the app still works for custom events).
// ─────────────────────────────────────────────────────────────────────────────

export const ICAL_PROXY_URL = 'https://YOUR-WORKER.workers.dev'

// ─────────────────────────────────────────────────────────────────────────────
// EVENT COLORS
// ─────────────────────────────────────────────────────────────────────────────
export const D2L_COLOR   = '#3b82f6'  // blue  — D2L / iCal events
export const CUSTOM_COLORS = [
  { label: 'Violet',   value: '#8b5cf6' },
  { label: 'Rose',     value: '#f43f5e' },
  { label: 'Emerald',  value: '#10b981' },
  { label: 'Amber',    value: '#f59e0b' },
  { label: 'Cyan',     value: '#06b6d4' },
  { label: 'Pink',     value: '#ec4899' },
]
