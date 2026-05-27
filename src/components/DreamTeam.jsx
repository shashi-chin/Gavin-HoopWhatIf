import { useState, useEffect } from 'react'

export default function DreamTeam({ players }) {
  // Current team being built (max 5)
  const [currentTeam, setCurrentTeam] = useState([])

  // Saved teams
  const [savedTeams, setSavedTeams] = useState(() => {
    const saved = localStorage.getItem('savedDreamTeams')
    return saved ? JSON.parse(saved) : []
  })

  // Battle result
  const [battleResult, setBattleResult] = useState(null)

  // Search
  const [searchTerm, setSearchTerm] = useState('')

  // Team name for saving
  const [teamName, setTeamName] = useState('')

  // Persist saved teams
  useEffect(() => {
    localStorage.setItem('savedDreamTeams', JSON.stringify(savedTeams))
  }, [savedTeams])

  // Available players (not in current team)
  const availablePlayers = players
    .filter(p => !currentTeam.some(teamPlayer => teamPlayer.id === p.id))
    .filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.career.ppg - a.career.ppg)

  const legacyScore = calculateLegacyScore(currentTeam)

  // Add player to current team
  const addPlayer = (player) => {
    if (currentTeam.length >= 5) {
      alert("Your dream team is full (max 5 players)!")
      return
    }
    if (currentTeam.some(p => p.id === player.id)) return

    setCurrentTeam([...currentTeam, player])
  }

  // Remove player from current team
  const removePlayer = (playerId) => {
    setCurrentTeam(currentTeam.filter(p => p.id !== playerId))
  }

  // Clear current team
  const clearTeam = () => {
    setCurrentTeam([])
    setTeamName('')
    setBattleResult(null)
  }

  // Save current team
  const saveTeam = () => {
    if (currentTeam.length === 0) {
      alert("Your team is empty!")
      return
    }

    const name = teamName.trim() || `Team ${savedTeams.length + 1}`

    const newTeam = {
      id: Date.now(),
      name: name,
      players: [...currentTeam],
      legacyScore: calculateLegacyScore(currentTeam),
      savedAt: new Date().toISOString()
    }

    setSavedTeams([...savedTeams, newTeam])
    setTeamName('')
    alert(`Team "${name}" saved!`)
  }

  // Load a saved team
  const loadTeam = (savedTeam) => {
    setCurrentTeam(savedTeam.players)
    setTeamName(savedTeam.name)
    setBattleResult(null)
  }

  // Delete a saved team
  const deleteTeam = (teamId) => {
    if (confirm("Delete this saved team?")) {
      setSavedTeams(savedTeams.filter(t => t.id !== teamId))
    }
  }

  // Battle against a random team
  const battle = () => {
    if (currentTeam.length === 0) return

    const availableOpponents = players.filter(p =>
      !currentTeam.some(teamPlayer => teamPlayer.id === p.id)
    )

    const shuffled = [...availableOpponents].sort(() => 0.5 - Math.random())
    const opponentTeam = shuffled.slice(0, 5)

    const yourScore = calculateLegacyScore(currentTeam)
    const opponentScore = calculateLegacyScore(opponentTeam)

    const result = {
      yourTeam: currentTeam,
      yourScore,
      opponentTeam,
      opponentScore,
      winner: yourScore > opponentScore ? "You" : "The Opponents",
      margin: Math.abs(yourScore - opponentScore)
    }

    setBattleResult(result)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Build Your Dream Team</h1>
        <p className="text-white/60 mt-2 max-w-xl">
          Assemble your ultimate 5-man squad from any era. Save multiple teams and battle them.
        </p>
      </div>

      {/* Current Team Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Current Team ({currentTeam.length}/5)</h2>
          <div className="flex gap-3">
            <button
              onClick={clearTeam}
              disabled={currentTeam.length === 0}
              className="px-4 py-2 text-sm rounded-full border border-white/20 hover:bg-white/5 disabled:opacity-40"
            >
              Clear
            </button>
            <button
              onClick={battle}
              disabled={currentTeam.length === 0}
              className="px-4 py-2 text-sm rounded-full bg-court-orange text-black font-medium disabled:opacity-40"
            >
              Battle Random Team
            </button>
          </div>
        </div>

        {/* Legacy Score + Save */}
        {currentTeam.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-4">
            <div className="p-4 bg-white/5 rounded-2xl">
              <div className="text-sm text-white/60">Legacy Score</div>
              <div className="text-4xl font-bold text-court-orange tabular-nums">{legacyScore}</div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Team name (optional)"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-sm w-64 focus:outline-none focus:border-court-orange"
              />
              <button
                onClick={saveTeam}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-sm font-medium"
              >
                Save Team
              </button>
            </div>
          </div>
        )}

        {/* Current Team Players */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {currentTeam.length > 0 ? (
            currentTeam.map((player, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="font-semibold">{player.name}</div>
                <div className="text-sm text-white/60">{player.team} • {player.era}</div>
                <button
                  onClick={() => removePlayer(player.id)}
                  className="mt-3 text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-white/50 py-8 text-center border border-white/10 rounded-2xl">
              Your dream team is empty. Add players below.
            </div>
          )}
        </div>
      </div>

      {/* Saved Teams */}
      {savedTeams.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3">Saved Teams ({savedTeams.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {savedTeams.map((team) => (
              <div key={team.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="font-medium">{team.name}</div>
                <div className="text-sm text-court-orange">Legacy Score: {team.legacyScore}</div>
                <div className="text-xs text-white/50 mt-1">
                  {team.players.length} players • {new Date(team.savedAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => loadTeam(team)}
                    className="text-xs px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deleteTeam(team.id)}
                    className="text-xs px-3 py-1 rounded text-red-400 hover:bg-white/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Players */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Add Players</h3>

        <input
          type="text"
          placeholder="Search players by name or team..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-court-orange"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto pr-2">
          {availablePlayers.length > 0 ? (
            availablePlayers.slice(0, 25).map(player => (
              <div
                key={player.id}
                onClick={() => addPlayer(player)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 cursor-pointer transition"
              >
                <div className="font-medium">{player.name}</div>
                <div className="text-xs text-white/60">{player.team} • {player.era}</div>
                <div className="text-xs mt-1 text-court-orange">
                  {player.career.ppg} PPG
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-white/50 py-4">
              No players available to add.
            </div>
          )}
        </div>
      </div>

      {/* Battle Result Modal */}
      {battleResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setBattleResult(null)}>
          <div
            className="bg-deep-navy border border-white/10 rounded-3xl max-w-4xl w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Dream Team Battle</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Your Team */}
              <div>
                <div className="text-center mb-4">
                  <div className="text-xl font-semibold">Your Team</div>
                  <div className="text-5xl font-bold text-court-orange mt-1">{battleResult.yourScore}</div>
                </div>
                <div className="space-y-2">
                  {battleResult.yourTeam.map((p, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-sm">
                      {p.name} <span className="text-white/50">({p.era})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Opponent Team */}
              <div>
                <div className="text-center mb-4">
                  <div className="text-xl font-semibold">Opponents</div>
                  <div className="text-5xl font-bold text-white/70 mt-1">{battleResult.opponentScore}</div>
                </div>
                <div className="space-y-2">
                  {battleResult.opponentTeam.map((p, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 text-sm">
                      {p.name} <span className="text-white/50">({p.era})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center text-xl mb-6">
              <span className="font-semibold text-court-orange">{battleResult.winner}</span> won by {battleResult.margin} points!
            </div>

            <button
              onClick={() => setBattleResult(null)}
              className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function calculateLegacyScore(team) {
  if (team.length === 0) return 0

  const baseScore = team.reduce((sum, player) => {
    return sum + (player.career.ppg * 2) + (player.career.rpg * 1.5) + (player.career.apg * 1.5)
  }, 0)

  const uniqueEras = new Set(team.map(p => p.era)).size
  const diversityBonus = uniqueEras * 8
  const fullTeamBonus = team.length === 5 ? 25 : 0

  return Math.round(baseScore + diversityBonus + fullTeamBonus)
}
