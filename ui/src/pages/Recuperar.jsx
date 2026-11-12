import { useId, useState } from 'react'
import { api } from '../api/cliente'
import TarjetaCuenta from '../components/cuenta/TarjetaCuenta'
import { Alerta } from '../components/cuenta/iconos'
import { boton, etiqueta, input } from '../components/ui'
import { CORREO } from '../legal/datos'

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// "Olvidé mi contraseña": pide el correo y la API manda un enlace para elegir una nueva
export default function Recuperar() {
  const id = useId()
  const [email, setEmail] = useState('')
  const [error, setError] = useState(null)
  const [enviado, setEnviado] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    const correo = email.trim()
    if (!CORREO_VALIDO.test(correo)) return setError('Escribe el correo con el que creaste tu cuenta.')
    setError(null)
    setEnviando(true)
    try {
      const respuesta = await api('/auth/recuperar/', { metodo: 'POST', cuerpo: { email: correo } })
      setEnviado(respuesta.detail)
    } catch (err) {
      setError(err.status === 0 ? 'Sin conexión. Inténtalo de nuevo en un momento.' : err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaCuenta
      titulo="¿Olvidaste tu contraseña?"
      subtitulo="Te mandamos un enlace a tu correo para elegir una nueva."
      pie={{ texto: '¿Ya la recordaste?', enlace: 'Inicia sesión', a: '/login' }}
    >
      {enviado ? (
        <div role="status" className="rounded-2xl border-[3px] border-ink bg-mint px-4 py-3.5 font-medium">
          <p className="mb-1 font-display text-xl">Revisa tu correo</p>
          <p>{enviado}</p>
          <p className="mt-2 text-sm text-ink/80">
            El enlace vence en 2 horas. Si no llega, revisa la carpeta de spam. Las cuentas creadas desde el juego sin correo
            no pueden recuperarse por este medio: escríbenos a {CORREO}.
          </p>
        </div>
      ) : (
        <form noValidate onSubmit={enviar}>
          <div className="mb-5">
            <label htmlFor={`${id}-correo`} className={etiqueta}>
              Correo
            </label>
            <input
              id={`${id}-correo`}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="oso@correo.com"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
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
          </div>
          <button type="submit" disabled={enviando} className={boton('sun', 'w-full')}>
            {enviando ? 'Enviando…' : 'Enviar enlace'}
          </button>
        </form>
      )}
    </TarjetaCuenta>
  )
}
