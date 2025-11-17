import { EventsQuery } from '@imccausl/udisc-events'
import { useQuery } from '@tanstack/react-query'

export function useLeaderboardQuery(query: string) {
  return useQuery({
    queryKey: ['leaderboard', query],
    queryFn: async () => {
      const eventsQuery = new EventsQuery({
        query,
        type: ['league'],
        dates: 'custom',
        startsOnOrBefore: '2025-12-10',
        endsOnOrAfter: '2025-11-08',
      })
      return eventsQuery.latestLeaderboard()
    },
  })
}

export function Leaderboard() {
  const { data, isLoading, error } = useLeaderboardQuery('LDGA')
  console.log('Leaderboard data:', data)
  if (isLoading) {
    return <div>Loading leaderboard...</div>
  }

  if (error) {
    return <div>Error loading leaderboard: {(error as Error).message}</div>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((entry: any) => (
          <tr key={entry.Rank}>
            <td>{entry.Rank}</td>
            <td>{entry.Name}</td>
            <td>{entry.Score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
