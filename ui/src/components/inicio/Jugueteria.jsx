import mapa from '../../assets/svg/mapa.svg'
import Ola from '../Ola'
import Reveal from '../Reveal'
import Titulo from '../Titulo'

const LEYENDA = [
  { texto: 'Jugador 1', forma: 'rounded-full bg-tangerine' },
  { texto: 'Jugador 2', forma: 'rounded-full bg-sky' },
  { texto: 'Osos NPC', forma: 'rounded-full bg-[#c9a1ff]' },
  { texto: 'Armas', forma: 'rotate-45 bg-sun' },
]

const FASES = [
  { color: 'bg-sky', titulo: 'Luces apagadas', texto: 'Sigilo: consigue la aguja e identifica a tu rival.' },
  { color: 'bg-mint', titulo: 'Mercancía nueva', texto: 'Se anuncia la pistola de dardos. Ir por ella te expone.' },
  { color: 'bg-pink', titulo: 'Remate final', texto: 'La mitad de los NPCs vuelve al estante: menos camuflaje.' },
]

export default function Jugueteria() {
  return (
    <section id="jugueteria" className="relative bg-cream px-5 py-24 text-ink md:py-32">
      <Ola />
      <div className="mx-auto grid max-w-6xl items-center gap-12 pt-8 lg:grid-cols-2">
        <div>
          <Titulo etiqueta="El escenario" resalte="Tres pasillos." claro>
            La juguetería.
          </Titulo>
          <Reveal delay={100}>
            <p className="max-w-lg text-lg text-ink/80">
              Un único mapa pensado para el sigilo: anaqueles como muros, juguetes como cobertura y la luz fluorescente
              de una tienda departamental a punto de apagarse. Cada tercio de la partida es una fase distinta.
            </p>
            <ol className="mt-8 grid gap-4">
              {FASES.map((f, i) => (
                <li key={f.titulo} className="toon grid grid-cols-[56px_1fr] items-center gap-4 rounded-3xl bg-white p-4">
                  <span className={`toon grid size-14 place-items-center rounded-full font-display text-3xl ${f.color}`}>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="mb-0.5 text-2xl">{f.titulo}</h3>
                    <p className="text-ink/80">{f.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ul className="mt-6 grid max-w-sm grid-cols-2 gap-3 font-semibold">
              {LEYENDA.map((l) => (
                <li key={l.texto}>
                  <i className={`mr-2 inline-block size-4 border-2 border-ink align-[-2px] ${l.forma}`} />
                  {l.texto}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-ink/60">Esquema ilustrativo, no es el plano final.</p>
          </Reveal>
        </div>
        <Reveal r={1.5} className="toon-lg rounded-[2rem] bg-night p-4">
          <img src={mapa} alt="Esquema de los tres pasillos de la juguetería" className="block w-full" />
        </Reveal>
      </div>
      <Ola abajo />
    </section>
  )
}