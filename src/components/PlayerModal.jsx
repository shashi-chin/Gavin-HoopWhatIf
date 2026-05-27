import React from 'react'

export default function PlayerModal({ player, onClose }) {
  if (!player) return null

  const headshotUrl = `https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="modal bg-deep-navy border border-white/10 rounded-3xl max-w-2xl w-full overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with headshot */}
        <div className="relative h-52 bg-black flex items-center justify-center">
          <img 
            src={headshotUrl} 
            alt={player.name}
            className="h-48 object-contain"
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
          <div className="absolute bottom-4 left-6">
            <div className="text-xs uppercase tracking-[3px] text-white/50">{player.era} • {player.team}</div>
            <div className="text-4xl font-bold tracking-tight">{player.name}</div>
            <div className="text-court-orange font-medium">{player.position} • {player.height}</div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Career Stats */}
          <div>
            <div className="uppercase text-xs tracking-widest text-white/50 mb-3">Career Averages</div>
            <div className="grid grid-cols-3 gap-4">
              <StatBlock label="PPG" value={player.career.ppg} />
              <StatBlock label="RPG" value={player.career.rpg} />
              <StatBlock label="APG" value={player.career.apg} />
            </div>
          </div>

          {/* Peak Stats */}
          <div>
            <div className="uppercase text-xs tracking-widest text-white/50 mb-3">
              Peak Season — {player.peak.season}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBlock label="PPG" value={player.peak.ppg} />
              <StatBlock label="RPG" value={player.peak.rpg} />
              <StatBlock label="APG" value={player.peak.apg} />
            </div>
          </div>

          {/* Fun Fact & Signature */}
          <div className="md:col-span-2 space-y-4 pt-2">
            <div className="bg-white/5 rounded-2xl p-4">
              <div className="text-xs uppercase tracking-widest text-gold mb-1">Fun Fact</div>
              <p className="text-white/90">{player.fun_fact}</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-gold mb-1">Signature Move</div>
                <div className="text-xl font-medium">{player.signature}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4 text-center text-sm text-white/50">
          Click anywhere outside to close • Try adding your own player in <span className="font-mono text-gold">players.json</span>
        </div>
      </div>
    </div>
  )
}

function StatBlock({ label, value }) {
  return (
    <div className="bg-white/5 rounded-2xl p-3 text-center">
      <div className="text-2xl font-semibold tabular-nums text-court-orange">{value}</div>
      <div className="text-[10px] text-white/60 tracking-wider mt-0.5">{label}</div>
    </div>
  )
}
