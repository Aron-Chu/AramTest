import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import MatchModel from '../../models/MatchModel'
import SummonerModel from '../../models/SummonerModel'

interface LeaderboardEntry {
  summonerName: string
  region: string
  averageAramScore: number
  totalGames: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  await dbConnect()

  try {
    const aggregated = await MatchModel.aggregate([
      {
        $group: {
          _id: '$puuid',
          averageAramScore: { $avg: '$aramScore' },
          totalGames: { $sum: 1 },
        },
      },
      { $sort: { averageAramScore: -1 } },
      { $limit: 20 },
    ])

    const leaderboard: LeaderboardEntry[] = []

    for (const row of aggregated) {
      const summoner = await SummonerModel.findOne({ puuid: row._id })
      if (!summoner) continue

      leaderboard.push({
        summonerName: summoner.name,
        region: summoner.region,
        averageAramScore: row.averageAramScore ?? 0,
        totalGames: row.totalGames ?? 0,
      })
    }

    return res.status(200).json({ success: true, leaderboard })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard data',
    })
  }
}
