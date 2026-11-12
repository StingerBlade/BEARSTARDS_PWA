import { Link } from 'react-router-dom'
import vacio from '../assets/img/empty-state-saved.webp'
import { boton, chip } from '../components/ui'

export default function CuentaEliminada() {
  return (
    <section className="grid min-h-svh place-items-center bg-night px-5 pt-28 pb-16 text-center">
      <div>
        <img src={vacio} alt="" className="mx-auto mb-6 h-48 w-auto animate-bob" />
        <p className={chip}>Cuenta eliminada</p>
        <h1 className="mb-4 text-[clamp(2.4rem,6vw,4rem)] text-sun text-outline">Hasta pronto, oso</h1>
        <p className="mx-auto mb-8 max-w-md text-paper/80">
          Borramos tus datos personales y cerramos tus sesiones en el sitio y en el juego. Si algún día quieres volver,
          puedes crear una cuenta nueva.
        </p>
        <Link to="/" className={boton('sun')}>
          Ir al inicio
        </Link>
      </div>
    </section>
  )
}
