// pages/api/match.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import MatchModel from '../../models/MatchModel'
import SummonerModel from '../../models/SummonerModel'
import { fetchMatchesByPuuid } from '../../lib/riotApi'
import { computeAramScore } from '../../lib/computeAramScore'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()
  const { region, name, count } = req.query as { region: string; name: string; count?: string }

  if (!region || !name) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing region or name parameters' })
  }

  try {
    // Find summoner in DB (already fetched via summoner API)
    const summoner = await SummonerModel.findOne({ region, name })
    if (!summoner) {
      return res
        .status(404)
        .json({ success: false, message: 'Summoner not found in DB' })
    }

    // Check local DB matches first (optional).
    // E.g., if you store match references for each summoner:
    let localMatches = await MatchModel.find({ puuid: summoner.puuid }).limit(Number(count) || 10)

    // If no local matches or want to refresh data, fetch from Riot
    if (localMatches.length === 0) {
      const matchIds = await fetchMatchesByPuuid(summoner.puuid, Number(count) || 10, 'ARAM')
      // fetchMatchesByPuuid is a custom function that returns the match IDs for the summoner's ARAM games
      // Then fetch each match detail from Riot or call another function to batch fetch
      const matchDetailsArray = [] // array of match details from Riot

      for (const matchId of matchIds) {
        // fetch each match detail
        const matchDetail = await fetchMatchDetail(matchId) // Another function in riotApi.ts
        // Compute ARAM performance score
        const { kills, deaths, assists, totalDamageDealtToChampions } = extractParticipantStats(matchDetail, summoner.puuid)
        const aramScore = computeAramScore({ kills, deaths, assists, damageDealt: totalDamageDealtToChampions })

        matchDetailsArray.push({
          matchId,
          puuid: summoner.puuid,
          kills,
          deaths,
          assists,
          totalDamageDealtToChampions,
          aramScore,
          // ... other relevant fields from match detail
        })
      }

      // Save matches in DB
      await MatchModel.insertMany(matchDetailsArray)
      localMatches = matchDetailsArray
    }

    res.status(200).json({ success: true, matches: localMatches })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error fetching match data',
    })
  }
}

// Helper to parse participant data from a match detail
function extractParticipantStats(matchDetail: any, puuid: string) {
  const participant = matchDetail.info.participants.find((p: any) => p.puuid === puuid)
  return {
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    totalDamageDealtToChampions: participant.totalDamageDealtToChampions,
  }
}
