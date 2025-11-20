import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'

const BASE_URL = ''
const html = ''

const server = setupServer(
  http.get(`${BASE_URL}/events`, () => HttpResponse.text(html)),
)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export { server, http, HttpResponse }
