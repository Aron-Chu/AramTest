// components/MatchHistoryItem.tsx

import React from 'react'

interface MatchHistoryItemProps {
  matchId: string
  championName: string
  kills: number
  deaths: number
  assists: number
  aramScore?: number
  onClick?: () => void
}

export default function MatchHistoryItem({
  matchId,
  championName,
  kills,
  deaths,
  assists,
  aramScore,
  onClick,
}: MatchHistoryItemProps) {
  // Optional color coding based on success, ARAM score, etc.
  const isPositiveKDA = kills + assists > deaths

  return (
    <div
      className="bg-gray-800 border border-gray-700 rounded-md p-4 hover:bg-gray-700 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-bold text-white">Match: {matchId}</h4>
        {/* If you wanted to show champion icon, you can fetch that using championName */}
      </div>
      <p>
        Champion: <span className="font-semibold">{championName}</span>
      </p>
      <p
        className={
          isPositiveKDA ? 'text-green-400' : 'text-red-400'
        }
      >
        K/D/A: {kills}/{deaths}/{assists}
      </p>
      {aramScore !== undefined && (
        <p className="text-blue-400">ARAM Score: {aramScore}</p>
      )}
    </div>
  )
}
