import hud from '../../assets/img/captura-hud.webp'
import vida from '../../assets/img/captura-vida.webp'
import menu from '../../assets/img/render-menu.webp'
import Reveal from '../Reveal'
import Titulo from '../Titulo'

const CAPTURAS = [
  {
    src: menu,
    alt: 'Render del menú: dos osos de peluche peleando en un pasillo de la juguetería.',
    pie: 'Dos osos en el pasillo de la juguetería',
    grande: true,
  },
  { src: hud, alt: 'Partida en curso: panel superior con el temporizador en 10:00 y los puntos de cada jugador.', pie: 'HUD: tiempo y puntos de los dos' },
  { src: vida, alt: 'Barra de vida: un ovillo de estambre rojo con su hebra.', pie: 'Tu vida es una hebra de estambre' },
]

export default function Galeria() {
  return (
    <section id="galeria" className="bg-night px-5 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Titulo etiqueta="Galería" resalte="en Unity.">
          Así se ve
        </Titulo>
        <div className="grid gap-6 md:grid-cols-3 md:grid-rows-2">
          {CAPTURAS.map((c, i) => (
            <Reveal key={c.pie} delay={i * 90} className={c.grande ? 'md:col-span-2 md:row-span-2' : ''}>
              <figure className="m-0 flex h-full flex-col">
                <img
                  src={c.src}
                  alt={c.alt}
                  loading="lazy"
                  className="toon min-h-48 w-full flex-1 rounded-3xl border-4 object-cover"
                />
                <figcaption className="pt-3 text-sm text-paper/80">{c.pie}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}