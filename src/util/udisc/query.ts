import { BASE_URL, EVENTS_PATH } from '../../constants/index.js'
import { convertExcelToJSON } from '../excel/index.js'
import { buildQueryParams } from '../query.js'

import { getEvents, getLatestEvent } from './event.js'

import type { Query } from '../../constants/query.js'

class UDiscEventsQuery {
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
    if (!latestEvent?.url) {
      throw new Error('No latest event or leaderboard URL found.')
    }
    return this.#fetchLeaderboard(latestEvent.url)
  }
}

export { UDiscEventsQuery }
