import { useId, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, guardarSesion } from '../api/cliente'
import TarjetaCuenta from '../components/cuenta/TarjetaCuenta'
import { Alerta } from '../components/cuenta/iconos'
import { boton, etiqueta, input } from '../components/ui'

// Llega desde el enlace del correo: /#/restablecer?uid=...&token=...
export default function Restablecer() {
  const id = useId()
  const [parametros] = useSearchParams()
  const uid = parametros.get('uid')
  const token = parametros.get('token')

  const [valores, setValores] = useState({ password: '', confirmar: '' })
  const [error, setError] = useState(null)
  const [listo, setListo] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const cambiar = (e) => setValores((v) => ({ ...v, [e.target.name]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    if (valores.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.')
    if (valores.password !== valores.confirmar) return setError('Las contraseñas no coinciden.')
    setError(null)
    setEnviando(true)
    try {
      const respuesta = await api('/auth/restablecer/', {
        metodo: 'POST',
        cuerpo: { uid, token, password: valores.password },
      })
      // El cambio cierra todas las sesiones, también la de este navegador
      guardarSesion(null)
      setListo(respuesta.detail)
    } catch (err) {
      setError(err.status === 0 ? 'Sin conexión. Inténtalo de nuevo en un momento.' : err.message)
    } finally {
      setEnviando(false)
    }
  }

  const pie = { texto: '¿Necesitas otro enlace?', enlace: 'Pídelo aquí', a: '/recuperar' }

  if (!uid || !token) {
    return (
      <TarjetaCuenta titulo="Enlace incompleto" subtitulo="Abre el enlace completo que te llegó por correo." pie={pie}>
        <Link to="/recuperar" className={boton('sun', 'w-full')}>
          Pedir un enlace nuevo
        </Link>
      </TarjetaCuenta>
    )
  }

  return (
    <TarjetaCuenta titulo="Nueva contraseña" subtitulo="Elige una contraseña que no uses en otros sitios." pie={pie}>
      {listo ? (
        <div role="status">
          <div className="mb-5 rounded-2xl border-[3px] border-ink bg-mint px-4 py-3.5 font-medium">
            <p className="mb-1 font-display text-xl">¡Listo!</p>
            <p>{listo}</p>
          </div>
          <Link to="/login" className={boton('sun', 'w-full')}>
            Iniciar sesión
          </Link>
        </div>
      ) : (
        <form noValidate onSubmit={enviar}>
          {error && (
            <div role="alert" className="mb-5 flex items-start gap-3 rounded-2xl border-[3px] border-[#b3122a] bg-[#ffe1e6] px-4 py-3.5 font-semibold">
              <Alerta />
              <p>{error}</p>
            </div>
          )}
          <div className="mb-5">
            <label htmlFor={`${id}-pass`} className={etiqueta}>
              Contraseña nueva
            </label>
            <input
              id={`${id}-pass`}
              name="password"
              type="password"
              value={valores.password}
              onChange={cambiar}
              autoComplete="new-password"
              className={input}
            />
            <p className="mt-1.5 text-sm text-ink/70">Mínimo 8 caracteres.</p>
          </div>
          <div className="mb-6">
            <label htmlFor={`${id}-confirmar`} className={etiqueta}>
              Confirma la contraseña
            </label>
            <input
              id={`${id}-confirmar`}
              name="confirmar"
              type="password"
              value={valores.confirmar}
              onChange={cambiar}
              autoComplete="new-password"
              className={input}
            />
          </div>
          <button type="submit" disabled={enviando} className={boton('sun', 'w-full')}>
            {enviando ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
        </form>
      )}
    </TarjetaCuenta>
  )
}
