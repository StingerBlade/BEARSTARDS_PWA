import aguja from '../../assets/svg/aguja.svg'
import casco from '../../assets/svg/casco.svg'
import pistola from '../../assets/svg/pistola.svg'
import rolloHilo from '../../assets/svg/rollo-hilo.svg'
import Reveal from '../Reveal'
import Titulo from '../Titulo'

const ARMAS = [
  {
    imagen: aguja,
    alt: 'Aguja de coser con hilo',
    color: 'bg-pink',
    etiqueta: 'Cuerpo a cuerpo',
    titulo: 'Aguja de coser',
    texto: 'Tu arma básica. Fina, fácil de esconder entre los demás peluches y siempre a la mano. Exige acercarse al rival sin que te descubra.',
    datos: ['Siempre disponible', 'Muy discreta', 'Un golpe a la cabeza elimina'],
  },
  {
    imagen: pistola,
    alt: 'Pistola de dardos',
    color: 'bg-sky',
    etiqueta: 'Llega en la fase 2',
    titulo: 'Pistola de dardos',
    texto: 'Seis dardos con tachuela para remontar el marcador. Dos impactos eliminan, y cada eliminación con ella vale el doble de puntos.',
    datos: ['6 dardos', '50 de daño por dardo', 'Puntos x2'],
  },
]

const OBJETOS = [
  {
    imagen: rolloHilo,
    color: 'bg-mint',
    etiqueta: 'Curación',
    titulo: 'Rollo de hilo',
    texto: 'La vida nunca se regenera sola. Cada rollo recose 25 puntos de vida, sin pasar del máximo.',
    datos: ['+25 de vida', 'Única forma de curarte'],
  },
  {
    imagen: casco,
    color: 'bg-tangerine',
    etiqueta: 'Boost invisible',
    titulo: 'Casco',
    texto: 'No se ve sobre tu oso, así que no te delata. Sube tu vida máxima de 100 a 125 hasta que te eliminen.',
    datos: ['Vida máxima 125', 'No se ve'],
  },
]

const puntos = 'absolute inset-0 opacity-25 [background:radial-gradient(#1b1030_2.5px,transparent_2.5px)_0_0/26px_26px]'

function Datos({ lista }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {lista.map((d) => (
        <li key={d} className="rounded-full border-2 border-ink bg-cream px-3 py-1 text-sm font-semibold">
          {d}
        </li>
      ))}
    </ul>
  )
}

export default function Armas() {
  return (
    <section id="armas" className="bg-night px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Titulo etiqueta="Armas y objetos" resalte="Mucha mañana.">
          Pocas armas.
        </Titulo>

        <div className="grid gap-8 md:grid-cols-2">
          {ARMAS.map((a, i) => (
            <Reveal
              key={a.titulo}
              r={i ? 1 : -1}
              delay={i * 120}
              className="toon-lg overflow-hidden rounded-[2rem] bg-paper text-ink transition-transform hover:rotate-0"
            >
              <div className={`relative grid h-64 place-items-center overflow-hidden border-b-4 border-ink p-3 ${a.color}`}>
                <div aria-hidden="true" className={puntos} />
                <img src={a.imagen} alt={a.alt} className="relative h-full w-full animate-wiggle" />
              </div>
              <div className="p-6 sm:p-8">
                <span className="mb-3 inline-block rounded-full border-[3px] border-ink bg-sun px-3 py-0.5 text-sm font-bold tracking-wide uppercase">
                  {a.etiqueta}
                </span>
                <h3 className="mb-2 text-3xl">{a.titulo}</h3>
                <p className="mb-5 text-ink/80">{a.texto}</p>
                <Datos lista={a.datos} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="h3" className="mt-16 mb-8 text-[clamp(1.8rem,4vw,2.8rem)] text-paper text-outline">
          Y para <span className="text-sun text-outline">aguantar.</span>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          {OBJETOS.map((o, i) => (
            <Reveal
              key={o.titulo}
              r={i ? 1 : -1}
              delay={i * 120}
              className="toon-lg overflow-hidden rounded-[2rem] bg-paper text-ink transition-transform hover:rotate-0"
            >
              <div className={`relative grid h-44 place-items-center overflow-hidden border-b-4 border-ink ${o.color}`}>
                <div aria-hidden="true" className={puntos} />
                <img src={o.imagen} alt="" className="relative size-28 drop-shadow-[5px_5px_0_var(--color-ink)]" />
              </div>
              <div className="p-6">
                <span className="mb-3 inline-block rounded-full border-[3px] border-ink bg-sun px-3 py-0.5 text-sm font-bold tracking-wide uppercase">
                  {o.etiqueta}
                </span>
                <h3 className="mb-2 text-3xl">{o.titulo}</h3>
                <p className="mb-5 text-ink/80">{o.texto}</p>
                <Datos lista={o.datos} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}