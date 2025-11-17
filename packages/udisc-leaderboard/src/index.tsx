import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import './leaderboard.css'

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

  if (isLoading)
    return (
      <div
        className="udl-card udl-card--loading"
        role="status"
        aria-live="polite"
      >
        <span className="udl-spinner" aria-hidden="true" />
        <span className="udl-loading-text">Loading leaderboard…</span>
      </div>
    )
  if (error)
    return (
      <div className="udl-card udl-card--error">
        Error loading leaderboard: {(error as Error).message}
      </div>
    )

  return (
    <section className="udl-card" aria-live="polite">
      <header className="udl-card__hero">
        <div className="udl-card__icon" aria-hidden="true">
          🏆
        </div>
        <div>
          <h2 className="udl-card__title">Winter League Finals</h2>
          <p className="udl-card__meta">March 16, 2025 • River’s Edge</p>
        </div>
      </header>

      <table className="udl-table">
        <thead>
          <tr>
            <th scope="col">Pos</th>
            <th scope="col">Player</th>
            <th scope="col">Score</th>
            <th scope="col">Round</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((entry: any) => {
            const [first, last] = entry.name.split(' ')
            const relative =
              entry.event_relative_score === 0
                ? 'E'
                : `${entry.event_relative_score > 0 ? '+' : ''}${entry.event_relative_score}`

            return (
              <tr key={entry.username}>
                <td className="udl-table__pos">
                  {entry.position === 1 ? (
                    <span className="udl-table__icon" aria-label="Leader">
                      <svg
                        className="udl-table__icon-svg"
                        viewBox="0 0 24 24"
                        role="img"
                        aria-hidden="true"
                      >
                        <path
                          d="M20 4h-3V2H7v2H4v5c0 3.1 2 5.7 4.8 6.6.4.8 1 1.5 1.7 2V20H8v2h8v-2h-2.5v-2.4c.8-.5 1.4-1.2 1.8-2 2.8-.9 4.7-3.5 4.7-6.6V4Zm-2 5c0 2.1-1.3 3.9-3.3 4.5H9.3C7.3 12.9 6 11.1 6 9V6h1.5V9h2V6h5v3h2V6H18v3Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  ) : null}
                  <span>{entry.position}</span>
                </td>
                <td>{`${first} ${(last?.[0] ?? '').toUpperCase()}`}</td>
                <td className="udl-table__score">{relative}</td>
                <td>{entry.round_total_score}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
