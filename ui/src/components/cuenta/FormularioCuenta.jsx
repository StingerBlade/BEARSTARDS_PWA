import { useId, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, guardarSesion } from '../../api/cliente'
import { boton, etiqueta, input } from '../ui'
import { Alerta, Ojo, Reloj, SinWifi } from './iconos'
import { EDAD_MINIMA } from '../../legal/datos'

const USUARIO_VALIDO = /^[\wÁÉÍÓÚáéíóúÑñ.@+-]{3,30}$/
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CAMPOS = ['username', 'email', 'password']

function validar({ username, email, password, acepto }, registro) {
  const e = {}
  const u = username.trim()
  if (!u) e.username = 'Escribe tu nombre de jugador.'
  else if (!USUARIO_VALIDO.test(u)) e.username = 'Usa de 3 a 30 letras, números o . _ - @ +'
  if (registro) {
    if (!email.trim()) e.email = 'Escribe tu correo para recibir la bienvenida.'
    else if (!CORREO_VALIDO.test(email.trim())) e.email = 'Revisa tu correo, parece incompleto.'
  }
  if (!password) e.password = 'Escribe tu contraseña.'
  else if (registro && password.length < 8) {
    const faltan = 8 - password.length
    e.password = `Te faltan ${faltan} ${faltan === 1 ? 'carácter' : 'caracteres'} (mínimo 8).`
  }
  if (registro && !acepto) e.acepto = 'Acepta los Términos y el Aviso de privacidad para crear tu cuenta.'
  return e
}

function ErrorCampo({ id, mensaje }) {
  if (!mensaje) return <p id={id} hidden />
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-[.95rem] font-bold text-[#b3122a]">
      <Alerta />
      {mensaje}
    </p>
  )
}

// Errores por campo que devuelve el registro: { username: ['...'], email: [...] }
function erroresDelServidor(datos) {
  const e = {}
  for (const campo of CAMPOS) {
    if (datos?.[campo]) e[campo] = [].concat(datos[campo]).join(' ')
  }
  return e
}

