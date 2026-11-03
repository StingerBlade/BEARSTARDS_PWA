import logo from '../../assets/img/turbo-claro.webp'
import Ola from '../Ola'
import Reveal from '../Reveal'
import Titulo from '../Titulo'

const EQUIPO = [
  { iniciales: 'GM', nombre: 'Guillermo Martínez', rol: 'Product Owner · App móvil', color: 'bg-pink' },
  { iniciales: 'AA', nombre: 'Angel Arras', rol: 'Scrum Master · Front de la PWA', color: 'bg-sky' },
  { iniciales: 'VH', nombre: 'Victor Hugo Baeza', rol: 'Arte 3D y animación', color: 'bg-mint' },
  { iniciales: 'GG', nombre: 'Angel Guillermo González', rol: 'Gameplay y backend', color: 'bg-sun' },
  { iniciales: 'DM', nombre: 'Dylan Muñoz', rol: 'Red e integración', color: 'bg-tangerine' },
  { iniciales: 'JC', nombre: 'Jesús Castilla', rol: 'IA de NPC y app móvil', color: 'bg-pink' },
]

export default function Equipo() {
  return (
    <section id="equipo" className="relative bg-cream px-5 py-24 text-ink md:py-32">
      <Ola />
      <div className="mx-auto max-w-6xl pt-8">
        <Reveal>
          <img src={logo} alt="Turbo Studios" width="660" height="196" className="mb-10 h-24 w-auto" />
        </Reveal>
        <Titulo etiqueta="El estudio" resalte="Turbo Studios." claro>
          Hecho por
        </Titulo>
        <Reveal>
          <p className="mb-12 max-w-2xl text-lg text-ink/80">
            Seis estudiantes de Tecnologías de la Información de la Universidad Tecnológica de Chihuahua. Little
            Bearstards es nuestro proyecto integrador.
          </p>
        </Reveal>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EQUIPO.map((p, i) => (
            <Reveal
              as="li"
              key={p.nombre}
              r={i % 2 ? 1 : -1}
              delay={i * 70}
              className="toon flex items-center gap-4 rounded-2xl bg-white p-4"
            >
              <span className={`toon-sm grid size-14 shrink-0 place-items-center rounded-full font-display text-xl ${p.color}`}>
                {p.iniciales}
              </span>
              <span>
                <strong className="block font-display text-xl leading-tight">{p.nombre}</strong>
                <small className="text-ink/65">{p.rol}</small>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
      <Ola abajo />
    </section>
  )
}