import { describe, expect, it } from 'vitest'

import { mockDiscData } from './mockData.js'
import { getDiscs } from './disc.js'

describe('disc', () => {
  it('fetches discs for an account', async () => {
    const discs = await getDiscs({ accountName: 'maple hill' })
    const expected = mockDiscData.filter((disc) => disc.accountId === '87')
    expect(discs).toHaveLength(expected.length)
  })

  it('filters by color case-insensitively', async () => {
    const discs = await getDiscs({
      accountName: 'maple hill',
      color: 'pink',
    })
    const expected = mockDiscData.filter(
      (disc) =>
        disc.accountId === '87' &&
        disc.color?.toLowerCase() === 'pink',
    )
    expect(discs).toHaveLength(expected.length)
  })

  it('throws when account is not found', async () => {
    await expect(
      getDiscs({ accountName: 'missing', brand: 'innova' }),
    ).rejects.toThrow(/No account found/)
  })
})
