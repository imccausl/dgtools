import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function useLeaderboardQuery(query: string) {
  return useQuery({
    queryKey: ['leaderboard', query],
    queryFn: async () => {
      const response = await axios.get(
        'https://api.ud.dgtools.dev/events/leaderboard/latest?quickFilter=league&latitude=42.97361108241227&longitude=-81.24997617076032&searchRadius=50&dates=past&dateDuration=month&query=ldga',
      )
      return response.data
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
