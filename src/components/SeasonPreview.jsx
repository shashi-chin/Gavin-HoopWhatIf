import { useState } from 'react'
import seasonData from '../data/season2026.json'

export default function SeasonPreview() {
  const [conference, setConference] = useState('western') // 'western' or 'eastern'
  const [viewMode, setViewMode] = useState('teams') // 'teams' or 'players'

  const standings = conference === 'western' 
    ? seasonData.westernConference 
    : seasonData.easternConference

  const maxWins = Math.max(...standings.map(t => t.projectedWins))

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
          {seasonData.predictedChampion}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Conference Toggle */}
        <div className="flex bg-white/5 rounded-full p-1">
          <button
            onClick={() => setConference('western')}
            className={`px-5 py-2 rounded-full text-sm transition ${
              conference === 'western' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
            }`}
          >
            Western Conference
          </button>
          <button
            onClick={() => setConference('eastern')}
            className={`px-5 py-2 rounded-full text-sm transition ${
              conference === 'eastern' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
            }`}
          >
            Eastern Conference
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex bg-white/5 rounded-full p-1">
          <button
            onClick={() => setViewMode('teams')}
            className={`px-5 py-2 rounded-full text-sm transition ${
              viewMode === 'teams' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
            }`}
          >
            Team Standings
          </button>
          <button
            onClick={() => setViewMode('players')}
            className={`px-5 py-2 rounded-full text-sm transition ${
              viewMode === 'players' ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
            }`}
          >
            Top Players
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'teams' ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Predicted {conference === 'western' ? 'Western' : 'Eastern'} Conference Standings
          </h3>

          <div className="space-y-3">
            {standings.map((team, index) => (
              <div key={index} className="flex items-center gap-4 group">
                <div className="w-8 text-right text-sm text-white/50 font-mono">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline mb-1">
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
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Top Projected Performers 2025-26</h3>
          
          <div className="space-y-3">
            {seasonData.topProjectedPlayers.map((player, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg">{player.name}</div>
                    <div className="text-sm text-white/60">{player.team}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-court-orange">{player.projectedPpg}</div>
                    <div className="text-xs text-white/50">PPG</div>
                  </div>
                </div>
                
                <div className="flex gap-6 mt-3 text-sm">
                  <div>
                    <span className="text-white/60">APG</span> <span className="font-medium">{player.projectedApg}</span>
                  </div>
                  <div>
                    <span className="text-white/60">RPG</span> <span className="font-medium">{player.projectedRpg}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-xs text-white/50">
        These are fun, subjective predictions. Your mileage may vary. Data last updated: {seasonData.lastUpdated}
      </div>
    </div>
  )
}
