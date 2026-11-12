import { Link } from 'react-router-dom'
import logo from '../assets/img/turbo-oscuro.webp'
import { CORREO } from '../legal/datos'

const enlace = 'font-semibold text-paper underline underline-offset-4 hover:text-sun'

export default function Footer() {
  return (
    <footer className="border-t-4 border-paper/20 bg-ink px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <img src={logo} alt="Turbo Studios" width="660" height="196" className="h-14 w-auto shrink-0" />
        <div className="text-sm text-paper/70">
          <p>
            © 2026 Turbo Studios · Universidad Tecnológica de Chihuahua · IDGS101N.
            <br />
            Little Bearstards es un proyecto académico. Las marcas que aparecen en el juego son parodias y no están
            afiliadas a marcas reales.
          </p>
          <nav aria-label="Legal" className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2 md:justify-start">
            <Link to="/privacidad" className={enlace}>
              Aviso de privacidad
            </Link>
            <Link to="/terminos" className={enlace}>
              Términos y condiciones
            </Link>
            <a href={`mailto:${CORREO}`} className={enlace}>
              Contacto
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
