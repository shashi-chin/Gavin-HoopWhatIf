import { useState, useEffect } from 'react'
import playersData from './data/players.json'
import PlayerCard from './components/PlayerCard'
import PlayerModal from './components/PlayerModal'
import Filters from './components/Filters'
import MatchupSimulator from './components/MatchupSimulator'
import DreamTeam from './components/DreamTeam'

function App() {
  const [activeTab, setActiveTab] = useState('explorer')
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  
  // Explorer filters
  const [filters, setFilters] = useState({ era: 'All', position: 'All', search: '' })

  // Dream Team state with localStorage persistence
  const [dreamTeam, setDreamTeam] = useState(() => {
    const saved = localStorage.getItem('dreamTeam')
    return saved ? JSON.parse(saved) : []
  })

  const [battleResult, setBattleResult] = useState(null)

  // Save dream team to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('dreamTeam', JSON.stringify(dreamTeam))
  }, [dreamTeam])

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

  // Dream Team handlers
  const addToDreamTeam = (player) => {
    if (dreamTeam.length >= 5) {
      alert("Your dream team is full (max 5 players)!")
      return
    }
    if (dreamTeam.some(p => p.id === player.id)) {
      alert("This player is already in your team!")
      return
    }
    setDreamTeam([...dreamTeam, player])
  }

  const removeFromDreamTeam = (playerId) => {
    setDreamTeam(dreamTeam.filter(p => p.id !== playerId))
  }

  const clearDreamTeam = () => {
    setDreamTeam([])
    setBattleResult(null)
  }

  const battleDreamTeam = () => {
    if (dreamTeam.length === 0) return

    // Pick 5 random players not in the team
    const availableOpponents = playersData.filter(p => 
      !dreamTeam.some(teamPlayer => teamPlayer.id === p.id)
    )

    const shuffled = [...availableOpponents].sort(() => 0.5 - Math.random())
    const opponentTeam = shuffled.slice(0, 5)

    // Simple Legacy Score calculation (same logic as in DreamTeam component)
    const teamScore = calculateLegacyScore(dreamTeam)
    const opponentScore = calculateLegacyScore(opponentTeam)

    const result = {
      yourTeam: dreamTeam,
      yourScore: teamScore,
      opponentTeam: opponentTeam,
      opponentScore: opponentScore,
      winner: teamScore > opponentScore ? "You" : "The Opponents",
      margin: Math.abs(teamScore - opponentScore)
    }

    setBattleResult(result)
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
          <DreamTeam 
            players={playersData}
            dreamTeam={dreamTeam}
            onAddPlayer={addToDreamTeam}
            onRemovePlayer={removeFromDreamTeam}
            onClearTeam={clearDreamTeam}
            onBattle={battleDreamTeam}
          />
        )}

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

      {/* Simple Battle Result Modal */}
      {battleResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setBattleResult(null)}>
          <div 
            className="bg-deep-navy border border-white/10 rounded-3xl max-w-2xl w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Dream Team Battle Result</h2>
            
            <div className="grid grid-cols-2 gap-6 text-center mb-6">
              <div>
                <div className="font-semibold text-lg">Your Team</div>
                <div className="text-4xl font-bold text-court-orange mt-2">{battleResult.yourScore}</div>
              </div>
              <div>
                <div className="font-semibold text-lg">Opponents</div>
                <div className="text-4xl font-bold text-white/70 mt-2">{battleResult.opponentScore}</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-xl">
                <span className="font-semibold text-court-orange">{battleResult.winner}</span> won by {battleResult.margin} points!
              </div>
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

export default App
