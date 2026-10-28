import medalla1 from '../../assets/svg/medalla-1.svg'
import medalla2 from '../../assets/svg/medalla-2.svg'
import medalla3 from '../../assets/svg/medalla-3.svg'
import { numero } from '../../datos/ejemplo'
import Oso from '../Oso'
import Reveal from '../Reveal'

// Orden visual: 2.º a la izquierda, 1.º al centro (más alto) y 3.º a la derecha
const ESCALONES = [
  { puesto: 2, medalla: medalla2, fondo: 'bg-sky', alto: 'h-44', oso: '#d99a5b' },
  { puesto: 1, medalla: medalla1, fondo: 'bg-sun', alto: 'h-56', oso: '#7fc8ff', mono: true },
  { puesto: 3, medalla: medalla3, fondo: 'bg-pink', alto: 'h-36', oso: '#ffb86b' },
]

export default function Podio({ jugadores }) {
  return (
    <ol aria-label="Podio" className="mb-12 grid grid-cols-3 items-end gap-3 sm:gap-6">
      {ESCALONES.map((e, i) => {
        const j = jugadores[e.puesto - 1]
        if (!j) return <li key={e.puesto} />
        return (
          <Reveal as="li" key={e.puesto} delay={i * 100} className="text-center">
            <Oso color={e.oso} mono={e.mono} className="mx-auto mb-2 h-24 w-auto sm:h-36" />
            <div className={`toon flex flex-col items-center justify-start rounded-t-3xl px-1.5 py-3 text-ink sm:p-3 ${e.fondo} ${e.alto}`}>
              <img src={e.medalla} alt={`Puesto ${e.puesto}`} className="size-14 sm:size-16" />
              <strong title={j.username} className="max-w-full truncate font-display text-xs sm:text-2xl">
                {j.username}
              </strong>
              <span className="font-display text-xl">{numero(j.puntos_totales)}</span>
            </div>
          </Reveal>
        )
      })}
    </ol>
  )
}