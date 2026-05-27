import { useState } from 'react'

export default function DreamTeam({ 
  players, 
  dreamTeam, 
  onAddPlayer, 
  onRemovePlayer, 
  onClearTeam,
  onBattle 
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const availablePlayers = players
    .filter(p => !dreamTeam.some(teamPlayer => teamPlayer.id === p.id))
    .filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.team.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.career.ppg - a.career.ppg)

  const legacyScore = calculateLegacyScore(dreamTeam)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Build Your Dream Team</h1>
        <p className="text-white/60 mt-2 max-w-xl">
          Assemble your ultimate 5-man squad from any era. See their combined Legacy Score.
        </p>
      </div>

      {/* Current Team */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Dream Team ({dreamTeam.length}/5)</h2>
          <div className="flex gap-3">
            <button 
              onClick={onClearTeam}
              disabled={dreamTeam.length === 0}
              className="px-4 py-2 text-sm rounded-full border border-white/20 hover:bg-white/5 disabled:opacity-40"
            >
              Clear Team
            </button>
            <button 
              onClick={onBattle}
              disabled={dreamTeam.length === 0}
              className="px-4 py-2 text-sm rounded-full bg-court-orange text-black font-medium disabled:opacity-40"
            >
              Battle a Random Team
            </button>
          </div>
        </div>

        {/* Legacy Score */}
        {dreamTeam.length > 0 && (
          <div className="mb-4 p-4 bg-white/5 rounded-2xl inline-block">
            <div className="text-sm text-white/60">Legacy Score</div>
            <div className="text-4xl font-bold text-court-orange tabular-nums">{legacyScore}</div>
          </div>
        )}

        {/* Selected Players */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {dreamTeam.length > 0 ? (
            dreamTeam.map((player, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="font-semibold">{player.name}</div>
                <div className="text-sm text-white/60">{player.team} • {player.era}</div>
                <button 
                  onClick={() => onRemovePlayer(player.id)}
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

      {/* Add Players Section */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Add Players to Your Team</h3>
        
        <input
          type="text"
          placeholder="Search players by name or team..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-court-orange"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto pr-2">
          {availablePlayers.length > 0 ? (
            availablePlayers.slice(0, 20).map(player => (
              <div 
                key={player.id} 
                onClick={() => onAddPlayer(player)}
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
              No available players match your search.
            </div>
          )}
        </div>
        
        {availablePlayers.length > 20 && (
          <div className="text-xs text-white/50 mt-2">
            Showing first 20 results. Refine your search to see more.
          </div>
        )}
      </div>
    </div>
  )
}

function calculateLegacyScore(team) {
  if (team.length === 0) return 0

  const baseScore = team.reduce((sum, player) => {
    return sum + (player.career.ppg * 2) + (player.career.rpg * 1.5) + (player.career.apg * 1.5)
  }, 0)

  // Bonus for team diversity (different eras)
  const uniqueEras = new Set(team.map(p => p.era)).size
  const diversityBonus = uniqueEras * 8

  // Bonus for having 5 players
  const fullTeamBonus = team.length === 5 ? 25 : 0

  return Math.round(baseScore + diversityBonus + fullTeamBonus)
}
