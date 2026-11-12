import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, guardarSesion } from '../../api/cliente'
import { boton, etiqueta, input } from '../ui'
import { Alerta } from './iconos'

// Derecho de cancelación: borra los datos personales y deja la cuenta anónima.
// Pide la contraseña para confirmar que es el dueño.
export default function EliminarCuenta() {
  const id = useId()
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function eliminar(e) {
    e.preventDefault()
    if (!password) return setError('Escribe tu contraseña para confirmar.')
    setError(null)
    setEnviando(true)
    try {
      await api('/yo/eliminar/', { metodo: 'POST', cuerpo: { password } })
      guardarSesion(null)
      navigate('/cuenta-eliminada')
    } catch (err) {
      const delCampo = err.datos?.password
      setError(delCampo ? [].concat(delCampo).join(' ') : err.status === 0 ? 'Sin conexión. Inténtalo de nuevo.' : err.message)
      setEnviando(false)
    }
  }

  return (
    <section aria-labelledby={`${id}-titulo`} className="toon mt-14 rounded-3xl border-[3px] border-ink bg-paper p-6 text-ink sm:p-8">
      <h2 id={`${id}-titulo`} className="mb-2 text-[1.8rem]">
        Eliminar cuenta
      </h2>
      <p className="mb-5 text-ink/80">
        Se borran tu correo, tu contraseña y tus sesiones en el sitio y en el juego, tu nombre de jugador se reemplaza por
        uno anónimo y dejas de aparecer en el ranking. Tus partidas pasadas se conservan sin tu nombre, porque cuentan en
        las estadísticas de tus rivales. <strong>No se puede deshacer.</strong>
      </p>

      {!abierto ? (
        <button type="button" onClick={() => setAbierto(true)} className={boton('pink')}>
          Quiero eliminar mi cuenta
        </button>
      ) : (
        <form noValidate onSubmit={eliminar} className="max-w-md">
          <label htmlFor={`${id}-pass`} className={etiqueta}>
            Confirma con tu contraseña
          </label>
          <input
            id={`${id}-pass`}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            aria-invalid={Boolean(error)}
            aria-describedby={`${id}-err`}
            className={input}
          />
          {error && (
            <p id={`${id}-err`} role="alert" className="mt-2 flex items-center gap-1.5 text-[.95rem] font-bold text-[#b3122a]">
              <Alerta />
              {error}
            </p>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="submit" disabled={enviando} className={boton('pink')}>
              {enviando ? 'Eliminando…' : 'Eliminar definitivamente'}
            </button>
            <button
              type="button"
              onClick={() => {
                setAbierto(false)
                setPassword('')
                setError(null)
              }}
              className={boton('paper')}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
