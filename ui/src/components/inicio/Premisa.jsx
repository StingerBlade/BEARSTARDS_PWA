import aguja from '../../assets/svg/icono-aguja.svg'
import buscar from '../../assets/svg/icono-buscar.svg'
import control from '../../assets/svg/icono-control.svg'
import trofeo from '../../assets/svg/icono-trofeo.svg'
import Reveal from '../Reveal'
import Titulo from '../Titulo'

const TARJETAS = [
  {
    icono: buscar,
    color: 'bg-pink',
    r: -2,
    titulo: 'Mézclate o pierde',
    texto: 'Docenas de osos patrullan la tienda y casi nadie sabe cuál es tu rival. Correr, brincar o portar un arma te delata.',
  },
  {
    icono: control,
    color: 'bg-sky',
    r: 1.5,
    titulo: 'Duelo 1v1 en línea',
    texto: 'Dos jugadores, cada uno en su computadora. Partidas de 10 minutos con reaparición: gana quien junte más puntos.',
  },
  {
    icono: aguja,
    color: 'bg-mint',
    r: -1,
    titulo: 'Aguja y pistola de dardos',
    texto: 'Una aguja de coser siempre a la mano y una pistola de dardos que llega en la fase 2.',
  },
  {
    icono: trofeo,
    color: 'bg-sun',
    r: 2,
    titulo: 'Tus stats y el ranking',
    texto: 'Crea tu cuenta y consulta tus estadísticas, tu historial y el ranking global.',
  },
]

export default function Premisa() {
  return (
    <section id="juego" className="relative bg-night px-5 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Titulo etiqueta="La premisa" resalte="Ellos no.">
            La tienda cierra.
          </Titulo>
          <Reveal delay={120} className="space-y-5 text-lg text-paper/85">
            <p>
              Una juguetería se convierte en tienda de videojuegos. En el último pasillo quedan los{' '}
              <strong className="text-sun">últimos osos de peluche sin vender</strong>. Cuando se apagan las luces,
              despiertan y descubren su destino: serán incinerados si nadie los compra antes del cierre.
            </p>
            <p>
              Solo hay lugar para uno: el ganador se <strong className="text-sun">vende</strong> y el perdedor va al{' '}
              <strong className="text-pink">incinerador</strong>. Los demás osos de la tienda te sirven de escondite.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TARJETAS.map((t, i) => (
            <Reveal
              key={t.titulo}
              r={t.r}
              delay={i * 90}
              className={`toon rounded-3xl p-6 text-ink transition-transform hover:-translate-y-2 hover:rotate-0 ${t.color}`}
            >
              <span className="mb-4 grid size-16 place-items-center rounded-2xl border-[3px] border-ink bg-paper shadow-toon-sm">
                <img src={t.icono} alt="" className="size-11" />
              </span>
              <h3 className="mb-2 text-2xl">{t.titulo}</h3>
              <p className="text-[0.97rem] leading-snug font-medium">{t.texto}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}