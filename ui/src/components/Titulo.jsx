import Reveal from './Reveal'
import { chip, tituloSeccion } from './ui'

// Píldora + título de dos partes, como en todas las secciones de Inicio.
// `claro` = sección con fondo cream (texto ink en lugar de paper con contorno).
export default function Titulo({ etiqueta, children, resalte, claro = false, className = 'mb-12' }) {
  return (
    <Reveal className={className}>
      <p className={chip}>{etiqueta}</p>
      <h2 className={`${tituloSeccion} ${claro ? 'text-ink' : 'text-paper text-outline'}`}>
        {children} <span className={claro ? 'text-pink' : 'text-sun text-outline'}>{resalte}</span>
      </h2>
    </Reveal>
  )
}