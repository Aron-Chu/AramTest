// lib/riotApi.ts

/**
 * Riot API Key from your .env file.
 * Make sure you do NOT expose this client-side!
 */
const RIOT_API_KEY = process.env.RIOT_API_KEY || ''

/**
 * Fetch summoner data by Summoner Name + Region
 * @param region e.g. "na1", "euw1", etc.
 * @param summonerName Summoner's in-game name
 * @returns Summoner info object, or null if not found
 */
export async function fetchSummonerByName(region: string, summonerName: string) {
  const response = await fetch(
    `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
      summonerName
    )}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    }
  )

  if (!response.ok) {
    // e.g. 404 if summoner not found
    return null
  }

  const data = await response.json()
  return data
}

/**
 * Fetch ARAM match IDs by a player's PUUID
 * Queue ID for ARAM is typically 450.
 * @param puuid Summoner's PUUID
 * @param count Number of matches to fetch
 * @returns Array of match IDs
 */
export async function fetchAramMatchIdsByPuuid(puuid: string, count: number = 20) {
  // The 'americas' endpoint is used for all match-v5 for NA, LAN, LAS, BR, etc.
  // For EU, use 'europe', for KR/JP 'asia', etc., depending on summoner region.
  const regionRouting = 'americas' // example

  const response = await fetch(
    `https://${regionRouting}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=450&start=0&count=${count}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    }
  )

  if (!response.ok) {
    // e.g., rate limit or not found
    return []
  }

  const matchIds = await response.json()
  return matchIds as string[]
}

/**
 * Fetch detailed match data for a given match ID
 * @param matchId e.g. "NA1_1234567890"
 * @returns Full match data object
 */
export async function fetchMatchDetail(matchId: string) {
  const regionRouting = 'americas' // Adjust if needed

  const response = await fetch(
    `https://${regionRouting}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
    {
      headers: {
        'X-Riot-Token': RIOT_API_KEY,
      },
    }
  )

  if (!response.ok) {
    return null
  }
  const matchData = await response.json()
  return matchData
}
