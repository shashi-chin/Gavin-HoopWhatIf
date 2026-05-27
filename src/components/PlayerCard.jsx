import React from 'react'

export default function PlayerCard({ player, onClick }) {
  const headshotUrl = `https://cdn.nba.com/headshots/nba/latest/260x190/${player.id}.png`

  return (
    <div 
      onClick={() => onClick(player)}
      className="player-card bg-white/5 border border-white/10 rounded-2xl p-4 cursor-pointer hover:border-court-orange/60 group"
    >
      <div className="relative aspect-[260/190] bg-deep-navy rounded-xl overflow-hidden mb-4">
        <img 
          src={headshotUrl} 
          alt={player.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.innerHTML = `
              <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-court-orange/20 to-gold/10">
                <div class="text-center">
                  <div class="text-4xl mb-1">🏀</div>
                  <div class="text-xs text-white/70">${player.name.split(' ').pop()}</div>
                </div>
              </div>
            `
          }}
        />
        <div className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium bg-black/70 rounded">
          {player.era}
        </div>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold text-lg leading-tight">{player.name}</div>
          <div className="text-sm text-white/60">{player.team} • {player.position}</div>
        </div>
        <div className="text-right text-sm">
          <div className="font-mono text-court-orange">{player.career.ppg}</div>
          <div className="text-[10px] text-white/50">PPG</div>
        </div>
      </div>
    </div>
  )
}
