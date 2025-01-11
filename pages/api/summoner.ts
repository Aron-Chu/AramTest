// pages/api/summoner.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import SummonerModel from '../../models/SummonerModel'
import { fetchSummonerByName } from '../../lib/riotApi'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect()

  const { region, name } = req.query as { region: string; name: string }

  if (!region || !name) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing region or name parameters' })
  }

  try {
    // Look up the summoner in the database
    let summoner = await SummonerModel.findOne({ region, name })

    if (!summoner) {
      // If not found locally, fetch from Riot API
      const summonerData = await fetchSummonerByName(region, name)
      if (!summonerData) {
        return res
          .status(404)
          .json({ success: false, message: 'Summoner not found' })
      }

      // Save to DB
      summoner = new SummonerModel({
        region,
        name: summonerData.name,
        puuid: summonerData.puuid,
        profileIconId: summonerData.profileIconId,
        summonerLevel: summonerData.summonerLevel,
      })
      await summoner.save()
    }

    return res.status(200).json({ success: true, summoner })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Error fetching summoner data',
    })
  }
}
