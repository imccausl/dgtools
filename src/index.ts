import { UDiscEventsQuery } from './util/udisc/query.js'

async function main() {
  const query = new UDiscEventsQuery({
    quickFilter: 'league',
    dates: 'past',
    query: 'LDGA Weekend League',
  })

  const events = await query.events()
  const latestEvent = await query.latestEvent()
  if (!latestEvent?.url) {
    console.log('No latest event found.')
    return
  }

  const leaderboard = await query.leaderboard(latestEvent?.url)

  console.log(JSON.stringify(leaderboard, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
