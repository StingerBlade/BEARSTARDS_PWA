import { Link } from 'react-router-dom'
import Oso from '../Oso'

// Marco común de Login y Registro: fondo con puntos, osito y tarjeta clara
export default function TarjetaCuenta({ titulo, subtitulo, pie, children }) {
  return (
    <div className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-gradient-to-b from-[#150d3a] to-night-3 px-5 pt-28 pb-16">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-30 [background:radial-gradient(#fff3d6_2px,transparent_2px)_0_0/38px_38px]"
      />
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="toon-lg relative rounded-[2rem] bg-paper p-7 text-ink sm:p-9">
            <h1 className="mb-1 pr-24 text-4xl">{titulo}</h1>
            <p className="mb-6 pr-20 text-ink/70">{subtitulo}</p>
            {children}
          </div>
          <Oso color="#d99a5b" mono className="absolute top-5 right-6 z-10 h-20 w-auto rotate-6" />
        </div>
        <p className="mt-6 text-center text-paper/80">
          {pie.texto}{' '}
          <Link to={pie.a} className="font-bold text-sun underline underline-offset-4">
            {pie.enlace}
          </Link>
        </p>
        <p className="mx-auto mt-4 max-w-sm rounded-xl border-2 border-dashed border-sun/70 bg-ink/40 px-4 py-2 text-center text-xs text-sun">
          Modo demostración: todavía no hay servidor y nada se guarda. La misma cuenta servirá en el juego.
        </p>
      </div>
    </div>
  )
}