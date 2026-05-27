import React, { useState } from 'react'
import players from '../data/players.json'
import { simulateMatchup } from '../utils/simulation'
import EraSliders from './EraSliders'

const defaultSliders = {
  threePoint: 1.0,
  pace: 1.0,
  physical: 1.0,
}

export default function MatchupSimulator() {
  const [player1, setPlayer1] = useState(null)
  const [player2, setPlayer2] = useState(null)
  const [sliders, setSliders] = useState(defaultSliders)
  const [result, setResult] = useState(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const runSimulation = () => {
    if (!player1 || !player2) return

    setIsSimulating(true)
    setResult(null)

    // Add a realistic "computing" delay
    setTimeout(() => {
      const simResult = simulateMatchup(player1, player2, sliders)
      setResult(simResult)
      setIsSimulating(false)
    }, 1250) // 1.25 seconds feels realistic
  }

  const reset = () => {
    setPlayer1(null)
    setPlayer2(null)
    setResult(null)
    setSliders(defaultSliders)
  }

  const PlayerSelector = ({ player, onSelect, label }) => (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="text-xs uppercase tracking-widest text-white/50 mb-2">{label}</div>
      {player ? (
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold">{player.name}</div>
            <div className="text-sm text-white/60">{player.era} • {player.team}</div>
          </div>
          <button 
            onClick={() => onSelect(null)} 
            className="text-xs text-white/60 hover:text-white"
          >
            Change
          </button>
        </div>
      ) : (
        <select 
          className="w-full bg-deep-navy border border-white/20 rounded-xl px-3 py-2 text-sm"
          onChange={(e) => {
            const selected = players.find(p => p.id === parseInt(e.target.value))
            onSelect(selected)
          }}
          defaultValue=""
        >
          <option value="" disabled>Select a player...</option>
          {players
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(p => (
              <option key={p.id + p.name} value={p.id}>{p.name} ({p.era})</option>
            ))}
        </select>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <PlayerSelector 
          player={player1} 
          onSelect={setPlayer1} 
          label="PLAYER 1" 
        />
        <PlayerSelector 
          player={player2} 
          onSelect={setPlayer2} 
          label="PLAYER 2" 
        />
      </div>

      <EraSliders sliders={sliders} onChange={setSliders} />

      <div className="flex gap-3 mt-6">
        <button
          onClick={runSimulation}
          disabled={!player1 || !player2 || isSimulating}
          className="flex-1 py-3.5 rounded-2xl bg-court-orange text-black font-semibold text-lg disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.985] transition flex items-center justify-center gap-2"
        >
          {isSimulating ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full"></span>
              Simulating...
            </>
          ) : (
            "Simulate Matchup"
          )}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3.5 rounded-2xl border border-white/20 hover:bg-white/5"
        >
          Reset
        </button>
      </div>

      {/* Result Panel */}
      {result && !isSimulating && (
        <div className="mt-8 bg-white/5 border border-white/10 rounded-3xl p-6 animate-[fadeIn_0.4s_ease]">
          <div className="text-center mb-6">
            <div className="uppercase text-xs tracking-[3px] text-white/50 mb-1">Simulation Result</div>
            <div className="text-3xl font-bold">
              <span className={result.winner === player1?.name ? 'text-court-orange' : ''}>{player1?.name}</span>
              <span className="text-white/40 mx-2">vs</span>
              <span className={result.winner === player2?.name ? 'text-court-orange' : ''}>{player2?.name}</span>
            </div>
          </div>

          <div className="flex justify-center items-center gap-8 text-5xl font-mono tabular-nums mb-6">
            <div className={result.winner === player1?.name ? 'text-court-orange' : 'text-white/40'}>
              {result.score1}
            </div>
            <div className="text-white/20 text-2xl">—</div>
            <div className={result.winner === player2?.name ? 'text-court-orange' : 'text-white/40'}>
              {result.score2}
            </div>
          </div>

          <div className="max-w-md mx-auto text-center">
            <div className="text-lg text-white/90 mb-4">{result.explanation}</div>

            <details className="text-left text-xs bg-black/30 rounded-xl p-4">
              <summary className="cursor-pointer text-white/70 hover:text-white">
                Why did this happen? (Show the math)
              </summary>
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-white/60 font-mono">
                <div>{player1?.name} offense:</div><div>{result.details.effectiveOff1}</div>
                <div>{player2?.name} offense:</div><div>{result.details.effectiveOff2}</div>
                <div>{player1?.name} defense:</div><div>{result.details.effectiveDef1}</div>
                <div>{player2?.name} defense:</div><div>{result.details.effectiveDef2}</div>
              </div>
              <div className="mt-3 text-white/50">
                Tip: Change the sliders above and run the simulation again. The numbers will shift!
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}
