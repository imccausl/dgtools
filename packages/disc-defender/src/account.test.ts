import { describe, expect, it } from 'vitest'

import { findAccountDetails, findAccounts } from './account.js'
import { mockAccountData } from './mockData.js'

describe('account', () => {
  it('finds accounts by name', async () => {
    const accounts = await findAccounts({ accountName: 'maple hill' })
    expect(accounts).toHaveLength(1)
    expect(accounts[0].accountName).toBe('maple hill')
  })

  it('supports array filters', async () => {
    const names = ['maple hill', 'tri-fox disc golf']
    const accounts = await findAccounts({ accountName: names })
    expect(accounts.map((a) => a.accountName).sort()).toEqual(names.sort())
  })

  it('returns details for matching accounts', async () => {
    const [details] = await findAccountDetails('maple hill')
    expect(details.accountName.toLowerCase()).toBe('maple hill')
    expect(details.id).toBe(mockAccountData[0].id)
  })

  it('throws when no account is found', async () => {
    await expect(findAccountDetails('nope')).rejects.toThrow(
      /No account found/,
    )
  })
})
