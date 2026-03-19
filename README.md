# Scholaris — D2L Calendar

A modern calendar web app that merges your D2L iCal feed with custom events into one unified, dark-themed view.

---

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Setup (2 steps)

### Step 1 — Deploy the CORS Proxy (Cloudflare Worker)

Your D2L iCal URL can't be fetched directly from the browser due to CORS restrictions. A tiny Cloudflare Worker fixes this for free.

1. Go to https://dash.cloudflare.com and sign up (free)
2. **Workers & Pages → Create Worker**
3. Replace the default code with the contents of `cloudflare-worker/worker.js`
   - The D2L URL is already filled in
4. Click **Save and Deploy**
5. Copy the `*.workers.dev` URL shown at the top

### Step 2 — Configure the App

Open `src/config.js` and paste your Worker URL:

```js
export const ICAL_PROXY_URL = 'https://your-worker-name.workers.dev'
```

That's it — D2L events will now load.

---

## Deployment (Free)

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or: connect your GitHub repo at https://vercel.com/new

### Netlify

```bash
npm run build
# Drag the `dist/` folder to https://app.netlify.com/drop
```

### Cloudflare Pages

```bash
npm run build
# Upload `dist/` in Cloudflare Pages dashboard
```

---

## Adding a Backend

Custom events are stored in `localStorage` right now. To swap in a real backend:

1. Search for `// TODO: BACKEND` in `src/utils/eventStore.js`
2. Replace each function body with a `fetch()` call to your API:

```js
// GET /api/events
export async function getCustomEvents() {
  const res = await fetch('/api/events')
  return res.json()
}

// POST /api/events
export async function saveCustomEvent(data) {
  const res = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.json()
}

// DELETE /api/events/:id
export async function deleteCustomEvent(id) {
  await fetch(`/api/events/${id}`, { method: 'DELETE' })
}
```

---

## Project Structure

```
src/
  config.js              ← Set your ICAL_PROXY_URL here
  App.jsx                ← Root component & state
  index.css              ← Dark glassmorphism theme
  components/
    CalendarView.jsx     ← FullCalendar wrapper (month/week/agenda)
    AddEventModal.jsx    ← Create custom events
    EventDetailModal.jsx ← View event details, delete custom events
  utils/
    icalParser.js        ← Fetch & parse the .ics feed
    eventStore.js        ← localStorage CRUD (swap with API later)
cloudflare-worker/
  worker.js              ← CORS proxy — deploy to Cloudflare Workers
```

---

## Tech Stack

| Layer        | Tool                        |
|--------------|-----------------------------|
| Framework    | React 18 + Vite             |
| Calendar     | FullCalendar 6              |
| iCal parsing | ical.js                     |
| Styling      | Tailwind CSS + custom CSS   |
| Storage      | localStorage (stub)         |
| CORS proxy   | Cloudflare Workers (free)   |
| Hosting      | Vercel / Netlify (free)     |
