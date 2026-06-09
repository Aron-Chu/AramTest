interface AramScoreInput {
  kills: number
  deaths: number
  assists: number
  damageDealt: number
}

/**
 * Simple ARAM performance score: KDA ratio weighted with damage dealt.
 */
export function computeAramScore({
  kills,
  deaths,
  assists,
  damageDealt,
}: AramScoreInput): number {
  const kda = deaths === 0 ? kills + assists : (kills + assists) / deaths
  return Number((kda * 10 + damageDealt / 1000).toFixed(2))
}
