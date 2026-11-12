import { Link, useNavigate } from 'react-router-dom'
import { cerrarSesion } from '../api/cliente'
import { useApi } from '../api/useApi'
import { useSesion } from '../api/useSesion'
import sinPartidas from '../assets/img/empty-state-saved.webp'
import EstadoCarga from '../components/EstadoCarga'
import EliminarCuenta from '../components/cuenta/EliminarCuenta'
import Reveal from '../components/Reveal'
import { boton, chip } from '../components/ui'
import { fecha, numero } from '../datos/formato'

const RESULTADOS = {
  victoria: { texto: 'Victoria', color: 'bg-mint' },
  derrota: { texto: 'Derrota', color: 'bg-pink' },
  empate: { texto: 'Empate', color: 'bg-sun' },
}

function Stats({ yo }) {
  const tarjetas = [
    { texto: 'Puntos totales', valor: numero(yo.puntos_totales), color: 'bg-sun', ancho: 'col-span-2' },
    { texto: 'Mejor puntuación', valor: numero(yo.mejor_puntuacion), color: 'bg-tangerine' },
    { texto: 'Partidas', valor: yo.partidas, color: 'bg-sky' },
    { texto: 'Victorias', valor: yo.victorias, color: 'bg-mint' },
    { texto: 'Derrotas', valor: yo.derrotas, color: 'bg-pink' },
    { texto: 'Empates', valor: yo.empates, color: 'bg-paper' },
    { texto: 'Kills', valor: yo.kills, color: 'bg-[#c9a1ff]' },
  ]
  return (
    <ul className="mb-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {tarjetas.map((t, i) => (
        <Reveal
          as="li"
          key={t.texto}
          delay={i * 60}
          className={`toon-sm rounded-2xl p-5 text-center text-ink ${t.color} ${t.ancho ?? ''}`}
        >
          <strong className="block font-display text-4xl sm:text-5xl">{t.valor}</strong>
          <span className="font-semibold tracking-wider uppercase">{t.texto}</span>
        </Reveal>
      ))}
    </ul>
  )
}

function Historial({ consulta }) {
  return (
    <Reveal className="toon-lg overflow-hidden rounded-[2rem] bg-paper text-ink">
      <EstadoCarga consulta={consulta} vacio="Todavía no juegas ninguna partida." imagen={sinPartidas} />
      {consulta.estado === 'listo' && consulta.datos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <caption className="sr-only">Tus últimas 20 partidas</caption>
            <thead>
              <tr className="border-b-4 border-ink bg-sun font-display text-sm tracking-wider uppercase">
                <th scope="col" className="px-4 py-3 sm:px-6">Fecha</th>
                <th scope="col" className="px-3 py-3">Resultado</th>
                <th scope="col" className="px-3 py-3 text-right">Kills</th>
                <th scope="col" className="px-4 py-3 text-right sm:px-6">Puntos</th>
              </tr>
            </thead>
            <tbody>
              {consulta.datos.map((p) => {
                const r = RESULTADOS[p.resultado]
                return (
                  <tr key={p.fecha + p.resultado} className="border-t-2 border-ink/10 font-semibold">
                    <td className="px-4 py-3 text-ink/80 sm:px-6">{fecha(p.fecha)}</td>
                    <td className="px-3 py-3">
                      <span className={`rounded-full border-2 border-ink px-3 py-0.5 text-sm ${r?.color ?? 'bg-cream'}`}>
                        {r?.texto ?? p.resultado}
                      </span>
                      {p.abandono && <span className="ml-2 text-sm text-ink/60">(abandonaste)</span>}
                    </td>
                    <td className="px-3 py-3 text-right text-ink/70">{p.kills}</td>
                    <td className="px-4 py-3 text-right font-display text-xl text-tangerine-dark sm:px-6">
                      {numero(p.puntos)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Reveal>
  )
}

function SinSesion() {
  return (
    <section className="grid min-h-svh place-items-center bg-night px-5 pt-28 pb-16 text-center">
      <div>
        <img src={sinPartidas} alt="" className="mx-auto mb-6 h-48 w-auto animate-bob" />
        <p className={chip}>Mi panel</p>
        <h1 className="mb-4 text-[clamp(2.4rem,6vw,4rem)] text-sun text-outline">Inicia sesión para verlo</h1>
        <p className="mx-auto mb-8 max-w-md text-paper/80">Aquí verás tus estadísticas y tus últimas partidas.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/login" className={boton('sun')}>
            Iniciar sesión
          </Link>
          <Link to="/registro" className={boton('paper')}>
            Crear cuenta
          </Link>
        </div>
      </div>
    </section>
  )
}

function Contenido() {
  const navigate = useNavigate()
  const yo = useApi('/yo/')
  const partidas = useApi('/yo/partidas/')

  async function salir() {
    await cerrarSesion()
    navigate('/')
  }

  return (
    <div className="min-h-svh bg-night px-5 pt-28 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className={chip}>Mi panel</p>
            <h1 className="text-[clamp(2.6rem,7vw,5rem)] break-all text-sun text-outline">
              {yo.datos?.username ?? 'Tu oso'}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/ranking" className={boton('paper', 'px-5 py-2 text-base')}>
              Ver ranking
            </Link>
            <button type="button" onClick={salir} className={boton('ink', 'px-5 py-2 text-base')}>
              Cerrar sesión
            </button>
          </div>
        </Reveal>

        {yo.estado === 'listo' ? (
          <Stats yo={yo.datos} />
        ) : (
          <div className="toon mb-12 rounded-3xl bg-paper text-ink">
            <EstadoCarga consulta={yo} vacio="" />
          </div>
        )}

        <h2 className="mb-6 text-[clamp(1.8rem,4vw,2.8rem)] text-paper text-outline">
          Tus últimas <span className="text-sun text-outline">partidas.</span>
        </h2>
        <Historial consulta={partidas} />

        <EliminarCuenta />
      </div>
    </div>
  )
}

// Sin sesión invita a entrar. Si el token vence, la API responde 401, se borra
// la sesión y esta pantalla vuelve a la invitación sola.
export default function Panel() {
  const sesion = useSesion()
  if (!sesion) return <SinSesion />
  return <Contenido key={sesion.token} />
}
