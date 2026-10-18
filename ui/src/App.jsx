// Interfaz mínima para el laboratorio de pruebas: solo muestra y envía datos.
// El diseño final (neobrutalismo cartoon) la reemplaza más adelante.
import { useEffect, useState } from 'react'
import { api, guardarSesion, leerSesion } from './api/cliente'

const numero = (n) => n.toLocaleString('es-MX')
const fecha = (iso) => new Date(iso).toLocaleString('es-MX')
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

function FormularioCuenta({ titulo, ruta, onSesion }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  async function enviar(evento) {
    evento.preventDefault()
    setEnviando(true)
    setMensaje(null)
    try {
      const sesion = await api(ruta, { metodo: 'POST', cuerpo: { username, password } })
      onSesion(sesion)
      setMensaje(`Listo: sesión iniciada como ${sesion.jugador.username}.`)
      setPassword('')
    } catch (error) {
      setMensaje(`Error: ${error.message}`)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-1 border p-3">
      <h2 className="text-xl font-bold">
        {titulo} (POST /api{ruta})
      </h2>
      <label className="block">
        Usuario{' '}
        <input
          className="border px-1"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </label>
      <label className="block">
        Contraseña{' '}
        <input
          className="border px-1"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={ruta.includes('registro') ? 'new-password' : 'current-password'}
          required
        />
      </label>
      <button type="submit" className="border px-2" disabled={enviando}>
        {enviando ? 'Enviando…' : titulo}
      </button>
      {mensaje && <p>{mensaje}</p>}
    </form>
  )
}

function Perfil({ onSalir }) {
  const yo = useApi('/yo/')
  const partidas = useApi('/yo/partidas/')

  return (
    <section className="space-y-2 border p-3">
      <h2 className="text-xl font-bold">Mi perfil (GET /api/yo/ y /api/yo/partidas/)</h2>
      {yo.estado === 'listo' && (
        <ul>
          <li>Jugador: {yo.datos.username}</li>
          <li>
            Partidas: {yo.datos.partidas} · Victorias: {yo.datos.victorias} · Derrotas:{' '}
            {yo.datos.derrotas} · Empates: {yo.datos.empates}
          </li>
          <li>
            Kills: {yo.datos.kills} · Puntos totales: {numero(yo.datos.puntos_totales)} · Mejor
            puntuación: {numero(yo.datos.mejor_puntuacion)}
          </li>
        </ul>
      )}
      {yo.estado === 'error' && <p className="text-red-700">Error: {yo.error}</p>}

      <h3 className="font-bold">Historial</h3>
      <Estado consulta={partidas} vacio="Este jugador todavía no tiene partidas." />
      {partidas.estado === 'listo' && partidas.datos.length > 0 && (
        <table className="border-collapse text-left">
          <thead>
            <tr>
              {['Fecha', 'Resultado', 'Puntos', 'Kills', 'Abandono'].map((h) => (
                <th key={h} className="border px-2">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {partidas.datos.map((p) => (
              <tr key={p.fecha + p.resultado}>
                <td className="border px-2">{fecha(p.fecha)}</td>
                <td className="border px-2">{p.resultado}</td>
                <td className="border px-2">{numero(p.puntos)}</td>
                <td className="border px-2">{p.kills}</td>
                <td className="border px-2">{p.abandono ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button type="button" className="border px-2" onClick={onSalir}>
        Cerrar sesión (POST /api/auth/logout/)
      </button>
    </section>
  )
}

export default function App() {
  const [sesion, setSesion] = useState(leerSesion)
  const ranking = useApi('/ranking/')

  function iniciarSesion(nueva){
    guardarSesion(nueva)
    setSesion(nueva)
    ranking.recargar()
  }

  async function salir() {
    try {
      await api('/auth/logout/', { metodo: 'POST' })
    } catch (error) {
      console.warn('[API] logout falló; se cierra la sesión local de todos modos', error)
    }
    guardarSesion(null)
    setSesion(null)
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">Little Bearstards — laboratorio de pruebas</h1>
      <p>{sesion ? 'Sesion: ${sesion.jugador.username}' : 'Sin sesion iniciada'}</p>

      <Ranking consulta={ranking} />

        {sesion ? (
        <Perfil key={sesion.token} onSalir={salir} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <FormularioCuenta titulo="Registrarse" ruta="/auth/registro/" onSesion={iniciarSesion} />
          <FormularioCuenta titulo="Iniciar sesión" ruta="/auth/login/" onSesion={iniciarSesion} />
        </div>
      )}

    </main>
  )
}

