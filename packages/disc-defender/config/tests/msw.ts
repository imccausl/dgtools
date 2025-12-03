import { HttpResponse, http } from 'msw'
import { setupServer } from 'msw/node'

import { BASE_URL } from '../../src/constants.js'
import {
  mockAccountData,
  mockAccountDetailsResponse,
  mockDiscData,
} from '../../src/mockData.js'

const handlers = [
  http.get(`${BASE_URL}/account`, () => {
    return HttpResponse.json(mockAccountData)
  }),

  http.get(`${BASE_URL}/account/:id`, ({ params }) => {
    const accountId = params.id as string
    const account = mockAccountData.find(
      (acc) => String(acc.id) === String(accountId),
    )
    if (!account) {
      return HttpResponse.json(
        { message: 'Account not found' },
        { status: 404 },
      )
    }
    return HttpResponse.json({
      ...mockAccountDetailsResponse,
      id: account.id,
      accountName: account.accountName,
      accountPath: account.accountPath,
    })
  }),

  http.get(`${BASE_URL}/disc/:accountId`, ({ params }) => {
    const accountId = params.accountId as string
    const discs = mockDiscData.filter(
      (disc) => String(disc.accountId) === String(accountId),
    )
    return HttpResponse.json(discs)
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export { server, http, HttpResponse, handlers }
