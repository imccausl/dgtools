import { describe, expect, it } from 'vitest'

import { fetchAccountDetails, fetchAccounts, fetchDiscsDetails } from './api.js'
import { mockAccountData, mockDiscData } from './mockData.js'

describe('api', () => {
  it('fetches accounts', async () => {
    const accounts = await fetchAccounts()
    expect(accounts).toHaveLength(mockAccountData.length)
    expect(accounts[0]).toMatchObject({
      id: mockAccountData[0].id,
      accountName: mockAccountData[0].accountName,
    })
  })

  it('fetches account details', async () => {
    const details = await fetchAccountDetails(String(mockAccountData[0].id))
    expect(details.accountName).toBe(mockAccountData[0].accountName)
    expect(details.id).toBe(mockAccountData[0].id)
  })

  it('fetches discs for an account', async () => {
    const discs = await fetchDiscsDetails(String(mockAccountData[0].id))
    const expected = mockDiscData.filter(
      (disc) => disc.accountId === String(mockAccountData[0].id),
    )
    expect(discs).toHaveLength(expected.length)
  })
})
