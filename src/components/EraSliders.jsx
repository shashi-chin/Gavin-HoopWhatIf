import React from 'react'

export default function EraSliders({ sliders, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...sliders, [key]: parseFloat(value) })
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">
      <div className="text-sm uppercase tracking-[2px] text-white/60 mb-1">Era Environment</div>

      <SliderControl
        label="3-Point Emphasis"
        value={sliders.threePoint}
        min={0.65}
        max={1.35}
        step={0.05}
        onChange={(v) => handleChange('threePoint', v)}
        description="How much the 3-pointer is valued in this version of basketball"
      />

      <SliderControl
        label="Pace of Play"
        value={sliders.pace}
        min={0.85}
        max={1.25}
        step={0.05}
        onChange={(v) => handleChange('pace', v)}
        description="How fast the game is played (more possessions = higher scores)"
      />

      <SliderControl
        label="Physicality"
        value={sliders.physical}
        min={0.80}
        max={1.25}
        step={0.05}
        onChange={(v) => handleChange('physical', v)}
        description="How much contact and defense is rewarded"
      />
    </div>
  )
}

function SliderControl({ label, value, min, max, step, onChange, description }) {
  const percent = Math.round(((value - min) / (max - min)) * 100)

  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <div>{label}</div>
        <div className="font-mono text-court-orange tabular-nums">{value.toFixed(2)}x</div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="era-slider w-full accent-court-orange"
      />
      <div className="text-xs text-white/50 mt-1">{description}</div>
    </div>
  )
}
