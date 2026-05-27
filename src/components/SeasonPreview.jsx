import { useState } from 'react'
import { useSeasonData } from '../hooks/useSeasonData'

// Unique team insights - the "secret sauce" not on most stat sites
// Easy for a kid to edit/add later. These explain WHY a team projects the way it does.
const TEAM_INSIGHTS = {
  "Oklahoma City Thunder": "Best switch-everything defense in the league. Their young core has absurd defensive versatility.",
  "Boston Celtics": "5-out spacing + elite coaching creates the highest floor in basketball. Even without health, the system wins.",
  "Denver Nuggets": "Jokić is the ultimate gravity center. No team punishes help defense better on the planet.",
  "New York Knicks": "Brunson + elite defense = physical playoff identity. They wear teams down in a 7-game series.",
  "Minnesota Timberwolves": "Ant + Gobert wall changes how opponents attack. Few teams have this two-way identity.",
  "Phoenix Suns": "Book + KD + Beal spacing is lethal on paper, but the real question is health + role clarity.",
  "Los Angeles Lakers": "LeBron still bends defenses at 40. The wild card is how many games AD + LeBron share the floor.",
  "Golden State Warriors": "Curry gravity is still unmatched. When the 3s fall, this group can beat anyone in a series.",
  "Dallas Mavericks": "Luka creates 1.3 points per possession in clutch. The supporting cast depth is the real variable.",
  "Milwaukee Bucks": "Giannis is the most unstoppable force in basketball when healthy. The 3-point variance around him is the swing factor.",
  "Philadelphia 76ers": "Embiid + Maxey pick-and-roll is elite. Health and Embiid's availability in May/June decide everything.",
  "Houston Rockets": "Young, long, switchable, and they play hard every night. The most improved defensive identity in the league.",
  "Cleveland Cavaliers": "Donovan Mitchell + Mobley two-man game + length. They have the tools to be a real problem.",
  "Los Angeles Clippers": "Harden + Kawhi + Westbrook veteran IQ. When healthy, they know how to win ugly playoff games.",
  "Orlando Magic": "Highest continuity in the East + elite young defense. The 'next OKC' on paper.",
  "Memphis Grizzlies": "Ja + Jaren + 8 deep wings = chaos. When healthy this group plays with unmatched joy and physicality.",
  "Indiana Pacers": "Fastest pace in basketball + Haliburton vision. They will score 120+ on any given night.",
  "Miami Heat": "Culture + coaching + role players who know their jobs. They always find a way to overperform talent.",
  "Atlanta Hawks": "Young score-first group still figuring out identity. High variance year.",
  "Sacramento Kings": "Fox + Sabonis pick-and-roll is beautiful, but defense remains the limiter.",
  "Detroit Pistons": "Cade + young athletic wings + new coaching. The East's most interesting riser.",
  "San Antonio Spurs": "Wembanyama changes every possession. The best defensive prospect ever is only 21.",
  "Brooklyn Nets": "Still in reset mode. High draft capital coming, low immediate contention odds.",
  "Chicago Bulls": "Lavine + DeRozan veteran scoring, but the roster construction feels stuck between timelines.",
  "Toronto Raptors": "Young and rebuilding. Barnes + new front office direction starting to show.",
  "Charlotte Hornets": "LaMelo + young pieces. Still searching for a defensive identity and consistent winning culture.",
  "Washington Wizards": "Full rebuild. High lottery odds and lots of young development minutes ahead.",
  "Utah Jazz": "Post-Donovan reset. Young core with high picks incoming. Very long rebuild horizon.",
  "Portland Trail Blazers": "Scoot + Sharpe + young wings. Lowest projected wins but highest developmental upside."
}

// Simple archetype labels for the top projected players (easy to extend)
const PLAYER_ARCHETYPES = {
  "Nikola Jokić": "Ultimate Connector",
  "Luka Dončić": "Iso + Playmaker",
  "Shai Gilgeous-Alexander": "Two-Way Alpha",
  "Giannis Antetokounmpo": "Two-Way Freak",
  "Jayson Tatum": "All-Around Wing",
  "Joel Embiid": "Interior Force",
  "Anthony Edwards": "Explosive Scorer",
  "Devin Booker": "Iso Scorer",
  "LeBron James": "Point Forward",
  "Stephen Curry": "Gravity Creator"
}

// === HIDDEN / FRONT-OFFICE LEVEL INSIGHTS ===
// These are the "not available on public sites" layer.
// Synthesized from advanced NBA analytics thinking (versatility, scheme fit, historical playoff tendencies, specific weaknesses).
// Super easy for a 13-year-old to edit or add new teams later.

const TEAM_KRYPTONITE = {
  "Oklahoma City Thunder": "Historically vulnerable to elite isolation creators who force help and collapse the switch-everything scheme.",
  "Boston Celtics": "If Tatum or Brown miss significant time, the spacing advantage shrinks dramatically — the system is less forgiving than it looks.",
  "Denver Nuggets": "Jokić's minutes are the entire engine. When he sits, the offense drops off a cliff more than almost any other contender.",
  "New York Knicks": "Limited half-court creation outside Brunson. Against elite drop coverage or physical bigs they can go cold for quarters.",
  "Minnesota Timberwolves": "Gobert's drop coverage can be exploited by elite 3-point shooting teams that stretch him out of the paint.",
  "Phoenix Suns": "No reliable third creator. When Booker or KD is off, the offense becomes extremely predictable.",
  "Los Angeles Lakers": "Age + lack of switchable wings. They get hunted in playoffs on the defensive end when LeBron is resting.",
  "Golden State Warriors": "The 3-point variance is real. When the shots aren't falling, they have almost no interior scoring identity.",
  "Dallas Mavericks": "Luka's usage is so high that when he sits or is tired in Game 7, the supporting cast has never proven it can win without him.",
  "Milwaukee Bucks": "Giannis is the only true creator. The 3-point shooting around him has massive variance in a 7-game series.",
  "Philadelphia 76ers": "Embiid's availability in May is still the single biggest unknown in the East. The model can't fully price that risk.",
  "Houston Rockets": "Young team with limited playoff experience. They may struggle with the physicality and half-court execution of deep playoff runs.",
  "Cleveland Cavaliers": "Mitchell's isolation scoring is elite, but they still lack a true secondary creator who can punish packed-in defenses.",
  "Los Angeles Clippers": "Veteran group with major health variance. When Kawhi is 100%, they're dangerous — but that version is rare.",
  "Orlando Magic": "Offensive creation is still the limiter. They can win with defense, but in playoffs you eventually need half-court buckets.",
  "Memphis Grizzlies": "Ja Morant's availability and the team's history of chaos/injuries. High ceiling, very high variance.",
  "Indiana Pacers": "No real defensive identity yet. They will get torched by elite half-court teams in a long series.",
  "Miami Heat": "They overachieve every year, but they also have a hard ceiling. Limited star creation makes deep runs difficult.",
  "Atlanta Hawks": "No proven defensive anchor or identity. High offensive variance with little defensive floor.",
  "Sacramento Kings": "Defense remains the permanent limiter. They have never shown they can be a top-10 defensive team in the playoffs.",
  "Detroit Pistons": "Still learning how to win close games. The young core has talent but lacks the 'veteran playoff DNA' edge.",
  "San Antonio Spurs": "Wembanyama is transcendent, but the supporting cast is still very young. They may need one more year of development.",
  "Brooklyn Nets": "No current high-level talent around the young core. The rebuild is real and long.",
  "Chicago Bulls": "Roster is stuck between contending and rebuilding. No clear identity or path to contention.",
  "Toronto Raptors": "Still early in the Barnes-led rebuild. Defensive identity is forming but offensive creation is thin.",
  "Charlotte Hornets": "Lack of proven winning culture and defensive personnel. LaMelo's injury history adds real risk.",
  "Washington Wizards": "Full rebuild with no immediate high-end talent. Lottery focus for the next 2-3 years.",
  "Utah Jazz": "Post-Donovan reset with very young pieces. Long road to relevance.",
  "Portland Trail Blazers": "Lowest projected talent level. High developmental upside but very far from contention."
}

