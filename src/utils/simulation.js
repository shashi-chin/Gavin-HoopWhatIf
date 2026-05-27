/**
 * HoopWhatIf - Matchup Simulation Engine
 * 
 * This is one of the most important files for remixing!
 * 
 * The simulation is deliberately simple and transparent so you can understand
 * exactly how the results are calculated — and then change the rules.
 * 
 * Key idea:
 * Every player has "offense" and "defense" ratings (1-100).
 * We combine those with era adjustments (how the game was played back then)
 * and a little randomness to create fun, believable outcomes.
 */

// Base era multipliers — these are the levers you can play with!
export const ERA_ADJUSTMENTS = {
  '70s-80s': { pace: 0.92, threePoint: 0.65, physical: 1.15 },
  '80s-90s': { pace: 0.95, threePoint: 0.75, physical: 1.10 },
  '90s-00s': { pace: 0.98, threePoint: 0.85, physical: 1.05 },
  '00s-10s': { pace: 1.00, threePoint: 0.95, physical: 1.00 },
  '2010s':   { pace: 1.05, threePoint: 1.10, physical: 0.95 },
  'Current': { pace: 1.10, threePoint: 1.22, physical: 0.90 },
}

/**
 * Run a simulated matchup between two players.
 * 
 * @param {Object} p1 - First player object from players.json
 * @param {Object} p2 - Second player object from players.json
 * @param {Object} sliders - Current era adjustment values from the UI
 * @returns {Object} result - Contains winner, scores, explanation
 */
export function simulateMatchup(p1, p2, sliders) {
  // Get the base era factors for each player
  const era1 = ERA_ADJUSTMENTS[p1.era] || ERA_ADJUSTMENTS['Current']
  const era2 = ERA_ADJUSTMENTS[p2.era] || ERA_ADJUSTMENTS['Current']

  // Apply the live sliders from the UI (these are the fun knobs!)
  // sliders.threePoint, sliders.pace, sliders.physical come from the UI (0.7 - 1.3 range)
  const threeBoost1 = era1.threePoint * sliders.threePoint
  const threeBoost2 = era2.threePoint * sliders.threePoint

  const physical1 = era1.physical * sliders.physical
  const physical2 = era2.physical * sliders.physical

  // Calculate "effective" offense for this simulated environment
  // Offense + bonus for 3-point era + slight pace effect
  const effectiveOff1 = p1.offense * (0.65 + threeBoost1 * 0.35) * (sliders.pace * 0.1 + 0.9)
  const effectiveOff2 = p2.offense * (0.65 + threeBoost2 * 0.35) * (sliders.pace * 0.1 + 0.9)

  // Defense is helped by physicality
  const effectiveDef1 = p1.defense * (0.8 + physical1 * 0.2)
  const effectiveDef2 = p2.defense * (0.8 + physical2 * 0.2)

  // Projected "game score" for each player (simplified)
  // Higher offense vs opponent's defense = better performance
  const score1 = Math.round(
    (effectiveOff1 * 0.7 + (100 - effectiveDef2) * 0.3) * (0.85 + Math.random() * 0.3)
  )
  const score2 = Math.round(
    (effectiveOff2 * 0.7 + (100 - effectiveDef1) * 0.3) * (0.85 + Math.random() * 0.3)
  )

  const winner = score1 > score2 ? p1 : p2
  const loser = winner === p1 ? p2 : p1
  const margin = Math.abs(score1 - score2)

  // Generate a human-readable explanation (great for learning!)
  let explanation = `${winner.name} wins by ${margin} points in this era.`

  if (sliders.threePoint > 1.15) {
    explanation += " The 3-point heavy environment helped the better shooter."
  } else if (sliders.physical > 1.12) {
    explanation += " The physical style of play rewarded the stronger defender."
  }

  return {
    winner: winner.name,
    loser: loser.name,
    score1: winner === p1 ? score1 : score2,
    score2: winner === p1 ? score2 : score1,
    margin,
    explanation,
    // Raw numbers so the UI can show "why" this happened
    details: {
      effectiveOff1: Math.round(effectiveOff1),
      effectiveOff2: Math.round(effectiveOff2),
      effectiveDef1: Math.round(effectiveDef1),
      effectiveDef2: Math.round(effectiveDef2),
    }
  }
}

/**
 * TODO for you (the builder):
 * 
 * Try changing the multipliers above (threeBoost, physical, etc).
 * 
 * Ideas to experiment with:
 * 1. Make 3-pointers even more valuable in "Current" era
 * 2. Give bigs (centers) a bonus when physicality is high
 * 3. Add a "clutch" random factor for legendary players
 * 
 * This is one of the best places in the whole project to remix!
 */
