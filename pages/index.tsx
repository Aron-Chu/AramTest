// pages/index.tsx

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/Layout'

export default function HomePage() {
  const router = useRouter()
  const [summonerName, setSummonerName] = useState('')
  const [region, setRegion] = useState('na1')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!summonerName) return
    // Navigate to the summoner's page
    router.push(`/summoner/${region}/${encodeURIComponent(summonerName)}`)
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome to ARAM Stats
        </h1>
        <p className="text-lg text-gray-300 mb-8 text-center max-w-2xl">
          Track your ARAM performance, explore champion insights, and compare stats with top players around the globe.
        </p>

        {/* Summoner Search Section */}
        <form onSubmit={handleSearch} className="space-x-2">
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <option value="na1">NA</option>
            <option value="euw1">EUW</option>
            <option value="eune">EUNE</option>
            <option value="kr">KR</option>
            <option value="br1">BR</option>
            {/* Add more regions as needed */}
          </select>
          <input
            type="text"
            placeholder="Summoner Name"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Search
          </button>
        </form>
      </div>
    </Layout>
  )
}
