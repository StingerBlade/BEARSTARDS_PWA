import { useState } from 'react'
import { Link } from 'react-router-dom'
import Podio from '../components/ranking/Podio'
import TablaRanking from '../components/ranking/TablaRanking'
import Reveal from '../components/Reveal'
import { boton, chip, input } from '../components/ui'
import { numero, RANKING } from '../datos/ejemplo'

const aviso = 'mb-5 rounded-2xl border-[3px] border-ink px-5 py-3 font-semibold text-ink shadow-toon-sm'
const enlace = 'underline underline-offset-4'

// Por ahora sin sesión. Al conectar la API vendrá del usuario que inició sesión.
const usuario = null

export default function Ranking() {
  const [busqueda, setBusqueda] = useState('')

  const q = busqueda.trim().toLowerCase()
  const filas = RANKING.map((j, i) => ({ ...j, puesto: i + 1 })).filter((j) => j.username.toLowerCase().includes(q))
  const yo = RANKING.findIndex((j) => j.username === usuario)

  return (
    <div className="min-h-svh bg-night px-5 pt-28 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-10 text-center">
          <p className={chip}>Ranking global</p>
          <h1 className="text-[clamp(2.6rem,7vw,5rem)] text-sun text-outline">Los mejores impostores</h1>
          <p className="mx-auto mt-3 max-w-xl text-paper/80">Datos de ejemplo. El ranking real se conectará al servidor.</p>
        </Reveal>

        <Podio jugadores={RANKING} />

        <div className="mb-5 flex flex-wrap items-center gap-4">
          <label className="sr-only" htmlFor="buscar">
            Buscar jugador
          </label>
          <input
            id="buscar"
            type="search"
            placeholder="Buscar jugador…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className={`${input} max-w-xs`}
          />
          <p aria-live="polite" className="font-semibold text-paper/80">
            {filas.length} {filas.length === 1 ? 'jugador' : 'jugadores'}
          </p>
        </div>

        {yo >= 0 ? (
          <p className={`${aviso} bg-mint`}>
            Vas en el lugar <strong>#{yo + 1}</strong> con {numero(RANKING[yo].puntos_totales)} puntos.{' '}
            <Link to="/panel" className={enlace}>
              Ver mi panel
            </Link>
          </p>
        ) : (
          <p className={`${aviso} bg-sky`}>
            <Link to="/login" className={enlace}>
              Inicia sesión
            </Link>{' '}
            o{' '}
            <Link to="/registro" className={enlace}>
              crea una cuenta
            </Link>{' '}
            para ver tu posición.
          </p>
        )}

        <Reveal className="toon-lg overflow-hidden rounded-[2rem] bg-paper text-ink">
          <TablaRanking filas={filas} usuario={usuario} busqueda={busqueda.trim()} />
        </Reveal>

        {yo < 0 && (
          <div className="mt-10 text-center">
            <Link to="/registro" className={boton('sun')}>
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}