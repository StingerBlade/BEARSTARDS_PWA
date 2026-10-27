import { useEffect } from 'react'
import { HashRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Pendiente from './components/Pendiente'
import Home from './pages/Home'
import Laboratorio from './pages/Laboratorio'

// Al cambiar de pantalla se empieza arriba
function AlInicio() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
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
          <Route path="ranking" element={<Pendiente titulo="Ranking" />} />
          <Route path="login" element={<Pendiente titulo="Iniciar sesión" />} />
          <Route path="registro" element={<Pendiente titulo="Crear cuenta" />} />
          <Route path="panel" element={<Pendiente titulo="Mi panel" />} />
          <Route path="laboratorio" element={<Laboratorio />} />
          <Route path="*" element={<Pendiente titulo="Página no encontrada" />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}