import { useRef } from 'react'
import render from '../../assets/img/render-menu.webp'
import { boton } from '../ui'

const conMouse = () =>
  window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Portada: el render del juego con una linterna que sigue al mouse
export default function Hero({ irA }) {
  const seccion = useRef(null)
  const imagen = useRef(null)

  function alMover(e) {
    if (!conMouse()) return
    const r = seccion.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    seccion.current.style.setProperty('--mx', `${x}%`)
    seccion.current.style.setProperty('--my', `${y}%`)
    imagen.current.style.transform = `scale(1.06) translate(${(x - 50) * -0.12}px, ${(y - 50) * -0.08}px)`
  }

  return (
    <section
      ref={seccion}
      onPointerMove={alMover}
      aria-label="Little Bearstards"
      className="relative isolate grid min-h-svh items-center overflow-hidden bg-[#150d3a]"
      style={{ '--mx': '50%', '--my': '40%' }}
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          ref={imagen}
          src={render}
          alt=""
          width="1280"
          height="720"
          className="absolute inset-0 size-full scale-[1.06] object-cover object-[center_40%] transition-transform duration-300 ease-out"
        />
      </div>
      {/* La linterna: oscurece todo menos un círculo alrededor del mouse */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(circle 420px at var(--mx) var(--my), rgba(14,8,40,0) 0%, rgba(14,8,40,.18) 42%, rgba(14,8,40,.8) 100%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-24 bg-gradient-to-t from-night to-transparent" />

      <div className="relative z-[3] mx-auto w-full max-w-7xl px-5 pt-32 pb-40 text-center max-sm:pb-56">
        <p className="mb-5 inline-block -rotate-1 rounded-full border-[3px] border-ink bg-sky px-5 py-1.5 font-display text-sm tracking-[0.22em] text-ink uppercase shadow-toon-sm">
          Stealth PvP 1v1 · Deducción social · PC
        </p>
        <h1 className="mb-5 grid justify-items-center">
          <span className="font-display text-[clamp(1.6rem,4vw,3rem)] tracking-[0.35em] text-paper text-outline">LITTLE</span>
          <span className="-rotate-2 font-display text-[clamp(3.2rem,12vw,10rem)] leading-[0.9] text-sun text-outline">
            BEARSTARDS
          </span>
        </h1>
        <p className="mx-auto mb-9 max-w-xl text-[clamp(1.1rem,2.2vw,1.5rem)] font-semibold text-paper drop-shadow-[0_3px_0_var(--color-ink)]">
          Solo un oso será vendido.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button type="button" className={boton('sun')} onClick={() => irA('como-se-juega')}>
            Cómo se juega
          </button>
          <button type="button" className={boton('paper')} onClick={() => irA('armas')}>
            Ver las armas
          </button>
        </div>
        <p className="mx-auto mt-8 w-fit rounded-full bg-ink/70 px-4 py-1.5 text-sm text-paper max-sm:hidden">
          Mueve el mouse: la linterna también busca. Uno de esos osos no es un NPC.
        </p>
      </div>
    </section>
  )
}