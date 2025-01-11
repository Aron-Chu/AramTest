// pages/api/champions.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import ChampionModel from '../../models/ChampionModel'
import { getAllChampionsFromRiot } from '../../lib/riotApi' // a custom function for fetching champions

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to the database
  await dbConnect()

  try {
    switch (req.method) {
      case 'GET':
        // 1) Check the local database for champion data
        //    If no data or stale data, fetch from Riot, store, then return
        let champions = await ChampionModel.find({})

        // Optionally, if champions.length === 0 or data is out of date:
        // champions = await syncChampions() // see function below

        res.status(200).json({ success: true, champions })
        break

      case 'POST':
        // 2) For forced updates / admin triggers
        // This might be restricted behind some key or admin check
        const updatedChampions = await syncChampions()
        res.status(200).json({
          success: true,
          message: 'Champion data updated successfully',
          champions: updatedChampions,
        })
        break

      default:
        res.setHeader('Allow', ['GET', 'POST'])
        res.status(405).end(`Method ${req.method} Not Allowed`)
        break
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: 'Server Error' })
  }
}

// Helper function for champion data sync
async function syncChampions() {
  const riotChampions = await getAllChampionsFromRiot() 
  // Format or transform data if necessary
  // e.g. riotChampions might have data in { data: { Aatrox: { ... }, ... } }
  const championArray = Object.values(riotChampions.data)

  // Upsert logic (if champion doesn't exist, create it; if exists, update)
  for (const champ of championArray) {
    await ChampionModel.findOneAndUpdate(
      { key: champ.key },
      { ...champ }, 
      { upsert: true, new: true }
    )
  }
  return ChampionModel.find({})
}
