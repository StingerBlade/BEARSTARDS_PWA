// Interfaz mínima para el laboratorio de pruebas: solo muestra y envía datos.
// El diseño final (neobrutalismo cartoon) la reemplaza más adelante.
import { useEffect, useState } from 'react'
import { api } from './api/cliente'

const numero = (n) => n.toLocaleString('es-MX')

// Un hook propio para pedir datos
// Pide `ruta` al montar y cada vez que se llama recargar().
function useApi(ruta, activa = true) {
  const [resultado, setResultado] = useState({ estado: 'cargando', datos: null, error: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    if (!activa) return
    let vigente = true
    api(ruta)
      .then((datos) => {
        if (!vigente) return
        console.table(datos)
        setResultado({ estado: 'listo', datos, error: null })
      })
      .catch((error) => {
        if (vigente) setResultado({ estado: 'error', datos: null, error: error.message })
      })
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

// Mensajes de cargando, error y vacío

function Estado({ consulta, vacio }) {
  if (consulta.estado === 'cargando') return <p>Cargando…</p>
  if (consulta.estado === 'error') return <p className="text-red-700">Error: {consulta.error}</p>
  if (!consulta.datos?.length) return <p>{vacio}</p>
  return null
}

// La tabla del ranking
function Ranking({ consulta }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xl font-bold">Ranking (GET /api/ranking/)</h2>
      <button type="button" className="border px-2" onClick={consulta.recargar}>
        Recargar
      </button>
      <Estado consulta={consulta} vacio="Todavía no hay jugadores." />
      {consulta.estado === 'listo' && consulta.datos.length > 0 && (
        <table className="border-collapse text-left">
          <thead>
            <tr>
              {['#', 'Jugador', 'Puntos', 'Partidas', 'V', 'D', 'E', 'Kills', 'Mejor'].map((h) => (
                <th key={h} className="border px-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {consulta.datos.map((j, i) => (
              <tr key={j.id}>
                <td className="border px-2">{i + 1}</td>
                <td className="border px-2">{j.username}</td>
                <td className="border px-2">{numero(j.puntos_totales)}</td>
                <td className="border px-2">{j.partidas}</td>
                <td className="border px-2">{j.victorias}</td>
                <td className="border px-2">{j.derrotas}</td>
                <td className="border px-2">{j.empates}</td>
                <td className="border px-2">{j.kills}</td>
                <td className="border px-2">{numero(j.mejor_puntuacion)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default function App() {
  const ranking = useApi('/ranking/')

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Little Bearstards — laboratorio de pruebas</h1>
      <Ranking consulta={ranking} />
    </main>
  )
}