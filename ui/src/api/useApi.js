import { useEffect, useState } from 'react'
import { api } from './cliente'

// Pide `ruta` a la API al montar y otra vez al volver la conexión.
// Con `activa = false` no pide nada (por ejemplo, sin sesión).
export function useApi(ruta, activa = true) {
  const [resultado, setResultado] = useState({ estado: 'cargando', datos: null, error: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const alVolver = () => setVersion((v) => v + 1)
    window.addEventListener('online', alVolver)
    return () => window.removeEventListener('online', alVolver)
  }, [])

  useEffect(() => {
    if (!activa) return
    let vigente = true
    api(ruta)
      .then((datos) => vigente && setResultado({ estado: 'listo', datos, error: null }))
      .catch((error) => vigente && setResultado({ estado: 'error', datos: null, error: error.message }))
    return () => {
      vigente = false
    }
  }, [ruta, activa, version])

  const recargar = () => {
    setResultado((r) => ({ ...r, estado: 'cargando' }))
    setVersion((v) => v + 1)
  }
  return { ...resultado, recargar }
}
