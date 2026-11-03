import vacio from '../assets/img/empty-state-saved.webp'
import { chip } from './ui'

// Pantalla provisional mientras se maqueta cada página
export default function Pendiente({ titulo }) {
  return (
    <section className="grid min-h-svh place-items-center bg-night px-5 pt-28 pb-16 text-center">
      <div>
        <img src={vacio} alt="" className="mx-auto mb-6 h-48 w-auto animate-bob" />
        <p className={chip}>En diseño</p>
        <h1 className="text-[clamp(2.6rem,7vw,5rem)] text-sun text-outline">{titulo}</h1>
      </div>
    </section>
  )
}