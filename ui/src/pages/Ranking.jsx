import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../api/useApi'
import { useSesion } from '../api/useSesion'
import sinJugadores from '../assets/img/empty-state-search.webp'
import EstadoCarga from '../components/EstadoCarga'
import Podio from '../components/ranking/Podio'
import TablaRanking from '../components/ranking/TablaRanking'
import Reveal from '../components/Reveal'
import { boton, chip, input } from '../components/ui'
import { numero } from '../datos/formato'

const aviso = 'mb-5 rounded-2xl border-[3px] border-ink px-5 py-3 font-semibold text-ink shadow-toon-sm'
const enlace = 'underline underline-offset-4'

export default function Ranking() {
  const [busqueda, setBusqueda] = useState('')
  const ranking = useApi('/ranking/')
  const sesion = useSesion()
  const usuario = sesion?.jugador.username ?? null

  const jugadores = ranking.datos ?? []
  const q = busqueda.trim().toLowerCase()
  const filas = jugadores.map((j, i) => ({ ...j, puesto: i + 1 })).filter((j) => j.username.toLowerCase().includes(q))
  const yo = jugadores.findIndex((j) => j.username === usuario)
  const hayDatos = ranking.estado === 'listo' && jugadores.length > 0

  return (
    <div className="min-h-svh bg-night px-5 pt-28 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-10 text-center">
          <p className={chip}>Ranking global</p>
          <h1 className="text-[clamp(2.6rem,7vw,5rem)] text-sun text-outline">Los mejores impostores</h1>
          <p className="mx-auto mt-3 max-w-xl text-paper/80">Top 10 por puntos totales.</p>
        </Reveal>

        {hayDatos && <Podio jugadores={jugadores} />}

        {hayDatos && (
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
        )}

        {yo >= 0 ? (
          <p className={`${aviso} bg-mint`}>
            Vas en el lugar <strong>#{yo + 1}</strong> con {numero(jugadores[yo].puntos_totales)} puntos.{' '}
            <Link to="/panel" className={enlace}>
              Ver mi panel
            </Link>
          </p>
        ) : sesion ? (
          <p className={`${aviso} bg-sky`}>
            Todavía no entras al top 10. ¡A jugar!{' '}
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
          <EstadoCarga consulta={ranking} vacio="Todavía no hay jugadores en el ranking." imagen={sinJugadores} />
          {hayDatos && <TablaRanking filas={filas} usuario={usuario} busqueda={busqueda.trim()} />}
        </Reveal>

        {!sesion && (
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
