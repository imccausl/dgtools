import { convertExcelToJSON } from './util/excel/index.js'
import { BASE_URL } from './util/udisc/constants.js'
import {
  type ErrorResponse,
  type Event,
  getEvents,
  getLatestEvent,
} from './util/udisc/events.js'
import { type Query, buildQueryParams } from './util/udisc/query.js'

const EVENTS_PATH = '/events'

class EventsQuery {
  #query: Query
  #events: Promise<Event[] | ErrorResponse>

  constructor(query: Query) {
    this.#query = query
    this.#events = this.#fetchEvents()
  }

  async #fetchUrl(url: string) {
    const response = await fetch(url)
    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        message: response.statusText,
      } as const
    }
    return response
  }

  async #fetchEvents() {
    const url = this.#getUrl()
    const response = await this.#fetchUrl(url)
    if ('error' in response) {
      return response
    }
    return getEvents(await response.text())
  }

  async #fetchLeaderboard(exportUrl: string) {
    const response = await this.#fetchUrl(exportUrl)
    if ('error' in response) {
      return response
    }
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
      return {
        error: true,
        status: 404,
        message:
          "No export URL found for the latest event. Maybe it hasn't happened yet",
      } as const
    }
    const leaderboard = await this.#fetchLeaderboard(latestEvent.exportUrl)
    return {
      event: latestEvent,
      leaderboard: leaderboard,
    }
  }
}

export { EventsQuery }
