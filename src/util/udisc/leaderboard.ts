import { BASE_URL } from './constants.js'

const EXPORT_PATH = '/leaderboard/export'

function getLeaderboardExportURL(href: string | undefined) {
  if (!href) return null

  const absoluteHref = new URL(href, BASE_URL).href
  const [baseHref] = absoluteHref.split('??')
  return `${baseHref.replace(/\/$/, '')}${EXPORT_PATH}`
}

export { getLeaderboardExportURL }
