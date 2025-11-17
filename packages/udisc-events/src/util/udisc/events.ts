import { load } from 'cheerio'
import { DateTime } from 'luxon'

import {
  getLeaderboardExportURL,
  getLeaderboardPageURL,
} from './leaderboard.js'

type Event = {
  name: string
  date: string | null
  day: string | null
  exportUrl: string | null
  pageUrl: string | null
}

const EVENT_LINK_SELECTOR = "a[href*='/events/']"

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
      const leaderboardExportUrl = getLeaderboardExportURL(href)
      const leaderboardPageUrl = getLeaderboardPageURL(href)

      return {
        name,
        date: date.toISODate(),
        day,
        exportUrl: leaderboardExportUrl,
        pageUrl: leaderboardPageUrl,
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
