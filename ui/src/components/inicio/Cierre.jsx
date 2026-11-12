import { Link } from 'react-router-dom'
import oso from '../../assets/img/bear-player.webp'
import Reveal from '../Reveal'
import { boton } from '../ui'

export default function Cierre() {
  return (
    <section className="relative overflow-hidden bg-night px-5 py-28 text-center md:py-36">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 mx-auto h-64 max-w-3xl rounded-t-full bg-tangerine/40 blur-3xl" />
      <Reveal className="relative mx-auto max-w-3xl">
        <img src={oso} alt="" className="mx-auto mb-4 h-40 w-auto animate-bob" />
        <h2 className="mb-5 text-[clamp(2.6rem,8vw,5.5rem)] text-paper text-outline">
          La tienda está <span className="text-sun text-outline">por cerrar.</span>
        </h2>
        <p className="mx-auto mb-9 max-w-xl text-lg text-paper/85">
          Crea tu cuenta para guardar tus partidas, sumar puntos y pelear por un lugar en el ranking.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/registro" className={boton('sun')}>
            Crear cuenta
          </Link>
          <span aria-disabled="true" className={boton('ink', 'pointer-events-none opacity-70')}>
            Steam · próximamente
          </span>
        </div>
      </Reveal>
    </section>
  )
}