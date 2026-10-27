import logo from '../assets/img/turbo-oscuro.webp'

export default function Footer() {
  return (
    <footer className="border-t-4 border-paper/20 bg-ink px-5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <img src={logo} alt="Turbo Studios" width="660" height="196" className="h-14 w-auto shrink-0" />
        <p className="text-sm text-paper/70">
          © 2026 Turbo Studios · Universidad Tecnológica de Chihuahua · IDGS101N.
          <br />
          Little Bearstards es un proyecto académico. Las marcas que aparecen en el juego son parodias y no están
          afiliadas a marcas reales.
        </p>
      </div>
    </footer>
  )
}