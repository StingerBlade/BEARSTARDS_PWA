import osoNpc from '../../assets/img/bear-npc.webp'
import brincar from '../../assets/img/mechanic-jump-detected.webp'
import correr from '../../assets/img/mechanic-run-detected.webp'
import caminar from '../../assets/img/mechanic-walk-npc.webp'
import armado from '../../assets/img/mechanic-weapon-detected.webp'
import vidaHilo from '../../assets/img/hud-yarn-health.webp'
import sinArma from '../../assets/img/mechanic-idle-unarmed.webp'
import conoVision from '../../assets/img/mechanic-visibility-cone.webp'
import Ola from '../Ola'
import Reveal from '../Reveal'
import Titulo from '../Titulo'

const REGLAS = [
  {
    color: 'bg-sky',
    imagen: sinArma,
    titulo: 'Encuentra a tu rival',
    texto: 'Entre los NPC hay un oso controlado por otra persona. Obsérvalo: ¿camina raro? ¿Se detiene demasiado?',
  },
  {
    color: 'bg-mint',
    imagen: conoVision,
    titulo: 'Equípate sin llamar la atención',
    texto: 'Recoge tu arma por los pasillos. Esconderla entre los demás osos marca la diferencia entre un golpe limpio y un duelo perdido.',
  },
  {
    color: 'bg-pink',
    imagen: osoNpc,
    titulo: 'Elimina… al correcto',
    texto: 'Un golpe certero en la cabeza elimina al instante. Si golpeas a un NPC por error, pierdes puntos.',
  },
]

const DELATA = [
  { imagen: caminar, texto: 'Caminar como NPC', aviso: 'Pasas desapercibido', color: 'bg-mint' },
  { imagen: correr, texto: 'Correr', aviso: 'Te delata', color: 'bg-pink' },
  { imagen: brincar, texto: 'Brincar', aviso: 'Te delata', color: 'bg-pink' },
  { imagen: armado, texto: 'Portar un arma', aviso: 'Te delata', color: 'bg-pink' },
]

const PUNTOS = [
  { valor: '+200', texto: 'Eliminación', color: 'bg-sun' },
  { valor: '+400', texto: 'Eliminación con dardos', color: 'bg-sky' },
  { valor: '−100', texto: 'Eliminar a un NPC', color: 'bg-pink' },
]

export default function ComoSeJuega() {
  return (
    <section id="como-se-juega" className="relative bg-cream px-5 pt-8 pb-24 text-ink md:pb-32">
      <Ola />
      <div className="mx-auto max-w-5xl pt-16">
        <Titulo etiqueta="Cómo se juega" resalte="Cero piedad." claro>
          Tres reglas.
        </Titulo>

        <ol className="grid gap-6">
          {REGLAS.map((regla, i) => (
            <Reveal
              as="li"
              key={regla.titulo}
              r={i % 2 ? 0.6 : -0.6}
              delay={i * 90}
              className="toon grid grid-cols-[72px_1fr] items-center gap-5 rounded-3xl bg-white p-5 sm:grid-cols-[96px_1fr_auto] sm:p-6"
            >
              <span
                className={`toon grid size-16 place-items-center rounded-full font-display text-4xl sm:size-20 sm:text-5xl ${regla.color}`}
              >
                {i + 1}
              </span>
              <div>
                <h3 className="mb-1 text-2xl sm:text-3xl">{regla.titulo}</h3>
                <p className="text-ink/80">{regla.texto}</p>
              </div>
              <img
                src={regla.imagen}
                alt=""
                className="hidden h-28 w-44 object-contain drop-shadow-[4px_4px_0_var(--color-ink)] sm:block"
              />
            </Reveal>
          ))}
        </ol>

        <Reveal as="h3" className="mt-14 mb-6 text-3xl sm:text-4xl">
          Lo que te <span className="text-pink">delata.</span>
        </Reveal>
        <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {DELATA.map((d, i) => (
            <Reveal
              as="li"
              key={d.texto}
              r={i % 2 ? 1 : -1}
              delay={i * 80}
              className="toon flex flex-col items-center rounded-3xl bg-white p-4 text-center transition-transform hover:-translate-y-1 hover:rotate-0"
            >
              <img src={d.imagen} alt="" className="mb-3 h-28 w-auto object-contain drop-shadow-[4px_4px_0_var(--color-ink)]" />
              <h4 className="text-xl">{d.texto}</h4>
              <span className={`mt-2 rounded-full border-2 border-ink px-3 py-0.5 text-sm font-semibold ${d.color}`}>
                {d.aviso}
              </span>
            </Reveal>
          ))}
        </ul>

        <Reveal className="toon-lg mt-14 rounded-[2rem] bg-night p-6 text-paper sm:p-10">
          <h3 className="mb-6 text-center text-3xl text-sun sm:text-4xl">Sistema de puntos</h3>
          <div className="grid gap-5 sm:grid-cols-3">
            {PUNTOS.map((p) => (
              <div key={p.texto} className={`toon-sm rounded-2xl p-5 text-center text-ink ${p.color}`}>
                <strong className="block font-display text-5xl sm:text-6xl">{p.valor}</strong>
                <span className="font-semibold tracking-wider uppercase">{p.texto}</span>
              </div>
            ))}
          </div>
          <img src={vidaHilo} alt="" className="mx-auto mt-8 h-auto w-full max-w-xs" />
          <p className="mt-4 text-center text-paper/80">
            La partida dura 10 minutos. Al caer, reapareces con 100 de vida y la pelea continúa. Cuando se acaba el
            tiempo, gana quien tenga más puntos; si quedan iguales, es empate.
          </p>
        </Reveal>
      </div>
      <Ola abajo />
    </section>
  )
}