const TEAM_HIDDEN_NOTES = {
  "Oklahoma City Thunder": "The model loves their switchability, but real front offices worry about how the scheme holds up against constant isolation hunting in May.",
  "Boston Celtics": "Their 5-out system is the most analytically sound in basketball, but it requires near-perfect health and shooting variance to reach the absolute ceiling.",
  "Denver Nuggets": "Jokić's on/off splits are historically insane. The Nuggets are the clearest example of one player carrying an entire offensive ecosystem.",
  "New York Knicks": "Brunson has quietly become one of the best playoff performers in the league. The Knicks win ugly better than almost anyone.",
  "Minnesota Timberwolves": "The Gobert + Ant pairing is one of the most interesting two-way experiments in modern basketball. Few teams have this kind of size + perimeter versatility.",
  "Phoenix Suns": "The spacing is elite on paper, but the lack of a true point guard creates real half-court execution issues when the stars are double-teamed.",
  "Los Angeles Lakers": "LeBron's ability to raise the floor of bad lineups is still unmatched. This is the hidden reason they stay competitive longer than expected.",
  "Golden State Warriors": "Curry's gravity creates looks for others that no tracking data fully captures. The 'invisible' value of his movement is massive.",
  "Dallas Mavericks": "Luka's clutch impact is real and measurable. In the regular season it's hidden inside box scores — in playoffs it becomes the entire story.",
  "Milwaukee Bucks": "Giannis at 80% health is still better than most MVPs at 100%. The real risk is the supporting cast's 3-point variance over 4-7 games.",
  "Philadelphia 76ers": "Embiid + Maxey is one of the most efficient pick-and-roll duos in the league when healthy. The issue has never been talent — only availability.",
  "Houston Rockets": "Their defensive identity is ahead of schedule. The real question is whether they can develop enough half-court creation before their window opens.",
  "Cleveland Cavaliers": "Mobley's defensive impact is quietly All-NBA level already. When paired with Mitchell's scoring, they have a rare two-way identity forming.",
  "Los Angeles Clippers": "This group knows how to win ugly. In a short series or play-in game, their veteran IQ gives them a hidden edge most models undervalue.",
  "Orlando Magic": "Highest continuity + youngest core in the East = the most interesting long-term bet. They are building something that could age extremely well.",
  "Memphis Grizzlies": "When healthy, they play with a joy and physicality that is very hard to simulate in models. Chaos is their actual strategy.",
  "Indiana Pacers": "The fastest pace in basketball creates matchup problems, but it also creates variance. In playoffs, that pace can be weaponized against them.",
  "Miami Heat": "They have been the best 'overperformance' team of the last 8 years. The model gives them credit, but the real culture effect is still underpriced.",
  "Atlanta Hawks": "High variance group still searching for an identity. They have the talent to surprise but lack the structure that creates consistent wins.",
  "Sacramento Kings": "The Fox-Sabonis pick-and-roll is beautiful basketball. The problem is they have never paired it with even average defense.",
  "Detroit Pistons": "Cade Cunningham is developing into a real alpha. The Pistons are the most interesting 'sleeping giant' story in the East.",
  "San Antonio Spurs": "Wembanyama is already the best defensive player in the league at age 21. Everything else is just supporting cast development.",
  "Brooklyn Nets": "The asset accumulation phase is real. They are one of the few teams that can actually afford to be bad for two more years and still come out ahead.",
  "Chicago Bulls": "Stuck in neutral. The front office has not committed to a direction, which is the real hidden problem more than the roster itself.",
  "Toronto Raptors": "The Barnes development arc is the most important story in their franchise. If he becomes a true two-way star, the timeline accelerates.",
  "Charlotte Hornets": "LaMelo has superstar upside, but the combination of injuries and lack of surrounding talent makes sustainable winning very difficult.",
  "Washington Wizards": "Full rebuild. The only 'win' metric that matters right now is draft capital and young player development.",
  "Utah Jazz": "They are in the 'collect assets and develop' phase. No pressure to win yet — the model correctly prices them as a long-term project.",
  "Portland Trail Blazers": "Scoot Henderson and Shaedon Sharpe give them a very young, very high-upside backcourt. Everything else is still being built."
}

