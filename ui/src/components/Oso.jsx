// Osito de peluche del diseño. `color` es el pelaje y `mono` le pone moño rosa.
export default function Oso({ color = '#d99a5b', mono = false, className = '' }) {
  return (
    <svg viewBox="0 0 200 262" className={className} aria-hidden="true" strokeLinejoin="round" strokeLinecap="round">
      <g stroke="#1b1030" strokeWidth="6">
        {/* Orejas y patas */}
        <circle cx="48" cy="48" r="27" fill={color} />
        <circle cx="152" cy="48" r="27" fill={color} />
        <circle cx="48" cy="48" r="12" fill="#ff9cc2" strokeWidth="0" />
        <circle cx="152" cy="48" r="12" fill="#ff9cc2" strokeWidth="0" />
        <ellipse cx="66" cy="232" rx="28" ry="21" fill={color} />
        <ellipse cx="134" cy="232" rx="28" ry="21" fill={color} />
        <ellipse cx="66" cy="236" rx="13" ry="9" fill="#f6d9a8" strokeWidth="0" />
        <ellipse cx="134" cy="236" rx="13" ry="9" fill="#f6d9a8" strokeWidth="0" />
        {/* Cuerpo con costura y brazos */}
        <ellipse cx="100" cy="176" rx="58" ry="64" fill={color} />
        <ellipse cx="100" cy="186" rx="36" ry="42" fill="#f6d9a8" strokeWidth="0" />
        <path d="M100 150v72" strokeWidth="3.5" strokeDasharray="7 7" fill="none" />
        <ellipse cx="42" cy="168" rx="20" ry="40" fill={color} transform="rotate(22 42 168)" />
        <ellipse cx="158" cy="168" rx="20" ry="40" fill={color} transform="rotate(-22 158 168)" />
        {/* Cabeza */}
        <circle cx="100" cy="86" r="58" fill={color} />
        <ellipse cx="100" cy="108" rx="27" ry="21" fill="#f6d9a8" />
        <ellipse cx="100" cy="98" rx="10" ry="7" fill="#1b1030" strokeWidth="0" />
        <path d="M100 104v7M100 111q-9 9-18 2M100 111q9 9 18 2" fill="none" strokeWidth="4" />
        <circle cx="76" cy="78" r="10" fill="#1b1030" strokeWidth="0" />
        <circle cx="124" cy="78" r="10" fill="#1b1030" strokeWidth="0" />
        <circle cx="72" cy="74" r="3.6" fill="#fff" strokeWidth="0" />
        <circle cx="120" cy="74" r="3.6" fill="#fff" strokeWidth="0" />
        <ellipse cx="64" cy="102" rx="9" ry="6" fill="#ff9cc2" strokeWidth="0" opacity=".8" />
        <ellipse cx="136" cy="102" rx="9" ry="6" fill="#ff9cc2" strokeWidth="0" opacity=".8" />
        {mono && (
          <g>
            <path d="M100 146 76 134v24zM100 146l24-12v24z" fill="#ff5fa2" />
            <circle cx="100" cy="146" r="7" fill="#ff5fa2" />
          </g>
        )}
      </g>
    </svg>
  )
}