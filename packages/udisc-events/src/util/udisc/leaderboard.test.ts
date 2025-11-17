import { getLeaderboardExportURL } from './leaderboard.js'

it('returns null for undefined href', () => {
  expect(getLeaderboardExportURL(undefined)).toBeNull()
})

it('constructs the correct export URL', () => {
  const href = '/events/some-event'
  const expectedURL = 'https://udisc.com/events/some-event/leaderboard/export'
  expect(getLeaderboardExportURL(href)).toBe(expectedURL)
})

it('handles href with query parameters', () => {
  const href = '/events/some-event??param=value'
  const expectedURL = 'https://udisc.com/events/some-event/leaderboard/export'
  expect(getLeaderboardExportURL(href)).toBe(expectedURL)
})

it('removes trailing slash from href before appending export path', () => {
  const href = '/events/some-event/'
  const expectedURL = 'https://udisc.com/events/some-event/leaderboard/export'
  expect(getLeaderboardExportURL(href)).toBe(expectedURL)
})
