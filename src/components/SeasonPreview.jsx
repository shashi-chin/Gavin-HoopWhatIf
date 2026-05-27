import { useState } from 'react'
import { useSeasonData } from '../hooks/useSeasonData'

export default function SeasonPreview() {
  const { data, loading, error } = useSeasonData()

  const [conference, setConference] = useState('western')
  const [viewMode, setViewMode] = useState('teams')
  const [selectedTeam, setSelectedTeam] = useState(null)

  if (loading) {
    return <div className="text-center py-20 text-white/60">Loading season predictions...</div>
  }

  if (error) {
    return <div className="text-center py-20 text-red-400">Error loading data.</div>
  }

  const standings = conference === 'western' 
    ? data.westernConference 
    : data.easternConference

  const maxWins = Math.max(...standings.map(t => t.projectedWins))

  // Simple dark horse calculation (high strength relative to projected wins rank)
  const darkHorses = [...standings]
    .sort((a, b) => b.strength - a.strength)
    .slice(6, 9)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">2025-26 Season Preview</h1>
        <p className="text-white/60 mt-2 max-w-2xl">
          Our (completely subjective) predictions for the upcoming NBA season. 
          Toggle between conferences and views to explore.
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
            onClick={() => { setConference('western'); setSelectedTeam(null); }}
            className={`px-5 py-2 rounded-full text-sm transition ${conference === 'western' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
          >
            Western
          </button>
          <button
            onClick={() => { setConference('eastern'); setSelectedTeam(null); }}
            className={`px-5 py-2 rounded-full text-sm transition ${conference === 'eastern' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'}`}
          >
            Eastern
          </button>
        </div>

        <div className="flex bg-white/5 rounded-full p-1">
          <button
            onClick={() => { setViewMode('teams'); setSelectedTeam(null); }}
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

      {/* TEAM STANDINGS VIEW */}
      {viewMode === 'teams' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Predicted {conference === 'western' ? 'Western' : 'Eastern'} Conference Standings
          </h3>

          <div className="space-y-2.5">
            {standings.map((team, index) => {
              const isSelected = selectedTeam?.team === team.team
              return (
                <div 
                  key={index} 
                  onClick={() => setSelectedTeam(isSelected ? null : team)}
                  className={`flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl transition ${isSelected ? 'bg-white/5' : 'hover:bg-white/5'}`}
                >
                  <div className="w-8 text-right text-sm text-white/50 font-mono">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="font-medium">{team.team}</span>
                      <span className="text-sm text-white/60 font-mono">{team.projectedWins} wins</span>
                    </div>
                    <div className="h-6 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-court-orange transition-all duration-500 rounded-full"
                        style={{ width: `${(team.projectedWins / maxWins) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm text-white/50 font-mono">
                    {team.strength}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected Team Details */}
          {selectedTeam && (
            <div className="mt-6 p-5 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="font-semibold text-lg mb-2">{selectedTeam.team}</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-white/60">Projected Wins</div>
                  <div className="text-2xl font-bold text-court-orange">{selectedTeam.projectedWins}</div>
                </div>
                <div>
                  <div className="text-white/60">Strength Rating</div>
                  <div className="text-2xl font-bold">{selectedTeam.strength}</div>
                </div>
                <div>
                  <div className="text-white/60">Playoff Odds</div>
                  <div className="text-2xl font-bold">{selectedTeam.strength > 70 ? 'High' : selectedTeam.strength > 55 ? 'Medium' : 'Low'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TOP PLAYERS VIEW */}
      {viewMode === 'players' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Top Projected Performers 2025-26</h3>
          
          <div className="space-y-3">
            {data.topProjectedPlayers.map((player, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-lg">{player.name}</div>
                    <div className="text-sm text-white/60">{player.team}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-court-orange">{player.projectedPpg}</div>
                    <div className="text-xs text-white/50 -mt-1">PPG</div>
                  </div>
                </div>

                {/* Mini stat bars */}
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
            ))}
          </div>
        </div>
      )}

      {/* DARK HORSES VIEW */}
      {viewMode === 'darkhorses' && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Dark Horses & Surprises</h3>
          <p className="text-white/60 mb-4 text-sm">Teams we think could overperform expectations.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {darkHorses.map((team, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="font-semibold text-lg">{team.team}</div>
                <div className="text-sm text-white/60 mt-1">Projected: {team.projectedWins} wins</div>
                <div className="mt-3 text-sm">
                  Strength Rating: <span className="font-bold text-court-orange">{team.strength}</span>
                </div>
                <div className="text-xs text-white/50 mt-2">
                  We think they could surprise a lot of people this year.
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-white/50">
        These are fun, subjective predictions. Your mileage may vary. Data last updated: {data.lastUpdated}
      </div>
    </div>
  )
}
