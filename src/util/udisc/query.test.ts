import { EventTypes, TagTypes, buildQueryParams } from './query.js'

it('builds query parameters correctly for base query', () => {
  const query = {
    query: 'disc golf',
    latitude: 40.7128,
    longitude: -74.006,
    searchRadius: 50,
    type: [EventTypes.LEAGUE, EventTypes.CLEANUP],
    tag: [TagTypes.BEGINNER_FRIENDLY, TagTypes.GLOW],
    handicapScoring: true,
  }

  const result = buildQueryParams(query)
  const expectedParams = new URLSearchParams({
    query: 'disc golf',
    latitude: '40.7128',
    longitude: '-74.006',
    searchRadius: '50',
  })
  expectedParams.append('type', 'league')
  expectedParams.append('type', 'clean-up')
  expectedParams.append('tag', 'beginner-friendly')
  expectedParams.append('tag', 'glow-round')
  expectedParams.append('handicapScoring', '1')

  expect(result).toBe(expectedParams.toString())
})

it('builds query parameters correctly for custom date query', () => {
  const query = {
    dates: 'custom',
    endsOnOrAfter: '2024-01-01',
    startsOnOrBefore: '2024-12-31',
    dateDuration: 'week',
  } as const

  const result = buildQueryParams(query)
  const expectedParams = new URLSearchParams({
    dates: 'custom',
    dateDuration: 'week',
    startsOnOrBefore: '2024-12-31',
    endsOnOrAfter: '2024-01-01',
  })

  expect(result).toBe(expectedParams.toString())
})
