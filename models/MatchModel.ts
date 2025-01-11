// models/MatchModel.ts

import mongoose, { Schema, model, models } from 'mongoose'

/**
 * Match Schema
 *
 * Fields might include:
 * - matchId (unique Riot match identifier, e.g. "NA1_1234567890")
 * - puuid (the summoner's unique ID; used to associate with SummonerModel or to fetch details)
 * - championName (which champion the summoner played)
 * - kills, deaths, assists (basic K/D/A)
 * - aramScore (custom ARAM performance metric, see computeAramScore.ts)
 * - queueId (often 450 for ARAM)
 * - timestamp (when match started)
 */

const MatchSchema = new Schema(
  {
    matchId: { type: String, required: true },
    puuid: { type: String, required: true },
    championName: { type: String },
    kills: { type: Number, default: 0 },
    deaths: { type: Number, default: 0 },
    assists: { type: Number, default: 0 },
    aramScore: { type: Number, default: 0 },
    queueId: { type: Number, default: 450 },    // ARAM queue
    timestamp: { type: Number },                // epoch timestamp from Riot for match start
  },
  {
    timestamps: true,
  }
)

const MatchModel = models.Match || model('Match', MatchSchema)

export default MatchModel
