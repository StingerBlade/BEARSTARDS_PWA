// Iconos pequeños de los formularios
export function Ojo({ tachado = false }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" className="size-6">
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {tachado && <path d="M3 3l18 18" />}
    </svg>
  )
}

export function Alerta() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px] shrink-0">
      <circle cx="12" cy="12" r="10" fill="#b3122a" />
      <path d="M12 7v6" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.6" fill="#fff" />
    </svg>
  )
}

export function Reloj() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[26px] shrink-0">
      <circle cx="12" cy="12" r="10" fill="#fffaf0" stroke="#1b1030" strokeWidth="2.5" />
      <path d="M12 6v6l4 2" fill="none" stroke="#1b1030" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function SinWifi() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[26px] shrink-0">
      <path d="M3 9.5a13 13 0 0118 0M6 13a8 8 0 0112 0M9 16.5a4 4 0 016 0" fill="none" stroke="#1b1030" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="20" r="1.6" fill="#1b1030" />
      <path d="M4 4l16 16" stroke="#b3122a" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}