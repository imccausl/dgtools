# @imccausl/udisc-events

Server-side helper for scraping public UDisc event listings and leaderboards. It wraps the event search page and leaderboard export into a small API.

## Requirements

- Run in a Node.js server/runtime (fetching UDisc from the browser will fail due to CORS). Node 18+ is recommended for the built-in `fetch`.

## Installation

```bash
npm i @imccausl/udisc-events
# or
yarn add @imccausl/udisc-events
# or
pnpm add @imccausl/udisc-events
```

## Quick start

```ts
import { EventsQuery } from '@imccausl/udisc-events'

const query = new EventsQuery({
  query: 'Maple Hill',
  latitude: 42.3,
  longitude: -71.8,
  searchRadius: 80,
  quickFilter: 'tournament',
})

const events = await query.events() // array of events or an error shape
const latest = await query.latestEvent()

if (latest?.exportUrl) {
  const leaderboard = await query.leaderboard(latest.exportUrl)
  console.log(latest.name, leaderboard.length)
}
```

## API

### `new EventsQuery(query)`

Creates a query against `https://udisc.com/events`.

**Query options:**

- `query`: free-text search term.
- `latitude`, `longitude`, `searchRadius`: narrow results around a location (kilometer radius).
- `quickFilter`: one of `all`, `my-events`, `trending`, `tournament`, `league`, `pdga`, `course-cleanup`, `glow`, `clinics`, `women`, `charity`.
- `type`: array of event types (`league`, `clinic`, `clean-up`, `non-dg`).
- `tag`: array of tags (`glow-round`, `ace-pool`, `charity`, `female-friendly`, `beginner-friendly`, `junior-friendly`, `bag-tags`).
- `handicapScoring`: `true` to include handicap events.
- `dates`: `past` or `custom` (absence means upcoming).
- `dateDuration`: `day` | `week` | `month` (omit when using `custom`).
- `startsOnOrBefore` / `endsOnOrAfter`: ISO date strings, required when `dates: 'custom'`.

### Methods

- `events(): Promise<Event[] | ErrorResponse>`: Parsed events or `{ error: true, status, message }` when the request fails.
- `latestEvent(): Promise<Event | null>`: Most recent event from the current result set (null on error or no events).
- `leaderboard(exportUrl): Promise<Record<string, any>[] | ErrorResponse>`: Downloads the Excel export for the given event and returns rows as JSON.
- `latestLeaderboard(): Promise<{ event: Event; leaderboard: any[] } | ErrorResponse>`: Fetches the newest event and its leaderboard in one call; returns an error object if nothing is available.

**Event shape**

```ts
{
  name: string
  date: string | null // ISO date
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | null
  exportUrl: string | null
  pageUrl: string | null
  courseName: string | null
  location: string | null
}
```

## Example server route

Use the library from a server to avoid CORS:

```ts
import express from 'express'
import { EventsQuery } from '@imccausl/udisc-events'

const app = express()

app.get('/api/udisc/latest', async (_req, res) => {
  const query = new EventsQuery({ query: 'league', quickFilter: 'league' })
  const latest = await query.latestLeaderboard()
  res.json(latest)
})

app.listen(3000)
```

## Notes

- The library scrapes public pages; be respectful of UDisc and avoid unnecessary traffic.
- Responses that fail network or CORS checks return an error object instead of throwing; check for `error` before using the data.
