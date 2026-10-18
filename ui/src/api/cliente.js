// Cliente de la API: rutas relativas (/api/...), token en el header y un log
// por petición en la consola (evidencia del laboratorio de pruebas).

// Guardar y leer la sesión
const CLAVE_SESION = 'bearstards:sesion'

export function leerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION))
  } catch {
    return null
  }
}

export function guardarSesion(sesion) {
  try {
    if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
    else localStorage.removeItem(CLAVE_SESION)
  } catch {
    // por si tiene el modo incognito y no permite guardar cache
  }
}


// Mensajes de error legibles
function mensajeDeError(datos) {
  if (!datos || typeof datos !== 'object') return null
  if (datos.detail) return datos.detail
  return Object.entries(datos)
    .map(([campo, mensajes]) => `${campo}: ${[].concat(mensajes).join(' ')}`)
    .join(' · ')
}

export class ErrorApi extends Error {
  constructor(status, datos) {
    super(mensajeDeError(datos) || `Error ${status}`)
    this.status = status
  }
}

// La función que hace las peticiones
export async function api(ruta, { metodo = 'GET', cuerpo } = {}) {
  const url = `/api${ruta}`
  const sesion = leerSesion()
  const headers = { Accept: 'application/json' }
  if (cuerpo) headers['Content-Type'] = 'application/json'
  if (sesion?.token) headers.Authorization = `Token ${sesion.token}`

  const inicio = performance.now()
  let respuesta
  try {
    respuesta = await fetch(url, {
      method: metodo,
      headers,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    })
  } catch (error) {
    console.error(`[API] ${metodo} ${url} → sin conexión`, error)
    throw new ErrorApi(0, { detail: 'Sin conexión con el servidor.' })
  }

  const texto = await respuesta.text()
  const ms = Math.round(performance.now() - inicio)
  console.info(`[API] ${metodo} ${url} → ${respuesta.status} en ${ms} ms (${texto.length} B)`)

  let datos
  try {
    datos = texto ? JSON.parse(texto) : null
  } catch {
    datos = { detail: `Respuesta inesperada del servidor (${respuesta.status}).` }
  }

  if (respuesta.status === 401) guardarSesion(null)
  if (!respuesta.ok) throw new ErrorApi(respuesta.status, datos)
  return datos
}