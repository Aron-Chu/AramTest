// models/SummonerModel.ts

import mongoose, { Schema, model, models } from 'mongoose'

/**
 * Summoner Schema
 *
 * Fields could include:
 * - name (in-game Summoner Name)
 * - region (e.g. "na1", "euw1", "kr")
 * - puuid (Riot's global unique identifier for the summoner)
 * - summonerLevel (player level)
 * - profileIconId (ID for the summoner’s icon)
 * - revisionDate (optional field from Riot, e.g. last update timestamp)
 */

const SummonerSchema = new Schema(
  {
    name: { type: String, required: true },
    region: { type: String, required: true },
    puuid: { type: String, required: true, unique: true },
    summonerLevel: { type: Number, default: 0 },
    profileIconId: { type: Number, default: 0 },
    revisionDate: { type: Number }, // Riot sometimes returns this as a long timestamp
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
)

const SummonerModel = models.Summoner || model('Summoner', SummonerSchema)

export default SummonerModel
