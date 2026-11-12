import { Link } from 'react-router-dom'
import { ACTUALIZACION } from '../../legal/datos'
import { chip } from '../ui'

// Marco de los documentos legales: tarjeta clara, índice y secciones numeradas.
// `secciones` = [{ id, titulo, contenido }]
export default function Documento({ etiqueta, titulo, intro, secciones, otro }) {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b from-[#150d3a] to-night-3 px-5 pt-28 pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(#fff3d6_2px,transparent_2px)_0_0/38px_38px]"
      />
      <article className="toon-lg mx-auto max-w-3xl rounded-[2rem] bg-paper p-6 text-ink sm:p-10">
        <p className={chip}>{etiqueta}</p>
        <h1 className="mb-2 text-[clamp(2.2rem,5vw,3.4rem)] leading-tight">{titulo}</h1>
        <p className="mb-6 text-sm text-ink/70">Última actualización: {ACTUALIZACION}</p>
        <div className="mb-8 space-y-3">{intro}</div>

        <nav aria-label="Contenido" className="mb-10 rounded-2xl border-[3px] border-ink bg-cream p-5">
          <h2 className="mb-2 text-xl">Contenido</h2>
          <ol className="list-decimal space-y-1 pl-6">
            {secciones.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="underline underline-offset-[3px] hover:text-pink"
                >
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {secciones.map((s, i) => (
          <section key={s.id} id={s.id} className="mb-9 scroll-mt-28">
            <h2 className="mb-3 text-[1.6rem] leading-tight">
              {i + 1}. {s.titulo}
            </h2>
            <div className="space-y-3 [&_li]:mb-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6">
              {s.contenido}
            </div>
          </section>
        ))}

        <p className="mt-10 border-t-[3px] border-ink/15 pt-6 text-ink/80">
          Consulta también nuestro{' '}
          <Link to={otro.a} className="font-bold underline underline-offset-4 hover:text-pink">
            {otro.texto}
          </Link>
          .
        </p>
      </article>
    </div>
  )
}
