import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'

import { BASE_URL } from '../../src/util/udisc/constants.js'

const html = `
      <a href="/events/1">
        <div class="flex flex-col font-bold">
          <div class="text-subtle">Event 1</div>
          <div>Details</div>
        </div>
        <time>Jan 1, 2023</time>
      </a>
      <a href="/events/2">
        <div class="flex flex-col font-bold">
          <div class="text-subtle">Event 2</div>
          <div>Details</div>
        </div>
        <time>Feb 15, 2023</time>
      </a>
    `

const server = setupServer(
  http.get(`${BASE_URL}/events`, () => HttpResponse.text(html)),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export { server, http, HttpResponse }
