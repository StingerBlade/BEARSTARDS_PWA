import { lazy, Suspense, useEffect } from 'react'
import { HashRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'
import Pendiente from './components/Pendiente'
import ProgresoScroll from './components/ProgresoScroll'
import Home from './pages/Home'

// El inicio va en el paquete principal; las demás pantallas se descargan al abrirlas
const CuentaEliminada = lazy(() => import('./pages/CuentaEliminada'))
const Laboratorio = lazy(() => import('./pages/Laboratorio'))
const Login = lazy(() => import('./pages/Login'))
const Panel = lazy(() => import('./pages/Panel'))
const Privacidad = lazy(() => import('./pages/Privacidad'))
const Ranking = lazy(() => import('./pages/Ranking'))
const Recuperar = lazy(() => import('./pages/Recuperar'))
const Registro = lazy(() => import('./pages/Registro'))
const Restablecer = lazy(() => import('./pages/Restablecer'))
const Terminos = lazy(() => import('./pages/Terminos'))

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
      <ProgresoScroll />
      <Header />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Suspense
          fallback={
            <p role="status" className="min-h-[60vh] p-8 pt-32 text-center font-semibold">
              Cargando…
            </p>
          }
        >
          <Outlet />
        </Suspense>
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