// Formulario de Login (`tipo="login"`) y Registro (`tipo="registro"`): llama a /auth/login/ o /auth/registro/.
export default function FormularioCuenta({ tipo }) {
  const registro = tipo === 'registro'
  const id = useId()
  const navigate = useNavigate()
  const resumen = useRef(null)

  const [valores, setValores] = useState({ username: '', email: '', password: '', acepto: false })
  const [errores, setErrores] = useState({})
  const [verPass, setVerPass] = useState(false)
  const [enviando, setEnviando] = useState(false)
  // { tipo: 'cola' | 'sin-red' | 'error', texto }
  const [aviso, setAviso] = useState(null)

  const ids = { username: `${id}-usuario`, email: `${id}-correo`, password: `${id}-pass`, acepto: `${id}-acepto` }

  function cambiar(e) {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    const nuevos = { ...valores, [e.target.name]: valor }
    setValores(nuevos)
    // Si el campo ya estaba en rojo, se revisa otra vez mientras escribe
    if (errores[e.target.name]) setErrores((prev) => ({ ...prev, [e.target.name]: validar(nuevos, registro)[e.target.name] }))
  }

  function salir(e) {
    if (e.target.value) setErrores((prev) => ({ ...prev, [e.target.name]: validar(valores, registro)[e.target.name] }))
  }

  function mostrarErrores(nuevos) {
    setErrores(nuevos)
    requestAnimationFrame(() => resumen.current?.focus())
  }

  async function enviar(e) {
    e.preventDefault()
    setAviso(null)
    const nuevos = validar(valores, registro)
    if (Object.keys(nuevos).length) return mostrarErrores(nuevos)
    setErrores({})

    const username = valores.username.trim()
    // cliente: 'web' para que el token de la PWA no choque con el del juego
    const cuerpo = registro
      ? { username, email: valores.email.trim(), password: valores.password, cliente: 'web' }
      : { username, password: valores.password, cliente: 'web' }

    setEnviando(true)
    try {
      const sesion = await api(registro ? '/auth/registro/' : '/auth/login/', { metodo: 'POST', cuerpo })
      guardarSesion(sesion)
      navigate('/panel')
    } catch (error) {
      // Sin red el service worker deja el registro en cola y lo manda al volver la conexión
      if (error.status === 0) setAviso({ tipo: registro ? 'cola' : 'sin-red' })
      else {
        const delServidor = erroresDelServidor(error.datos)
        if (Object.keys(delServidor).length) mostrarErrores(delServidor)
        else setAviso({ tipo: 'error', texto: error.message })
      }
    } finally {
      setEnviando(false)
    }
  }

  const lista = Object.entries(errores).filter(([, m]) => m)

  return (
    <form noValidate onSubmit={enviar}>
      {lista.length > 0 && (
        <div ref={resumen} role="alert" tabIndex={-1} className="mb-5 rounded-2xl border-[3px] border-[#b3122a] bg-[#ffe1e6] px-4 py-3.5">
          <h2 className="mb-1 font-display text-xl">Revisa estos campos</h2>
          <ul className="list-disc pl-5">
            {lista.map(([campo, mensaje]) => (
              <li key={campo}>
                <a
                  href={`#${ids[campo]}`}
                  onClick={(ev) => {
                    ev.preventDefault()
                    document.getElementById(ids[campo])?.focus()
                  }}
                  className="font-semibold underline underline-offset-[3px]"
                >
                  {mensaje}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div role="status">
        {aviso?.tipo === 'error' && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border-[3px] border-[#b3122a] bg-[#ffe1e6] px-4 py-3.5 font-semibold">
            <Alerta />
            <p>{aviso.texto}</p>
          </div>
        )}
        {(aviso?.tipo === 'cola' || aviso?.tipo === 'sin-red') && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border-[3px] border-ink bg-sun px-4 py-3.5 font-medium">
            {aviso.tipo === 'cola' ? <Reloj /> : <SinWifi />}
            {aviso.tipo === 'cola' ? (
              <p>
                <strong>Tu registro quedó en cola.</strong>
                <br />
                Se enviará solo cuando vuelva la conexión. Después inicia sesión.
              </p>
            ) : (
              <p>
                <strong>Sin conexión.</strong>
                <br />
                Para iniciar sesión necesitas internet. Inténtalo de nuevo en un momento.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mb-5">
        <label htmlFor={ids.username} className={etiqueta}>
          Nombre de jugador
        </label>
        <input
          id={ids.username}
          name="username"
          type="text"
          value={valores.username}
          onChange={cambiar}
          onBlur={salir}
          placeholder="OsoPardo"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck="false"
          aria-invalid={Boolean(errores.username)}
          aria-describedby={`${ids.username}-err`}
          className={input}
        />
        <ErrorCampo id={`${ids.username}-err`} mensaje={errores.username} />
      </div>

      {registro && (
        <div className="mb-5">
          <label htmlFor={ids.email} className={etiqueta}>
            Correo
          </label>
          <input
            id={ids.email}
            name="email"
            type="email"
            value={valores.email}
            onChange={cambiar}
            onBlur={salir}
            placeholder="oso@correo.com"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck="false"
            aria-invalid={Boolean(errores.email)}
            aria-describedby={`${ids.email}-ayuda ${ids.email}-err`}
            className={input}
          />
          <p id={`${ids.email}-ayuda`} className="mt-1.5 text-sm text-ink/70">
            Te mandamos un correo de bienvenida.
          </p>
          <ErrorCampo id={`${ids.email}-err`} mensaje={errores.email} />
        </div>
      )}

      <div className="mb-5">
        <label htmlFor={ids.password} className={etiqueta}>
          Contraseña
        </label>
        <div className="relative">
          <input
            id={ids.password}
            name="password"
            type={verPass ? 'text' : 'password'}
            value={valores.password}
            onChange={cambiar}
            onBlur={salir}
            autoComplete={registro ? 'new-password' : 'current-password'}
            aria-invalid={Boolean(errores.password)}
            aria-describedby={`${registro ? `${ids.password}-ayuda ` : ''}${ids.password}-err`}
            className={`${input} pr-14`}
          />
          <button
            type="button"
            onClick={() => setVerPass((v) => !v)}
            aria-pressed={verPass}
            aria-label={verPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute top-1/2 right-1.5 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-xl text-ink hover:bg-cream"
          >
            <Ojo tachado={verPass} />
          </button>
        </div>
        {registro ? (
          <p id={`${ids.password}-ayuda`} className="mt-1.5 text-sm text-ink/70">
            Mínimo 8 caracteres.
          </p>
        ) : (
          <p className="mt-2 text-right text-sm">
            <Link to="/recuperar" className="font-bold underline underline-offset-4 hover:text-pink">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        )}
        <ErrorCampo id={`${ids.password}-err`} mensaje={errores.password} />
      </div>

      {registro && (
        <div className="mb-6">
          <div className="flex items-start gap-3">
            <input
              id={ids.acepto}
              name="acepto"
              type="checkbox"
              checked={valores.acepto}
              onChange={cambiar}
              aria-invalid={Boolean(errores.acepto)}
              aria-describedby={`${ids.acepto}-err`}
              className="mt-1 size-5 shrink-0 cursor-pointer accent-ink"
            />
            <label htmlFor={ids.acepto} className="text-[.95rem] leading-snug">
              Tengo al menos {EDAD_MINIMA} años (si soy menor de 18, cuento con la autorización de mi madre, padre o tutor) y acepto los{' '}
              <Link to="/terminos" target="_blank" className="font-bold underline underline-offset-4">
                Términos y condiciones
              </Link>{' '}
              y el{' '}
              <Link to="/privacidad" target="_blank" className="font-bold underline underline-offset-4">
                Aviso de privacidad
              </Link>
              .
            </label>
          </div>
          <ErrorCampo id={`${ids.acepto}-err`} mensaje={errores.acepto} />
        </div>
      )}

      <button type="submit" disabled={enviando} className={boton('sun', 'w-full')}>
        {enviando ? 'Enviando…' : registro ? 'Crear cuenta' : 'Entrar'}
      </button>
    </form>
  )
}