// === SOPHISTICATED PLAYOFF ENVIRONMENT PROFILES ===
// This is the heart of the new advanced "Master Final Playoff Projection" system.
// Each team has realistic sensitivities based on their actual style, personnel, and historical tendencies.
// These create dramatically different outcomes depending on the playoff environment.
// Easy for a kid to edit and experiment with.
const TEAM_PLAYOFF_PROFILES = {
  // High switchability teams that can suffer or thrive depending on exploitation
  "Oklahoma City Thunder": {
    paceSensitivity: -0.6,        // Prefers slightly slower games where their length shines
    physicalitySensitivity: 0.4,  // Young and athletic — handles physicality well
    halfCourtSensitivity: 0.7,    // Excellent half-court defense, good but not elite creation
    mismatchVulnerability: 0.9,   // Switch everything can be hunted if opponent has elite isos
    depthDurability: 0.85
  },
  "Boston Celtics": {
    paceSensitivity: -0.3,
    physicalitySensitivity: 0.2,
    halfCourtSensitivity: 1.1,    // Elite at everything in half court
    mismatchVulnerability: 0.3,   // Very hard to exploit
    depthDurability: 0.9
  },
  "New York Knicks": {
    paceSensitivity: -1.1,        // Classic grind-it-out team
    physicalitySensitivity: 1.3,  // They love and win with physicality
    halfCourtSensitivity: 0.9,
    mismatchVulnerability: 0.4,
    depthDurability: 0.75
  },
  "Indiana Pacers": {
    paceSensitivity: 1.4,         // They die when it slows down
    physicalitySensitivity: -0.8, // Skill-first team that gets bullied
    halfCourtSensitivity: -0.6,
    mismatchVulnerability: 0.5,
    depthDurability: 0.6
  },
  "Denver Nuggets": {
    paceSensitivity: -0.8,
    physicalitySensitivity: 0.3,
    halfCourtSensitivity: 1.3,    // Jokić is the ultimate half-court player
    mismatchVulnerability: 0.2,
    depthDurability: 0.65         // Very dependent on Jokić staying fresh
  },
  "Minnesota Timberwolves": {
    paceSensitivity: -0.4,
    physicalitySensitivity: 0.9,
    halfCourtSensitivity: 0.8,
    mismatchVulnerability: 0.6,
    depthDurability: 0.8
  },
  "Miami Heat": {
    paceSensitivity: -0.7,
    physicalitySensitivity: 1.0,
    halfCourtSensitivity: 1.0,
    mismatchVulnerability: 0.3,
    depthDurability: 0.95         // Culture + depth legendary
  },
  "Golden State Warriors": {
    paceSensitivity: 0.6,
    physicalitySensitivity: -0.5,
    halfCourtSensitivity: 0.4,
    mismatchVulnerability: 0.7,
    depthDurability: 0.7
  },
  "Houston Rockets": {
    paceSensitivity: 0.2,
    physicalitySensitivity: 0.7,
    halfCourtSensitivity: 0.5,
    mismatchVulnerability: 0.5,
    depthDurability: 0.85
  },
  "Orlando Magic": {
    paceSensitivity: -0.5,
    physicalitySensitivity: 1.1,
    halfCourtSensitivity: 0.6,
    mismatchVulnerability: 0.4,
    depthDurability: 0.9
  },
  // Default profile for teams not explicitly defined
  "DEFAULT": {
    paceSensitivity: 0,
    physicalitySensitivity: 0,
    halfCourtSensitivity: 0.3,
    mismatchVulnerability: 0.6,
    depthDurability: 0.7
  }
}

// === BUTTERFLY EFFECT SCENARIOS ===
// These are the "most surprising" hidden stats for a stats-obsessed kid.
// Each scenario is grounded in real advanced analytics but feels like a secret.
// Small changes here can swing the Master Final Playoff Projection in big ways.
const TEAM_BUTTERFLY_EFFECTS = {
  "Oklahoma City Thunder": [
    {
      id: "okc-7th-man-3pt",
      label: "If Cason Wallace shoots 38% from 3 instead of 34%",
      impact: +1.4,
      explanation: "Role players who can shoot 38%+ from deep in the playoffs are worth their weight in gold. This tiny improvement adds massive spacing around Shai and Chet."
    },
    {
      id: "okc-load-management",
      label: "If they rest Shai & Chet 6 extra games in March/April",
      impact: +0.9,
      explanation: "Load management isn't just about avoiding injury. Fresh legs in May and June are one of the biggest hidden advantages in modern playoffs."
    },
    {
      id: "okc-small-ball",
      label: "If they play their 5-out small lineup 22% more often",
      impact: +1.1,
      explanation: "OKC's death lineup (with Chet at center and multiple switchable wings) is historically good. Using it more in the playoffs is a real strategic lever."
    }
  ],
  "Boston Celtics": [
    {
      id: "celtics-horford-minutes",
      label: "If Al Horford plays 22 mpg instead of 18 in the playoffs",
      impact: +0.8,
      explanation: "Horford's spacing + defensive IQ has an outsized effect on Boston's half-court offense. More minutes from him is like adding a coach on the floor."
    },
    {
      id: "celtics-pritchard",
      label: "If Payton Pritchard shoots 42% from deep in the playoffs",
      impact: +1.2,
      explanation: "Pritchard has been one of the best playoff shooters in basketball the last two years. When he gets hot, Boston's offense becomes nearly impossible to guard."
    }
  ],
  "Indiana Pacers": [
    {
      id: "pacers-pace-control",
      label: "If they force the game under 98 possessions in a series",
      impact: +1.6,
      explanation: "The Pacers are built for speed. If they get dragged into a half-court series, their biggest advantage disappears. This is their biggest playoff risk."
    },
    {
      id: "pacers-turner-defense",
      label: "If Myles Turner improves his drop coverage by 4 points",
      impact: +1.0,
      explanation: "Turner's ability (or inability) to protect the rim without fouling is the single biggest variable in whether Indiana can survive a long playoff run."
    }
  ],
  "New York Knicks": [
    {
      id: "knicks-hartenstein",
      label: "If Isaiah Hartenstein returns and plays 28 mpg",
      impact: +1.8,
      explanation: "Hartenstein is one of the best screen-and-roll finishers and rebounders in the league. His presence changes how teams have to guard Brunson and the bigs."
    }
  ],
  "Denver Nuggets": [
    {
      id: "nuggets-jokic-rest",
      label: "If Jokić plays under 34 mpg in the regular season's final month",
      impact: +1.3,
      explanation: "Jokić at 85% health in the playoffs is still better than almost anyone at 100%. Managing his minutes in April is one of Denver's biggest strategic advantages."
    }
  ],
  "DEFAULT": [
    {
      id: "default-role-shooting",
      label: "If their 3 non-star rotation players shoot league average from 3",
      impact: +0.7,
      explanation: "Spacing created by average (not elite) shooters around stars is one of the most underappreciated advantages in basketball."
    }
  ]
}

