import { useEffect, useState } from 'react'
import { EVENTO_SESION, leerSesion } from './cliente'

// La sesión guardada, al día: cambia al iniciar o cerrar sesión (también en otra pestaña)
export function useSesion() {
  const [sesion, setSesion] = useState(leerSesion)

  useEffect(() => {
    const alCambiar = () => setSesion(leerSesion())
    window.addEventListener(EVENTO_SESION, alCambiar)
    window.addEventListener('storage', alCambiar)
    return () => {
      window.removeEventListener(EVENTO_SESION, alCambiar)
      window.removeEventListener('storage', alCambiar)
    }
  }, [])

  return sesion
}
