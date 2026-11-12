import { useEffect } from 'react'
import { HashRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Pendiente from './components/Pendiente'
import CuentaEliminada from './pages/CuentaEliminada'
import Home from './pages/Home'
import Laboratorio from './pages/Laboratorio'
import Login from './pages/Login'
import Panel from './pages/Panel'
import Privacidad from './pages/Privacidad'
import Ranking from './pages/Ranking'
import Recuperar from './pages/Recuperar'
import Registro from './pages/Registro'
import Restablecer from './pages/Restablecer'
import Terminos from './pages/Terminos'
// Al cambiar de pantalla se empieza arriba
function AlInicio() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
    return null
}

function Layout() {
  return (
    <>
      <a
        href="#contenido"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('contenido')?.focus()
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-lg focus:bg-sun focus:px-4 focus:py-2 focus:text-ink"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AlInicio />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="panel" element={<Panel />} />
          <Route path="laboratorio" element={<Laboratorio />} />
          <Route path="privacidad" element={<Privacidad />} />
          <Route path="terminos" element={<Terminos />} />
          <Route path="recuperar" element={<Recuperar />} />
          <Route path="restablecer" element={<Restablecer />} />
          <Route path="cuenta-eliminada" element={<CuentaEliminada />} />
          <Route path="*" element={<Pendiente titulo="Página no encontrada" />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}