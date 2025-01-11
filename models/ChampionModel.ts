// models/ChampionModel.ts

import mongoose, { Schema, model, models } from 'mongoose'

/**
 * Champion Schema
 *
 * Potential fields:
 * - id (e.g. "Aatrox")
 * - key (e.g. "266")
 * - name (Champion name, e.g. "Aatrox")
 * - title (Champion subtitle, e.g. "the Darkin Blade")
 * - iconUrl (Optional: URL to champion icon or splash)
 * - stats (Optional: base stats, e.g. hp, attack damage, etc.)
 * - tags (e.g. ["Fighter", "Tank"])
 * - lastUpdated (Track when data was synced from Riot)
 */

const ChampionSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    key: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String },
    iconUrl: { type: String },
    stats: { type: Object },     // e.g., { hp: 580, hpperlevel: 90, attackrange: 175, ... }
    tags: [{ type: String }],    // e.g. ["Fighter", "Tank"]
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,            // Automatically adds createdAt and updatedAt
  }
)

/**
 * If a model named "Champion" already exists (in the case of hot-reload in dev),
 * reuse it. Otherwise, create a new model.
 */
const ChampionModel = models.Champion || model('Champion', ChampionSchema)

export default ChampionModel