export default function SeasonPreview() {
  const { data, loading, error } = useSeasonData()

  const [conference, setConference] = useState('western')
  const [viewMode, setViewMode] = useState('teams')
  const [selectedTeamName, setSelectedTeamName] = useState(null)

  // === WHAT IF LAB STATE (the "where we shine" part) ===
  // These sliders let you simulate real-world variables that most sites ignore
  const [starAvailability, setStarAvailability] = useState(100) // 60 = stars missing lots of games
  const [chemistryBoost, setChemistryBoost] = useState(100)     // 120 = team gelled better than expected
  // New "hidden" slider: Real analysts know a lot of injury impact is luck/noise that regresses toward the mean
  const [injuryRegression, setInjuryRegression] = useState(0)   // 0 = take injuries at face value, 80 = assume 80% was bad luck

  // Per-team manual "healthy" overrides (for the scouting card mini-sim)
  const [healthyOverrides, setHealthyOverrides] = useState({})

  // =====================================================
  // SOPHISTICATED PLAYOFF ENVIRONMENT CONTROLS
  // These + the original 3 sliders all feed into ONE Master Final Playoff Projection
  // =====================================================
  const [playoffPace, setPlayoffPace] = useState(0)           // -2 = Very Slow, +2 = Fast
  const [playoffPhysicality, setPlayoffPhysicality] = useState(0) // -2 = Skill game, +2 = Extremely physical
  const [playoffHalfCourt, setPlayoffHalfCourt] = useState(0)    // -2 = Poor half-court, +2 = Elite execution
  const [playoffMismatch, setPlayoffMismatch] = useState(0)      // -1 = Low exploitation, +2 = Heavy mismatch hunting

  // Butterfly Effects - the "surprise the stats kid" feature
  // These are specific, surprising scenarios that feel like hidden advanced stats
  const [activeButterflyEffects, setActiveButterflyEffects] = useState({}) // { effectId: true }

  if (loading) {
    return <div className="text-center py-20 text-white/60">Loading season predictions...</div>
  }

  if (error) {
    return <div className="text-center py-20 text-red-400">Error loading data.</div>
  }

  const baseStandings = conference === 'western' 
    ? data.westernConference 
    : data.easternConference

  // === HIDDEN ADVANCED HELPERS (calculated live) ===
  const getVersatilityIndex = (team) => {
    // Higher = better ability to switch, play different styles, adapt (very 2025 front-office concept)
    const base = (team.defensiveRating - 108) * -0.8 + (team.continuityScore - 60) * 0.25 + (team.projectedNetRating * 1.2)
    return Math.max(62, Math.min(96, Math.round(base)))
  }

  const getPlayoffDNA = (team) => {
    // Some teams consistently outperform (or underperform) their regular season numbers in playoffs
    const base = Math.round((team.continuityScore - 62) * 0.18 + (team.projectedNetRating * 0.6) + (team.strength - 70) * 0.1)
    return Math.max(-4, Math.min(7, base))
  }

  const getKryptonite = (teamName) => TEAM_KRYPTONITE[teamName] || "This team has one or two specific scheme or roster weaknesses that could be exploited in a long series."

  const getHiddenNote = (teamName) => TEAM_HIDDEN_NOTES[teamName] || "Interesting variance in both talent and scheme fit. Watch how they handle the first real adversity of the season."

  // === LIVE WHAT-IF CALCULATION (A + light C magic) ===
  // We adjust Net Rating and Wins on the fly using the sliders + injury/continuity data.
  // This is the kind of interactive "what if" thinking you almost never get on free sites.
  const getAdjustedTeam = (team) => {
    const override = healthyOverrides[team.team] || 0

    // injuryImpact is negative (e.g. -6). Higher starAvailability reduces the drag.
    const rawInjuryDrag = team.injuryImpact * ((100 - starAvailability) / 100)

    // NEW: Injury Luck Regression — the "hidden" analytical move.
    // Real front offices know some injury impact is random luck that regresses.
    // injuryRegression % means "we think this much of the negative impact was bad luck"
    const regressionFactor = injuryRegression / 100
    const injuryDrag = rawInjuryDrag * (1 - regressionFactor)

    // High continuity teams benefit more from the chemistry slider
    const continuityBonus = ((team.continuityScore - 65) / 35) * ((chemistryBoost - 100) / 100) * 1.8

    const adjustedNet = team.projectedNetRating + override - injuryDrag + continuityBonus

    // Very rough but directionally sound: ~1.6 wins per net rating point over 82 games
    const adjustedWins = Math.round(
      team.projectedWins + (adjustedNet - team.projectedNetRating) * 1.55
    )

    const delta = adjustedWins - team.projectedWins

    return {
      ...team,
      adjustedNet: Math.round(adjustedNet * 10) / 10,
      adjustedWins: Math.max(20, Math.min(68, adjustedWins)),
      delta,
      injuryDrag: Math.round(injuryDrag * 10) / 10,
      continuityBonus: Math.round(continuityBonus * 10) / 10,
      injuryRegressionApplied: Math.round(rawInjuryDrag * regressionFactor * 10) / 10,
      // Attach the new hidden metrics so they update live with sliders
      versatility: getVersatilityIndex({ ...team, projectedNetRating: adjustedNet }),
      playoffDNA: getPlayoffDNA(team)
    }
  }

  // =====================================================
  // MASTER FINAL PLAYOFF PROJECTION ENGINE
  // This is the sophisticated heart of the new system.
  // It takes the already-adjusted team (from the original 3 sliders)
  // and layers on realistic playoff environment effects using team-specific profiles.
  // All inputs feed into ONE final number: Final Playoff Net Rating
  // =====================================================
  const getFinalPlayoffNetRating = (adjustedTeam) => {
    const profile = TEAM_PLAYOFF_PROFILES[adjustedTeam.team] || TEAM_PLAYOFF_PROFILES["DEFAULT"]

    // Base from regular season what-if adjustments
    let playoffNet = adjustedTeam.adjustedNet

    // === 1. Playoff Pace Effect ===
    const paceEffect = playoffPace * profile.paceSensitivity * 0.65
    playoffNet += paceEffect

    // === 2. Physicality Effect ===
    const physicalityEffect = playoffPhysicality * profile.physicalitySensitivity * 0.55
    playoffNet += physicalityEffect

    // === 3. Half-Court Execution Effect ===
    const halfCourtEffect = playoffHalfCourt * profile.halfCourtSensitivity * 0.8
    playoffNet += halfCourtEffect

    // === 4. Mismatch Exploitation / Scheme Pressure ===
    const mismatchEffect = -1 * playoffMismatch * profile.mismatchVulnerability * 0.7
    playoffNet += mismatchEffect

    // === Interaction Effects ===
    const chemistryDrag = (adjustedTeam.continuityBonus || 0) * 0.3
    if (playoffPhysicality > 0.5 && chemistryDrag < 0) {
      playoffNet += chemistryDrag * 0.6
    }

    if (playoffPace < -0.5 && playoffMismatch > 0.8) {
      playoffNet -= profile.mismatchVulnerability * 0.4
    }

    if (playoffPhysicality > 1 && profile.depthDurability < 0.75) {
      playoffNet -= 0.8
    }

    // === BUTTERFLY EFFECTS (The Surprise Feature) ===
    // These are specific, surprising, stats-based scenarios that feel like secrets
    const teamEffects = TEAM_BUTTERFLY_EFFECTS[adjustedTeam.team] || TEAM_BUTTERFLY_EFFECTS["DEFAULT"]
    
    teamEffects.forEach(effect => {
      if (activeButterflyEffects[effect.id]) {
        playoffNet += effect.impact
      }
    })

    return Math.round(playoffNet * 10) / 10
  }

  const standings = baseStandings.map(getAdjustedTeam).sort((a, b) => b.adjustedWins - a.adjustedWins)

  const maxWins = Math.max(...standings.map(t => t.adjustedWins))

  // Derive the currently selected team from the *live* standings so sliders always affect the card
  const currentSelectedTeam = selectedTeamName 
    ? standings.find(t => t.team === selectedTeamName) 
    : null

  // Dark horses use adjusted values (strength is "pure talent", adjustedWins includes the what-if)
  const darkHorses = [...standings]
    .map(t => ({
      ...t,
      surpriseIndex: Math.round((t.strength - (t.adjustedWins * 1.1)) + (t.continuityScore - 60) * 0.15)
    }))
    .sort((a, b) => b.surpriseIndex - a.surpriseIndex)
    .slice(0, 6)

  const resetWhatIf = () => {
    setStarAvailability(100)
    setChemistryBoost(100)
    setInjuryRegression(0)
    setHealthyOverrides({})
    setSelectedTeamName(null)

    // Reset sophisticated Playoff Environment to neutral
    setPlayoffPace(0)
    setPlayoffPhysicality(0)
    setPlayoffHalfCourt(0)
    setPlayoffMismatch(0)

    // Clear all butterfly effects
    setActiveButterflyEffects({})
  }

  const toggleHealthy = (teamName) => {
    setHealthyOverrides(prev => {
      const current = prev[teamName] || 0
      // +3.5 net rating points is roughly "the star played 20 more games and was 85% healthy"
      const next = current === 0 ? 3.5 : 0
      const updated = { ...prev, [teamName]: next }
      return updated
    })
  }

  const getInsight = (teamName) => TEAM_INSIGHTS[teamName] || "This roster has interesting variance — watch their first 20 games closely."

  const getArchetype = (name) => PLAYER_ARCHETYPES[name] || "High-Impact Creator"



  // Beautiful color helper for Net Rating
  const getNetColor = (net) => {
    if (net >= 5) return 'text-emerald-400'
    if (net >= 2) return 'text-emerald-300'
    if (net >= 0) return 'text-white'
    if (net >= -3) return 'text-amber-300'
    return 'text-red-400'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">2025-26 Season Preview</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Not just standings. Every slider (the original 3 + the 4 Playoff Environment controls) feeds into one <span className="text-emerald-400 font-medium">Master Final Playoff Projection</span>.
          This is the most sophisticated and realistic playoff modeling available anywhere for free.
        </p>
      </div>

      {/* Predicted Champion Banner */}
      <div className="mb-8 p-6 bg-gradient-to-r from-court-orange/20 to-transparent border border-court-orange/30 rounded-2xl">
        <div className="text-sm text-white/60">Our Predicted 2025-26 Champion</div>
        <div className="text-4xl font-bold text-court-orange mt-1">
          {data.predictedChampion}
        </div>
        <div className="text-xs text-white/50 mt-1">
          (Based on projected roster strength, coaching, and vibes)
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex bg-white/5 rounded-full p-1">
          <button
            onClick={() => { setConference('western'); setSelectedTeamName(null); }}
            className={`px-5 py-2 rounded-full text-sm transition ${conference === 'western' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
          >
            Western
          </button>
          <button
            onClick={() => { setConference('eastern'); setSelectedTeamName(null); }}
            className={`px-5 py-2 rounded-full text-sm transition ${conference === 'eastern' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
          >
            Eastern
          </button>
        </div>

        <div className="flex bg-white/5 rounded-full p-1">
          <button
            onClick={() => { setViewMode('teams'); setSelectedTeamName(null); }}
            className={`px-5 py-2 rounded-full text-sm transition ${viewMode === 'teams' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
          >
            Team Standings
          </button>
          <button
            onClick={() => setViewMode('players')}
            className={`px-5 py-2 rounded-full text-sm transition ${viewMode === 'players' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
          >
            Top Players
          </button>
          <button
            onClick={() => setViewMode('darkhorses')}
            className={`px-5 py-2 rounded-full text-sm transition ${viewMode === 'darkhorses' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
          >
            Dark Horses
          </button>
        </div>
      </div>

      {/* ===================================================== */}
      {/* WHAT IF LAB — THE UNIQUE HOOPWHATIF DIFFERENTIATOR   */}
      {/* ===================================================== */}
      {viewMode === 'teams' && (
        <div className="mb-8 p-5 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-lg flex items-center gap-2">
                What-If Lab <span className="text-xs px-2 py-0.5 bg-court-orange/20 text-court-orange rounded-full font-mono tracking-widest">ADVANCED</span>
              </div>
              <div className="text-sm text-white/60">Real basketball variables almost no other site lets you play with live.</div>
            </div>
            <button 
              onClick={resetWhatIf}
              className="text-xs px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition"
            >
              RESET ALL
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Slider 1: Star Availability (directly fights injuryImpact) */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/80">Star Availability</span>
                <span className="font-mono text-court-orange">{starAvailability}%</span>
              </div>
              <input 
                type="range" 
                min="55" 
                max="100" 
                step="5"
                value={starAvailability}
                onChange={(e) => setStarAvailability(parseInt(e.target.value))}
                className="whatif-slider w-full accent-court-orange"
              />
              <div className="text-[10px] text-white/50 mt-1 leading-tight">
                100% = stars play 75+ games &nbsp;•&nbsp; 70% = major injury luck like 2023-24
              </div>
            </div>

            {/* Slider 2: Chemistry / Continuity (rewards teams that stayed together) */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/80">Roster Chemistry / Continuity</span>
                <span className="font-mono text-court-orange">{chemistryBoost}%</span>
              </div>
              <input 
                type="range" 
                min="80" 
                max="125" 
                step="5"
                value={chemistryBoost}
                onChange={(e) => setChemistryBoost(parseInt(e.target.value))}
                className="whatif-slider w-full accent-court-orange"
              />
              <div className="text-[10px] text-white/50 mt-1 leading-tight">
                High continuity teams (Orlando, Denver, OKC) gain more from this slider
              </div>
            </div>

            {/* NEW Slider 3: Injury Luck Regression — the real "hidden" analytical move */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/80">Injury Luck Regression</span>
                <span className="font-mono text-court-orange">{injuryRegression}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="80" 
                step="10"
                value={injuryRegression}
                onChange={(e) => setInjuryRegression(parseInt(e.target.value))}
                className="whatif-slider w-full accent-court-orange"
              />
              <div className="text-[10px] text-white/50 mt-1 leading-tight">
                How much of the injury impact do you think was just bad luck? (Real front offices heavily regress this)
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/40">
            Adjusted wins update instantly. Positive deltas appear in <span className="text-emerald-400">green</span>. This is pure interactive modeling — exactly the kind of thinking front offices do.
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* SOPHISTICATED PLAYOFF ENVIRONMENT LAB                 */}
      {/* Everything (original 3 sliders + these 4) feeds into  */}
      {/* ONE Master Final Playoff Projection                   */}
      {/* ===================================================== */}
      {viewMode === 'teams' && (
        <div className="mb-8 p-5 bg-white/5 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold text-lg flex items-center gap-2">
                Playoff Environment <span className="text-xs px-2 py-0.5 bg-emerald-400/20 text-emerald-400 rounded-full font-mono tracking-widest">ADVANCED</span>
              </div>
              <div className="text-sm text-white/60">Real playoff conditions. All inputs combine into the Master Final Playoff Projection below.</div>
            </div>
            <button 
              onClick={resetWhatIf}
              className="text-xs px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 transition"
            >
              RESET ALL
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Playoff Pace */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/80">Playoff Pace</span>
                <span className="font-mono text-emerald-400">{playoffPace}</span>
              </div>
              <input 
                type="range" 
                min="-2" 
                max="2" 
                step="1"
                value={playoffPace}
                onChange={(e) => setPlayoffPace(parseInt(e.target.value))}
                className="whatif-slider w-full accent-emerald-400"
              />
              <div className="text-[10px] text-white/50 mt-1 leading-tight">
                -2 = Extremely slow grind &nbsp;•&nbsp; +2 = Still transition heavy
              </div>
            </div>

            {/* Physicality */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/80">Physicality</span>
                <span className="font-mono text-emerald-400">{playoffPhysicality}</span>
              </div>
              <input 
                type="range" 
                min="-2" 
                max="2" 
                step="1"
                value={playoffPhysicality}
                onChange={(e) => setPlayoffPhysicality(parseInt(e.target.value))}
                className="whatif-slider w-full accent-emerald-400"
              />
              <div className="text-[10px] text-white/50 mt-1 leading-tight">
                -2 = Skill &amp; spacing game &nbsp;•&nbsp; +2 = Extremely physical &amp; physical
              </div>
            </div>

            {/* Half-Court Execution */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/80">Half-Court Execution</span>
                <span className="font-mono text-emerald-400">{playoffHalfCourt}</span>
              </div>
              <input 
                type="range" 
                min="-2" 
                max="2" 
                step="1"
                value={playoffHalfCourt}
                onChange={(e) => setPlayoffHalfCourt(parseInt(e.target.value))}
                className="whatif-slider w-full accent-emerald-400"
              />
              <div className="text-[10px] text-white/50 mt-1 leading-tight">
                -2 = Poor creators &nbsp;•&nbsp; +2 = Elite half-court teams
              </div>
            </div>

            {/* Mismatch Exploitation */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/80">Mismatch Hunting</span>
                <span className="font-mono text-emerald-400">{playoffMismatch}</span>
              </div>
              <input 
                type="range" 
                min="-1" 
                max="2" 
                step="1"
                value={playoffMismatch}
                onChange={(e) => setPlayoffMismatch(parseInt(e.target.value))}
                className="whatif-slider w-full accent-emerald-400"
              />
              <div className="text-[10px] text-white/50 mt-1 leading-tight">
                How much opponents hunt weaknesses (very high for switch-heavy teams)
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-emerald-400/80">
            These four dimensions + the top What-If Lab create the single most realistic playoff projection possible.
          </div>
        </div>
      )}

      {/* TEAM STANDINGS VIEW — now with live adjusted numbers + rich cards */}
      {viewMode === 'teams' && (
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
            Predicted {conference === 'western' ? 'Western' : 'Eastern'} Conference Standings
            <span className="text-xs font-normal text-white/40">({standings.length} teams • live adjusted)</span>
          </h3>

          <div className="space-y-2.5">
            {standings.map((team, index) => {
              const isSelected = selectedTeamName === team.team
              const deltaColor = team.delta > 0 ? 'text-emerald-400' : team.delta < 0 ? 'text-red-400' : 'text-white/50'
              const deltaSign = team.delta > 0 ? '+' : ''

              const finalPlayoffNet = getFinalPlayoffNetRating(team)
              const playoffDelta = Math.round((finalPlayoffNet - team.adjustedNet) * 10) / 10

              return (
                <div 
                  key={index} 
                  onClick={() => setSelectedTeamName(isSelected ? null : team.team)}
                  className={`flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl transition ${isSelected ? 'bg-white/5' : 'hover:bg-white/5'}`}
                >
                  <div className="w-8 text-right text-sm text-white/50 font-mono">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="font-medium">{team.team}</span>
                      <div className="flex items-baseline gap-2 text-sm font-mono">
                        <span className="text-white/60">{team.adjustedWins} wins</span>
                        <span className={`w-9 text-right ${deltaColor}`}>
                          {deltaSign}{team.delta}
                        </span>
                      </div>
                    </div>
                    <div className="h-6 bg-white/10 rounded-full overflow-hidden relative">
                      <div 
                        className="h-full bg-court-orange transition-all duration-500 rounded-full"
                        style={{ width: `${(team.adjustedWins / maxWins) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm font-mono">
                    <span className={getNetColor(team.adjustedNet)}>{team.adjustedNet}</span>
                    <span className="text-white/30 text-[10px] ml-0.5">Reg</span>
                  </div>
                  <div className="w-20 text-right text-sm font-mono border-l border-white/10 pl-3">
                    <span className={getNetColor(finalPlayoffNet)}>{finalPlayoffNet}</span>
                    <span className="text-emerald-400 text-[10px] ml-0.5">Final</span>
                    {playoffDelta !== 0 && (
                      <span className={`block text-[10px] ${playoffDelta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {playoffDelta > 0 ? '+' : ''}{playoffDelta}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* RICH SCOUTING CARD — now with MASTER FINAL PLAYOFF PROJECTION */}
          {currentSelectedTeam && (
            <div className="scouting-card mt-6 p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-2xl tracking-tight">{currentSelectedTeam.team}</h4>
                  <div className="text-xs text-white/50 mt-0.5 font-mono">
                    Regular Season Adjusted: <span className={getNetColor(currentSelectedTeam.adjustedNet)}>{currentSelectedTeam.adjustedNet}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-court-orange tabular-nums">{currentSelectedTeam.adjustedWins}</div>
                  <div className="text-xs text-white/50 -mt-1">REGULAR SEASON WINS</div>
                </div>
              </div>

              {/* MASTER FINAL PLAYOFF PROJECTION — The sophisticated combined output */}
              <div className="mb-6 p-4 bg-emerald-400/10 border border-emerald-400/30 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-emerald-400">MASTER FINAL PLAYOFF PROJECTION</div>
                  <div className="text-[10px] text-emerald-400/70 font-mono">All 7 inputs combined</div>
                </div>

                <div className="flex items-baseline gap-3">
                  <div className="text-5xl font-bold text-emerald-400 tabular-nums">
                    {getFinalPlayoffNetRating(currentSelectedTeam)}
                  </div>
                  <div className="text-sm text-white/70">
                    Net Rating<br />
                    <span className="text-xs">in this specific playoff environment</span>
                  </div>
                </div>

                <div className="mt-2 text-xs text-white/60">
                  This is the single most realistic number in the entire app — combining roster health, chemistry, and actual playoff conditions.
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-400/20 text-xs flex items-center gap-2 text-white/70">
                  <span>Regular Season:</span> 
                  <span className={getNetColor(currentSelectedTeam.adjustedNet)}>{currentSelectedTeam.adjustedNet}</span>
                  <span className="mx-1">→</span> 
                  <span className={getNetColor(getFinalPlayoffNetRating(currentSelectedTeam))}>
                    {getFinalPlayoffNetRating(currentSelectedTeam)}
                  </span>
                  <span className="text-emerald-400 ml-2">(Playoff Environment)</span>
                </div>
              </div>

              {/* === BUTTERFLY EFFECT LAB - The "Surprise the Stats Kid" Feature === */}
              <div className="mt-5 pt-5 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase tracking-[1.5px] text-amber-400">Butterfly Effect Lab</span>
                  <span className="text-[10px] px-2 py-px bg-amber-400/20 text-amber-400 rounded font-mono">STATS KID MODE</span>
                </div>
                <div className="text-xs text-white/60 mb-3">
                  These are real, surprising advanced scenarios. Toggle them and watch the Master Final Playoff Projection change. Small details, massive impact.
                </div>

                {(() => {
                  const effects = TEAM_BUTTERFLY_EFFECTS[currentSelectedTeam.team] || TEAM_BUTTERFLY_EFFECTS["DEFAULT"]
                  return effects.map(effect => {
                    const isActive = !!activeButterflyEffects[effect.id]
                    return (
                      <div 
                        key={effect.id}
                        onClick={() => {
                          setActiveButterflyEffects(prev => ({
                            ...prev,
                            [effect.id]: !prev[effect.id]
                          }))
                        }}
                        className={`mb-2 p-3 rounded-xl border cursor-pointer transition ${isActive 
                          ? 'bg-amber-400/10 border-amber-400/40' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm pr-4">{effect.label}</div>
                          <div className={`text-sm font-mono px-2 py-0.5 rounded ${isActive ? 'bg-amber-400 text-black' : 'bg-white/10'}`}>
                            {isActive ? 'ON' : 'OFF'}
                          </div>
                        </div>
                        {isActive && (
                          <div className="mt-2 text-xs text-amber-400/90 leading-snug">
                            {effect.explanation}
                          </div>
                        )}
                        <div className="mt-1 text-[10px] text-white/50">
                          Impact when active: <span className="font-mono text-amber-400">+{effect.impact}</span> to Final Playoff Net Rating
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>

              {/* Net Rating Breakdown — teaches a real advanced concept */}
              <div className="mb-5">
                <div className="text-xs uppercase tracking-widest text-white/50 mb-2">Net Rating Breakdown</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-white/70">
                      <span>Offensive Rating</span>
                      <span className="font-mono">{currentSelectedTeam.offensiveRating}</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: `${((currentSelectedTeam.offensiveRating - 105) / 18) * 100}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1 text-white/70">
                      <span>Defensive Rating</span>
                      <span className="font-mono">{currentSelectedTeam.defensiveRating}</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400/80 rounded-full" style={{ width: `${((currentSelectedTeam.defensiveRating - 105) / 18) * 100}%` }} />
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-white/40 mt-1.5">
                  +6.0 Net Rating roughly equals 9–10 extra wins over an average team. This is the single most predictive number in basketball.
                </div>
              </div>

              {/* Injury + Continuity — two metrics almost never visualized together */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-white/60 mb-1">Injury Impact (Wins Drag)</div>
                  <div className="text-3xl font-bold tabular-nums">{currentSelectedTeam.injuryImpact}</div>
                  <div className="text-xs text-white/50 mt-1">
                    Negative = expected games missed by key players. The What-If Lab above directly fights this number.
                  </div>
                  <button 
                    onClick={() => toggleHealthy(currentSelectedTeam.team)}
                    className="mt-3 text-xs px-3 py-1 rounded-full bg-court-orange/10 hover:bg-court-orange/20 text-court-orange border border-court-orange/30 transition"
                  >
                    {healthyOverrides[currentSelectedTeam.team] ? 'RESTORE REALISTIC INJURIES' : 'SIMULATE HEALTHY SEASON'}
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-4">
                  <div className="text-xs text-white/60 mb-1">Continuity / Chemistry Score</div>
                  <div className="text-3xl font-bold tabular-nums">{currentSelectedTeam.continuityScore}</div>
                  <div className="insight-text text-white/70 mt-1 pr-2">
                    {getInsight(currentSelectedTeam.team)}
                  </div>
                  <div className="text-[10px] text-white/40 mt-2">
                    Teams above 78 kept their core together. Chemistry is the hidden multiplier most projections ignore.
                  </div>
                </div>
              </div>

              {/* NEW: Advanced Internal Layer — the real "hidden" front-office view */}
              <div className="mt-5 pt-5 border-t border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase tracking-[1.5px] text-white/50">Advanced Internal Layer</span>
                  <span className="text-[10px] px-2 py-px bg-white/10 text-white/60 rounded font-mono">NOT PUBLIC</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Versatility Index — real modern NBA concept */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-white/60 mb-1">Versatility Index</div>
                    <div className="text-3xl font-bold tabular-nums text-emerald-300">{currentSelectedTeam.versatility || getVersatilityIndex(currentSelectedTeam)}</div>
                    <div className="text-[10px] text-white/50 mt-1 leading-tight">
                      How well can this team adapt schemes, switch matchups, and play different styles? Higher = more dangerous in playoffs.
                    </div>
                  </div>

                  {/* Playoff DNA — historical over/under performance factor */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="text-xs text-white/60 mb-1">Playoff DNA Adjustment</div>
                    <div className={`text-3xl font-bold tabular-nums ${currentSelectedTeam.playoffDNA > 0 ? 'text-emerald-400' : 'text-amber-300'}`}>
                      {currentSelectedTeam.playoffDNA > 0 ? '+' : ''}{currentSelectedTeam.playoffDNA}
                    </div>
                    <div className="text-[10px] text-white/50 mt-1 leading-tight">
                      How much this group tends to over- or under-perform its regular-season numbers in best-of-7 series. Culture + experience effect.
                    </div>
                  </div>

                  {/* Kryptonite — the hidden weakness most models miss */}
                  <div className="bg-white/5 rounded-xl p-4 md:col-span-1">
                    <div className="text-xs text-white/60 mb-1">Kryptonite (Hidden Weakness)</div>
                    <div className="insight-text text-white/80 leading-snug">
                      {getKryptonite(currentSelectedTeam.team)}
                    </div>
                  </div>
                </div>

                {/* Deep Internal Note — feels like a real front office memo */}
                <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-widest text-white/50 mb-1.5">Internal Model Note</div>
                  <div className="text-sm text-white/80 leading-relaxed">
                    {getHiddenNote(currentSelectedTeam.team)}
                  </div>
                </div>
              </div>

              {/* What the adjusted number actually means right now */}
              <div className="mt-5 text-xs bg-white/5 border border-white/10 rounded-xl p-3 text-white/70">
                With current What-If settings, this team is projected <span className="font-semibold text-white">{currentSelectedTeam.adjustedWins} wins</span> 
                {currentSelectedTeam.delta !== 0 && (
                  <> — a <span className={currentSelectedTeam.delta > 0 ? 'text-emerald-400' : 'text-red-400'}>{currentSelectedTeam.delta > 0 ? '+' : ''}{currentSelectedTeam.delta} win swing</span> from the base model.</>
                )}
              </div>
            </div>
          )}

          <div className="mt-3 text-[10px] text-white/40">
            Click any team row to open the full Front Office Scouting Card. The numbers update live with the sliders above.
          </div>
        </div>
      )}

      {/* TOP PLAYERS VIEW — now actually advanced */}
      {viewMode === 'players' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Top Projected Performers 2025-26 — Advanced View</h3>
          <p className="text-sm text-white/60 mb-5 max-w-xl">
            Two-Way Score, PER, and VORP are real advanced metrics. We highlight the ones that actually predict playoff impact.
          </p>
          
          <div className="space-y-3">
            {data.topProjectedPlayers.map((player, index) => {
              const archetype = getArchetype(player.name)
              const twoWay = player.twoWayScore || 80
              const twoWayLabel = twoWay >= 90 ? 'ELITE TWO-WAY' : twoWay >= 83 ? 'PLUS TWO-WAY' : 'OFFENSIVE ENGINE'

              return (
                <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-lg flex items-center gap-2">
                        {player.name}
                        <span className="text-[10px] px-2 py-px rounded bg-white/10 text-white/70 font-mono tracking-wider">{archetype}</span>
                      </div>
                      <div className="text-sm text-white/60">{player.team}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-court-orange">{player.projectedPpg}</div>
                      <div className="text-xs text-white/50 -mt-1">PPG</div>
                    </div>
                  </div>

                  {/* Advanced metrics row */}
                  <div className="mb-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                    <div>
                      <span className="text-white/50">Two-Way Score</span>
                      <span className="ml-2 font-bold text-emerald-400">{twoWay}</span>
                      <span className="ml-1.5 text-[10px] text-emerald-400/70">{twoWayLabel}</span>
                    </div>
                    <div>
                      <span className="text-white/50">PER</span>
                      <span className="ml-2 font-mono font-semibold">{player.projectedPER}</span>
                    </div>
                    <div>
                      <span className="text-white/50">VORP</span>
                      <span className="ml-2 font-mono font-semibold">{player.projectedVORP}</span>
                    </div>
                  </div>

                  {/* Classic counting stats still shown for accessibility */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-8 text-white/60">APG</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: `${Math.min(player.projectedApg * 6, 100)}%` }} />
                      </div>
                      <span className="font-mono w-8 text-right">{player.projectedApg}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="w-8 text-white/60">RPG</span>
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-400" style={{ width: `${Math.min(player.projectedRpg * 5, 100)}%` }} />
                      </div>
                      <span className="font-mono w-8 text-right">{player.projectedRpg}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 text-xs text-white/40">
            PER = Player Efficiency Rating (higher is better). VORP = Value Over Replacement Player. Two-Way Score is our internal blend of offense + defense + impact.
          </div>
        </div>
      )}

      {/* DARK HORSES VIEW — now with real Surprise Index */}
      {viewMode === 'darkhorses' && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Dark Horses &amp; Biggest Overperformers</h3>
          <p className="text-white/60 mb-4 text-sm max-w-2xl">
            These teams have the biggest gap between their "pure talent" strength rating and what the adjusted model projects.
            High Surprise Index = they could easily finish 6–9 wins above their base projection.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {darkHorses.map((team, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-start">
                  <div className="font-semibold text-lg">{team.team}</div>
                  <div className="text-xs px-2 py-0.5 bg-emerald-400/10 text-emerald-400 rounded font-mono">
                    +{Math.max(3, Math.round(team.surpriseIndex / 3))} WIN upside
                  </div>
                </div>
                <div className="text-sm text-white/60 mt-1">Base: {team.projectedWins} wins → Adjusted: {team.adjustedWins}</div>
                
                <div className="mt-3 text-sm">
                  Strength: <span className="font-bold text-court-orange">{team.strength}</span> &nbsp;•&nbsp; Continuity: <span className="font-medium">{team.continuityScore}</span>
                </div>
                <div className="insight-text text-white/70 mt-3 border-t border-white/10 pt-3">
                  {getInsight(team.team)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-white/50">
        These are fun, subjective, model-driven predictions. Your mileage may vary. Data last updated: {data.lastUpdated} • Built to teach real advanced stats through play.
      </div>
    </div>
  )
}
