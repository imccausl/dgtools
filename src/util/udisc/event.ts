import { load } from 'cheerio'
import { DateTime } from 'luxon'

import { BASE_URL } from '../../constants/index.js'

type Event = {
  name: string
  date: string | null
  day: string | null
  url: string | null
}

const EVENT_LINK_SELECTOR = "a[href*='/events/']"
const EXPORT_PATH = '/leaderboard/export'

function getLeaderboardExportURL(href: string | undefined) {
  if (!href) return null

  const absoluteHref = new URL(href, BASE_URL).href
  const [baseHref] = absoluteHref.split('??')
  return `${baseHref.replace(/\/$/, '')}${EXPORT_PATH}`
}

function getDay(date: DateTime) {
  const dayStrings = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  return dayStrings[date.weekday - 1] ?? null
}

function getEvents(html: string, options: { query?: string } = {}): Event[] {
  const $ = load(html)

  return $(EVENT_LINK_SELECTOR)
    .filter((_, el) =>
      $(el)
        .text()
        .includes(options.query ?? ''),
    )
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
    .toArray()
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

export { getEvents, getLatestEvent }
