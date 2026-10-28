import Ola from '../Ola'
import Reveal from '../Reveal'
import Titulo from '../Titulo'

const REGLAS = [
  {
    color: 'bg-sky',
    titulo: 'Encuentra a tu rival',
    texto: 'Entre los NPC hay un oso controlado por otra persona. Obsérvalo: ¿camina raro? ¿Se detiene demasiado?',
  },
  {
    color: 'bg-mint',
    titulo: 'Equípate sin llamar la atención',
    texto: 'Recoge tu arma por los pasillos. Esconderla entre los demás osos marca la diferencia entre un golpe limpio y un duelo perdido.',
  },
  {
    color: 'bg-pink',
    titulo: 'Elimina… al correcto',
    texto: 'Un golpe certero en la cabeza elimina al instante. Si golpeas a un NPC por error, pierdes puntos.',
  },
]

const PUNTOS = [
  { valor: '+200', texto: 'Eliminación', color: 'bg-sun' },
  { valor: '+350', texto: 'Eliminación sigilosa', color: 'bg-mint' },
  { valor: '+400', texto: 'Eliminación con dardos', color: 'bg-sky' },
  { valor: '−50', texto: 'Golpear a un NPC', color: 'bg-pink' },
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
              className="toon grid grid-cols-[72px_1fr] items-center gap-5 rounded-3xl bg-white p-5 sm:grid-cols-[96px_1fr] sm:p-6"
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
            </Reveal>
          ))}
        </ol>

        <Reveal className="toon-lg mt-14 rounded-[2rem] bg-night p-6 text-paper sm:p-10">
          <h3 className="mb-6 text-center text-3xl text-sun sm:text-4xl">Sistema de puntos</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PUNTOS.map((p) => (
              <div key={p.texto} className={`toon-sm rounded-2xl p-5 text-center text-ink ${p.color}`}>
                <strong className="block font-display text-5xl sm:text-6xl">{p.valor}</strong>
                <span className="font-semibold tracking-wider uppercase">{p.texto}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-paper/80">
            La partida dura 10 minutos. Al caer, reapareces con 100 de vida y la pelea continúa. Cuando se acaba el
            tiempo, gana quien tenga más puntos; si quedan iguales, es empate.
          </p>
        </Reveal>
      </div>
      <Ola abajo />
    </section>
  )
}