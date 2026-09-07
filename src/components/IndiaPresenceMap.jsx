const pins = [
  { id: "noida", label: "Noida", x: 178, y: 88 },
  { id: "pune", label: "Pune", x: 122, y: 218 },
  { id: "bangalore", label: "Bangalore", x: 138, y: 268 },
]

export default function IndiaPresenceMap() {
  return (
    <div className="card-lift relative flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-slate-900/90 p-6 shadow-card hover:border-[#10B981]/50 hover:shadow-card-hover">
      <svg viewBox="0 0 280 340" className="h-auto w-full max-w-[280px]">
        <path
          d="M150 12 L186 22 L198 46 L222 58 L228 84 L214 104 L226 124 L218 150 L232 168 L222 196 L234 214 L210 238 L214 262 L188 276 L182 300 L162 312 L150 296 L130 308 L112 290 L96 296 L88 270 L102 252 L84 232 L92 206 L74 186 L88 160 L78 134 L96 112 L90 86 L112 70 L108 46 L132 34 Z"
          className="fill-[#ECFDF5] dark:fill-emerald-950/40 stroke-[#0D5C3A] dark:stroke-emerald-500"
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
        {pins.map((pin) => (
          <g key={pin.id} className="cursor-pointer transition-transform duration-200 hover:scale-110">
            <circle cx={pin.x} cy={pin.y} r="12" fill="#10B981" opacity="0.15" className="animate-pulse" />
            <circle cx={pin.x} cy={pin.y} r="8" fill="#10B981" opacity="0.3" />
            <circle cx={pin.x} cy={pin.y} r="5" fill="#0D5C3A" stroke="#FFFFFF" strokeWidth="1.5" />
            <text
              x={pin.x}
              y={pin.y - 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              className="font-display fill-[#0F172A] dark:fill-slate-100"
            >
              {pin.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
