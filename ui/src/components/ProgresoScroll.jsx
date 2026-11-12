import { useEffect, useRef } from 'react'

// Barra amarilla arriba de todo que se llena conforme bajas: deja claro que la página sigue
// y cuánto falta. Usa transform para no recalcular el layout en cada scroll.
export default function ProgresoScroll() {
  const barra = useRef(null)

  useEffect(() => {
    let pendiente = false
    const actualizar = () => {
      pendiente = false
      const total = document.documentElement.scrollHeight - window.innerHeight
      const avance = total > 0 ? Math.min(1, window.scrollY / total) : 0
      if (barra.current) barra.current.style.transform = `scaleX(${avance})`
    }
    const alMover = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(actualizar)
    }
    actualizar()
    window.addEventListener('scroll', alMover, { passive: true })
    window.addEventListener('resize', alMover)
    // Al cambiar de pantalla o cargar datos cambia el alto de la página
    const observador = new ResizeObserver(alMover)
    observador.observe(document.body)
    return () => {
      window.removeEventListener('scroll', alMover)
      window.removeEventListener('resize', alMover)
      observador.disconnect()
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1.5 bg-ink/40">
      <div ref={barra} className="h-full origin-left scale-x-0 bg-sun shadow-[0_2px_0_var(--color-ink)]" />
    </div>
  )
}
