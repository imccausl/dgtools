import { convertExcelToJSON } from './util/excel/index.js'
import { BASE_URL } from './util/udisc/constants.js'
import { getEvents, getLatestEvent } from './util/udisc/events.js'
import { type Query, buildQueryParams } from './util/udisc/query.js'

const EVENTS_PATH = '/events'

class EventsQuery {
  #query: Query
  #events: Promise<ReturnType<typeof getEvents>>

  constructor(query: Query) {
    this.#query = query
    this.#events = this.#fetchEvents()
  }

  async #fetchUrl(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch UDisc events: ${response.status} ${response.statusText}`,
      )
    }
    return response
  }

  async #fetchEvents() {
    const url = this.#getUrl()
    const response = await this.#fetchUrl(url)
    return getEvents(await response.text())
  }

  async #fetchLeaderboard(exportUrl: string) {
    const response = await this.#fetchUrl(exportUrl)
    const arrayBuffer = await response.arrayBuffer()
    return convertExcelToJSON(arrayBuffer)
  }

  #getUrl() {
    const queryParams = buildQueryParams(this.#query)
    return `${BASE_URL}${EVENTS_PATH}?${queryParams}`
  }

  async events() {
    return this.#events
  }

  async latestEvent() {
    const events = await this.#events
    return getLatestEvent(events)
  }

  async leaderboard(url: string) {
    return this.#fetchLeaderboard(url)
  }

  async latestLeaderboard() {
    const latestEvent = await this.latestEvent()
    if (!latestEvent?.exportUrl) {
      throw new Error('No latest event or leaderboard URL found.')
    }
    const leaderboard = await this.#fetchLeaderboard(latestEvent.exportUrl)
    return {
      event: latestEvent,
      leaderboard: leaderboard,
    }
  }
}

export { EventsQuery }
