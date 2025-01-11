// pages/summoner/[region]/[name].tsx

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'
import MatchHistoryItem from '@/components/MatchHistoryItem'

interface MatchData {
  matchId: string
  championName: string
  kills: number
  deaths: number
  assists: number
  aramScore?: number
}

export default function SummonerPage() {
  const router = useRouter()
  const { region, name } = router.query

  const [summonerInfo, setSummonerInfo] = useState<any>(null)
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!region || !name) return

    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // 1) Fetch Summoner Info
        const summonerRes = await fetch(`/api/summoner?region=${region}&name=${name}`)
        const summonerData = await summonerRes.json()
        if (!summonerData.success) {
          throw new Error(summonerData.message || 'Could not fetch summoner info')
        }
        setSummonerInfo(summonerData.summoner)

        // 2) Fetch Summoner ARAM Match History
        const matchRes = await fetch(`/api/match?region=${region}&name=${name}&count=5`)
        const matchData = await matchRes.json()
        if (!matchData.success) {
          throw new Error(matchData.message || 'Could not fetch match data')
        }
        setMatches(matchData.matches)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [region, name])

  if (loading) {
    return (
      <Layout>
        <div className="p-4">Loading...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="p-4 text-red-400">Error: {error}</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4">
        {/* Summoner Info */}
        {summonerInfo && (
          <div className="mb-4">
            <h2 className="text-2xl font-bold">
              Summoner: {summonerInfo.name} ({summonerInfo.region})
            </h2>
            <p className="text-gray-300">Level: {summonerInfo.summonerLevel}</p>
          </div>
        )}

        {/* Match History */}
        {matches && matches.length > 0 ? (
          <div className="space-y-2">
            {matches.map((match) => (
              <MatchHistoryItem
                key={match.matchId}
                matchId={match.matchId}
                championName={match.championName}
                kills={match.kills}
                deaths={match.deaths}
                assists={match.assists}
                aramScore={match.aramScore}
                onClick={() => alert(`Clicked match ${match.matchId}`)}
              />
            ))}
          </div>
        ) : (
          <p>No ARAM matches found.</p>
        )}
      </div>
    </Layout>
  )
}
