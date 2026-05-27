import React from 'react'

const ERAS = ['All', '70s-80s', '80s-90s', '90s-00s', '00s-10s', '2010s', 'Current']
const POSITIONS = ['All', 'PG', 'SG', 'SF', 'PF', 'C']

export default function Filters({ filters, onChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <select 
        value={filters.era} 
        onChange={(e) => onChange({ ...filters, era: e.target.value })}
        className="bg-white/5 border border-white/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-court-orange"
      >
        {ERAS.map(era => (
          <option key={era} value={era}>{era}</option>
        ))}
      </select>

      <select 
        value={filters.position} 
        onChange={(e) => onChange({ ...filters, position: e.target.value })}
        className="bg-white/5 border border-white/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-court-orange"
      >
        {POSITIONS.map(pos => (
          <option key={pos} value={pos}>{pos}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search players..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        className="bg-white/5 border border-white/20 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-court-orange min-w-[220px]"
      />
    </div>
  )
}
