// pages/leaderboard.tsx

import React, { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

interface LeaderboardEntry {
  summonerName: string
  region: string
  averageAramScore: number
  totalGames: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)
        setError(null)

        // Example: Suppose we have an API route /api/leaderboard
        // that returns top ARAM players by average ARAM score
        const res = await fetch('/api/leaderboard')
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Failed to fetch leaderboard data.')
        }

        setLeaderboard(data.leaderboard)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Top ARAM Performers</h1>

        {loading && <p>Loading leaderboard...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {!loading && !error && leaderboard.length === 0 && (
          <p>No leaderboard data available.</p>
        )}

        {/* Display the leaderboard */}
        <div className="space-y-4">
          {leaderboard.map((player, index) => (
            <div
              key={`${player.region}-${player.summonerName}`}
              className="bg-gray-800 p-4 rounded-md flex justify-between items-center"
            >
              <div>
                <span className="text-xl font-bold mr-2">#{index + 1}</span>
                <span className="font-semibold">{player.summonerName}</span> ({player.region})
              </div>
              <div>
                <span className="text-blue-400">ARAM Score:</span>{' '}
                {player.averageAramScore.toFixed(2)}{' '}
                <span className="text-gray-400 ml-2">({player.totalGames} games)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
