import { useState } from 'react'

const FRASES = ['Sigilo', 'Engaño', 'Peluches en guerra', '1 vs 1 en línea', 'Solo uno será vendido']

// Cinta de texto en movimiento, con botón de pausa (WCAG 2.2.2)
export default function Cinta() {
  const [pausada, setPausada] = useState(false)
  // Se repite para que la animación (-50%) no deje huecos
  const frases = [...FRASES, ...FRASES, ...FRASES, ...FRASES]

  return (
    <div className="relative z-10">
      <div aria-hidden="true" className="relative -my-3 -rotate-1 overflow-hidden border-y-4 border-ink bg-sun">
        <div
          className="flex w-max animate-marquee items-center gap-8 py-3"
          style={{ animationPlayState: pausada ? 'paused' : 'running' }}
        >
          {frases.map((f, i) => (
            <span
              key={i}
              className="flex items-center gap-8 font-display text-xl tracking-wide whitespace-nowrap text-ink uppercase"
            >
              {f}
              <span className="size-4 rotate-45 border-[3px] border-ink bg-pink" />
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPausada((p) => !p)}
        aria-pressed={pausada}
        aria-label={pausada ? 'Reanudar la cinta de texto' : 'Pausar la cinta de texto'}
        className="toon-sm absolute top-1/2 right-3.5 z-20 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-paper text-ink"
      >
        {pausada ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
            <path d="M7 4l13 8-13 8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        )}
      </button>
    </div>
  )
}