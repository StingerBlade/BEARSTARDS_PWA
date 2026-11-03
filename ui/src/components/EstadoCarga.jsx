import { boton } from './ui'

// Mensaje de cargando, error o vacío para una consulta de useApi.
// Devuelve null cuando hay datos y la pantalla debe mostrarlos.
export default function EstadoCarga({ consulta, vacio, imagen, className = '' }) {
  if (consulta.estado === 'cargando') {
    return (
      <p role="status" className={`p-8 text-center font-semibold ${className}`}>
        Cargando…
      </p>
    )
  }
  if (consulta.estado === 'error') {
    return (
      <div role="alert" className={`p-8 text-center ${className}`}>
        <p className="mb-4 font-semibold">No se pudo cargar. Revisa tu conexión e inténtalo de nuevo.</p>
        <button type="button" onClick={consulta.recargar} className={boton('sun', 'px-5 py-2 text-base')}>
          Reintentar
        </button>
      </div>
    )
  }
  if (!consulta.datos?.length) {
    return (
      <div className={`p-8 text-center ${className}`}>
        {imagen && <img src={imagen} alt="" className="mx-auto mb-4 h-40 w-auto" />}
        <p className="font-semibold">{vacio}</p>
      </div>
    )
  }
  return null
}
