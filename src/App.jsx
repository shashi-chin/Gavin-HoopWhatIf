import { useState } from 'react'
import playersData from './data/players.json'
import PlayerCard from './components/PlayerCard'
import PlayerModal from './components/PlayerModal'
import Filters from './components/Filters'
import MatchupSimulator from './components/MatchupSimulator'
import DreamTeam from './components/DreamTeam'
import SeasonPreview from './components/SeasonPreview'

function App() {
  // Check if there's a shared scenario in the URL hash.
  // If yes, we should open directly in the Season Preview tab.
  const hasScenarioHash = typeof window !== 'undefined' && 
                          window.location.hash.startsWith('#scenario=');

  const [activeTab, setActiveTab] = useState(hasScenarioHash ? 'season' : 'explorer')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  
  // Explorer filters
  const [filters, setFilters] = useState({ era: 'All', position: 'All', search: '' })

  // Filter players for the Explorer
  const filteredPlayers = playersData
    .filter(p => {
      const matchesEra = filters.era === 'All' || p.era === filters.era
      const matchesPos = filters.position === 'All' || p.position === filters.position
      const matchesSearch = !filters.search || 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.team.toLowerCase().includes(filters.search.toLowerCase())
      return matchesEra && matchesPos && matchesSearch
    })
    .sort((a, b) => b.career.ppg - a.career.ppg)

  return (
    <div className="min-h-screen bg-deep-navy text-white court-bg">
      {/* Header */}
      <header className="border-b border-white/10 bg-deep-navy/95 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-court-orange flex items-center justify-center">
              <span className="text-xl font-bold">🏀</span>
            </div>
            <div>
              <div className="font-bold text-2xl tracking-tight">HoopWhatIf</div>
              <div className="text-[10px] text-white/50 -mt-1">NBA WHAT-IF LAB</div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <button 
              onClick={() => setActiveTab('explorer')}
              className={`px-4 py-2 rounded-full transition ${activeTab === 'explorer' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              Explore Players
            </button>
            <button 
              onClick={() => setActiveTab('matchup')}
              className={`px-4 py-2 rounded-full transition ${activeTab === 'matchup' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              Matchup Simulator
            </button>
            <button 
              onClick={() => setActiveTab('dreamteam')}
              className={`px-4 py-2 rounded-full transition ${activeTab === 'dreamteam' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              Dream Team
            </button>
            <button 
              onClick={() => setActiveTab('season')}
              className={`px-4 py-2 rounded-full transition ${activeTab === 'season' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              2025-26 Season
            </button>
            <button 
              onClick={() => setActiveTab('remix')}
              className={`px-4 py-2 rounded-full transition text-gold ${activeTab === 'remix' ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              Your Turn
            </button>
          </div>

          <div className="text-xs text-white/40 hidden md:block">
            Made for the next generation of builders
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'explorer' && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight">Player Explorer</h1>
              <p className="text-white/60 mt-2 max-w-xl">
                Browse legends and current stars across different eras. Click any card for deep stats and fun facts.
              </p>
            </div>

            <Filters filters={filters} onChange={setFilters} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(player => (
                  <PlayerCard 
                    key={player.id + player.name} 
                    player={player} 
                    onClick={setSelectedPlayer} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-white/50">
                  No players match your filters. Try clearing them.
                </div>
              )}
            </div>

            <div className="mt-8 text-xs text-white/40 text-center">
              {filteredPlayers.length} players shown • Want to add your favorite player? Open <span className="font-mono text-gold">src/data/players.json</span>
            </div>
          </div>
        )}

        {activeTab === 'matchup' && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight">Matchup Simulator</h1>
              <p className="text-white/60 mt-2 max-w-xl">
                Pick any two players from different eras. Tweak the sliders to change how the game is played. 
                This is where the real arguments begin.
              </p>
            </div>

            <MatchupSimulator />
          </div>
        )}

        {activeTab === 'dreamteam' && (
          <DreamTeam players={playersData} />
        )}

        {activeTab === 'season' && <SeasonPreview />}

        {activeTab === 'remix' && (
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold tracking-tight text-gold">Your Turn — Remix This</h1>
              <p className="text-white/60 mt-2 max-w-2xl">
                This project was built so you can make it yours. Here are concrete challenges to start changing the game.
              </p>
            </div>

            <div className="text-white/50 text-center py-20 border border-white/10 rounded-2xl">
              Remix challenges coming in Phase 4...
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        HoopWhatIf • Built as a starting point for the next generation of NBA coders
      </footer>

      {/* Player Detail Modal */}
      <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  )
}

export default App
