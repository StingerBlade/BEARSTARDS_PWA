import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/img/turbo-oscuro.webp'
import { SECCIONES } from './secciones'
import { boton } from './ui'

const enlace =
  'cursor-pointer py-3 text-left font-display text-base tracking-wider text-paper uppercase transition-colors hover:text-sun lg:py-0'

export default function Header() {
  const [abierto, setAbierto] = useState(false)
  const [conFondo, setConFondo] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const alMover = () => setConFondo(window.scrollY > 24)
    alMover()
    window.addEventListener('scroll', alMover, { passive: true })
    return () => window.removeEventListener('scroll', alMover)
  }, [])

  useEffect(() => {
    const alTeclear = (e) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [])

  // Fuera de Inicio, primero regresa a Inicio y ahí se hace el scroll
  function irA(id) {
    setAbierto(false)
    if (pathname === '/') document.getElementById(id)?.scrollIntoView()
    else navigate('/', { state: { seccion: id } })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b-4 transition-all duration-300 ${
        conFondo || abierto ? 'border-ink bg-night/95 backdrop-blur' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-6 px-5">
        <Link to="/" aria-label="Little Bearstards, inicio" className="shrink-0" onClick={() => setAbierto(false)}>
          <img src={logo} alt="Turbo Studios" width="660" height="196" className="h-10 w-auto" />
        </Link>

        <nav
          id="menu"
          aria-label="Principal"
          className={`${abierto ? 'flex' : 'hidden'} absolute inset-x-0 top-[72px] flex-col gap-1 border-b-4 border-ink bg-night-2 px-5 pt-2 pb-5 lg:static lg:ml-auto lg:flex lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {SECCIONES.map((s) => (
            <button key={s.id} type="button" className={enlace} onClick={() => irA(s.id)}>
              {s.texto}
            </button>
          ))}
          <NavLink
            to="/ranking"
            onClick={() => setAbierto(false)}
            className={({ isActive }) => `${enlace} ${isActive ? 'text-sun' : ''}`}
          >
            Ranking
          </NavLink>
          <div className="mt-2 flex flex-wrap items-center gap-3 lg:mt-0 lg:ml-2">
            <NavLink
              to="/login"
              onClick={() => setAbierto(false)}
              className={({ isActive }) => `${enlace} ${isActive ? 'text-sun' : ''}`}
            >
              Iniciar sesión
            </NavLink>
            <Link to="/registro" onClick={() => setAbierto(false)} className={boton('sun', 'px-5 py-2 text-base')}>
              Crear cuenta
            </Link>
          </div>
        </nav>

        <button
          type="button"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
          aria-controls="menu"
          onClick={() => setAbierto((a) => !a)}
          className="toon-sm ml-auto grid size-11 cursor-pointer place-items-center rounded-xl bg-sun lg:hidden"
        >
          <span className="relative block h-0.5 w-5 bg-ink before:absolute before:-top-1.5 before:left-0 before:h-0.5 before:w-5 before:bg-ink after:absolute after:top-1.5 after:left-0 after:h-0.5 after:w-5 after:bg-ink" />
        </button>
      </div>
    </header>
  )
}