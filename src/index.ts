import { load } from 'cheerio'
import { DateTime } from 'luxon'
import * as XLSX from 'xlsx'

import { UDISC_EVENTS_URL } from './constants/index.js'

type Event = {
  name: string
  date: string | null
  day: string | null
  url: string | null
}

function getLeaderboardExportURL(href: string | undefined) {
  if (!href) return null

  const absoluteHref = new URL(href, 'https://udisc.com').href
  const [baseHref] = absoluteHref.split('??')
  return `${baseHref.replace(/\/$/, '')}/leaderboard/export`
}

function getDay(date: DateTime) {
  const dayStrings = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  return dayStrings[date.weekday - 1] ?? null
}

async function fetchEvents(): Promise<Event[]> {
  const response = await fetch(UDISC_EVENTS_URL)
  const html = await response.text()
  const $ = load(html)

  return $("a[href*='/events/']")
    .filter((_, el) => $(el).text().includes('LDGA Weekend League'))
    .map((_, el) => {
      const titleBlock = $(el).find('.flex.flex-col.font-bold').first()
      const name =
        titleBlock.find('.text-subtle + div').first().text().trim() ||
        titleBlock.children().last().text().trim()
      const dateText = $(el).find('time').text().trim()
      const date = DateTime.fromFormat(dateText, 'MMM d, yyyy')
      const day = getDay(date)
      const href = $(el).attr('href')
      const url = getLeaderboardExportURL(href)

      return {
        name,
        date: date.toISODate(),
        day,
        url,
      }
    })
    .get()
}

function getLatestEvent(events: Event[]): Event | null {
  if (events.length === 0) return null

  return events.reduce((latest, event) => {
    if (!latest?.date) return event
    if (!event.date) return latest

    const eventDate = DateTime.fromISO(event.date).toMillis()
    const latestDate = DateTime.fromISO(latest.date).toMillis()
    return eventDate > latestDate ? event : latest
  }, events[0])
}

async function downloadLeaderboard(url: string | null) {
  if (!url) {
    throw new Error('Missing leaderboard export URL for latest event.')
  }

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      `Failed to download leaderboard export: ${response.status} ${response.statusText}`,
    )
  }

  const arrayBuffer = await response.arrayBuffer()
  const workbook = XLSX.read(Buffer.from(arrayBuffer), { type: 'buffer' })
  const [firstSheetName] = workbook.SheetNames

  if (!firstSheetName) {
    return []
  }

  const sheet = workbook.Sheets[firstSheetName]
  return XLSX.utils.sheet_to_json(sheet, { defval: null })
}

async function main() {
  const events = await fetchEvents()
  const latestEvent = getLatestEvent(events)

  if (!latestEvent) {
    console.log('No LDGA Weekend League events found.')
    return
  }

  const leaderboard = await downloadLeaderboard(latestEvent.url)

  console.log(
    JSON.stringify(
      {
        events,
        latestEvent,
        leaderboard,
      },
      null,
      2,
    ),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
