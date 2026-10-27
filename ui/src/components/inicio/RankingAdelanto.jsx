import { Link } from 'react-router-dom'
import medalla1 from '../../assets/svg/medalla-1.svg'
import medalla2 from '../../assets/svg/medalla-2.svg'
import medalla3 from '../../assets/svg/medalla-3.svg'
import { numero, partidasDe, RANKING } from '../../datos/ejemplo'
import Reveal from '../Reveal'
import Titulo from '../Titulo'
import { boton } from '../ui'

const MEDALLAS = [medalla1, medalla2, medalla3]
const columnas = 'grid grid-cols-[48px_1fr_72px_88px] gap-2 px-5'

export default function RankingAdelanto() {
  return (
    <section id="ranking" className="bg-night-2 px-5 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <Titulo etiqueta="Ranking global" resalte="el mejor impostor.">
            Demuestra quién es
          </Titulo>
          <Reveal delay={100}>
            <p className="mb-8 max-w-md text-lg text-paper/85">
              Crea tu cuenta para ver tus estadísticas, tu historial de partidas y tu lugar en el ranking.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/registro" className={boton('sun')}>
                Crear cuenta
              </Link>
              <Link to="/ranking" className={boton('paper')}>
                Ver ranking
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal r={-1.5} className="toon-lg overflow-hidden rounded-3xl bg-paper text-ink">
          <div className={`${columnas} border-b-4 border-ink bg-sun py-3 font-display text-sm tracking-wider uppercase`}>
            <span>#</span>
            <span>Jugador</span>
            <span className="text-right">Parts.</span>
            <span className="text-right">Puntos</span>
          </div>
          {RANKING.slice(0, 5).map((j, i) => (
            <div key={j.id} className={`${columnas} items-center border-b-2 border-ink/15 py-3 font-semibold last:border-0`}>
              <span className="font-display text-xl">
                {i < 3 ? <img src={MEDALLAS[i]} alt={`Puesto ${i + 1}`} className="size-8" /> : i + 1}
              </span>
              <span className="truncate">{j.username}</span>
              <span className="text-right text-ink/70">{partidasDe(j)}</span>
              <span className="text-right font-display text-xl text-tangerine-dark">{numero(j.puntos_totales)}</span>
            </div>
          ))}
          <p className="bg-cream px-5 py-2 text-xs text-ink/60">Datos de ejemplo. El ranking real se conectará al servidor.</p>
        </Reveal>
      </div>
    </section>
  )
}