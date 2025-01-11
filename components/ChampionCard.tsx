// components/ChampionCard.tsx

import React from 'react'

interface ChampionCardProps {
  championId: string   // e.g., "Ahri"
  championName: string // e.g., "Ahri"
}

export default function ChampionCard({ championId, championName }: ChampionCardProps) {
  // Data Dragon icon URL pattern:
  // https://ddragon.leagueoflegends.com/cdn/<patchVersion>/img/champion/<championId>.png
  // Use the latest patch or fetch from Riot's version endpoint
  const patchVersion = '13.1.1' // Example: hard-coded, or fetch dynamically
  const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/champion/${championId}.png`

  return (
    <div style={{ 
      backgroundColor: '#3b3b3b', 
      padding: '1rem', 
      borderRadius: '8px', 
      width: '150px',
      textAlign: 'center'
    }}>
      <img 
        src={iconUrl} 
        alt={championName} 
        style={{ 
          width: '64px', 
          height: '64px', 
          objectFit: 'contain' 
        }} 
      />
      <p style={{ marginTop: '0.5rem' }}>{championName}</p>
    </div>
  )
}
