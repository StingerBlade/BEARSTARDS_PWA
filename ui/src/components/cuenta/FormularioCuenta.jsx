import { useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { boton, etiqueta, input } from '../ui'
import { Alerta, Ojo, Reloj, SinWifi } from './iconos'

const USUARIO_VALIDO = /^[\wÁÉÍÓÚáéíóúÑñ.@+-]{3,30}$/

function validar({ username, password }, registro) {
  const e = {}
  const u = username.trim()
  if (!u) e.username = 'Escribe tu nombre de jugador.'
  else if (!USUARIO_VALIDO.test(u)) e.username = 'Usa de 3 a 30 letras, números o . _ - @ +'
  if (!password) e.password = 'Escribe tu contraseña.'
  else if (registro && password.length < 8) {
    const faltan = 8 - password.length
    e.password = `Te faltan ${faltan} ${faltan === 1 ? 'carácter' : 'caracteres'} (mínimo 8).`
  }
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

// Formulario de Login (`tipo="login"`) y Registro (`tipo="registro"`).
// Por ahora solo simula el envío; al conectar la API se llama a /auth/login/ o /auth/registro/.
export default function FormularioCuenta({ tipo }) {
  const registro = tipo === 'registro'
  const id = useId()
  const navigate = useNavigate()
  const resumen = useRef(null)

  const [valores, setValores] = useState({ username: '', password: '' })
  const [errores, setErrores] = useState({})
  const [verPass, setVerPass] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [aviso, setAviso] = useState(null)
  // Temporal: permite ver el aviso de "sin conexión" mientras no hay API
  const [sinConexion, setSinConexion] = useState(false)

  const ids = { username: `${id}-usuario`, password: `${id}-pass` }

  function cambiar(e) {
    const nuevos = { ...valores, [e.target.name]: e.target.value }
    setValores(nuevos)
    // Si el campo ya estaba en rojo, se revisa otra vez mientras escribe
    if (errores[e.target.name]) setErrores((prev) => ({ ...prev, [e.target.name]: validar(nuevos, registro)[e.target.name] }))
  }

  function salir(e) {
    if (e.target.value) setErrores((prev) => ({ ...prev, [e.target.name]: validar(valores, registro)[e.target.name] }))
  }

  function entrar() {
    navigate('/panel')
  }

  function enviar(e) {
    e.preventDefault()
    setAviso(null)
    const nuevos = validar(valores, registro)
    setErrores(nuevos)
    if (Object.keys(nuevos).length) {
      requestAnimationFrame(() => resumen.current?.focus())
      return
    }
    setEnviando(true)
    setTimeout(() => {
      setEnviando(false)
      if (sinConexion) setAviso(registro ? 'cola' : 'sin-red')
      else entrar()
    }, 600)
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
        {aviso && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border-[3px] border-ink bg-sun px-4 py-3.5 font-medium">
            {aviso === 'cola' ? <Reloj /> : <SinWifi />}
            {aviso === 'cola' ? (
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
        {registro && (
          <p id={`${ids.password}-ayuda`} className="mt-1.5 text-sm text-ink/70">
            Mínimo 8 caracteres.
          </p>
        )}
        <ErrorCampo id={`${ids.password}-err`} mensaje={errores.password} />
      </div>

      <label className="mb-5 flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink/70">
        <input type="checkbox" checked={sinConexion} onChange={(e) => setSinConexion(e.target.checked)} className="size-4 accent-ink" />
        Simular que no hay conexión
      </label>

      <button type="submit" disabled={enviando} className={boton('sun', 'w-full')}>
        {enviando ? 'Enviando…' : registro ? 'Crear cuenta' : 'Entrar'}
      </button>
      {!registro && (
        <button type="button" onClick={entrar} className={boton('sky', 'mt-3 w-full px-5 py-2 text-base')}>
          Probar con la cuenta demo
        </button>
      )}
    </form>
  )
}