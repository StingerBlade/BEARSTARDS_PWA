import ola from '../assets/svg/ola.svg'

// Borde ondulado de las secciones cream: arriba o abajo de la sección
export default function Ola({ abajo = false }) {
  return (
    <img
      src={ola}
      alt=""
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 block h-[44px] w-full md:h-[70px] ${
        abajo ? '-bottom-[43px] rotate-180 md:-bottom-[69px]' : '-top-[43px] md:-top-[69px]'
      }`}
    />
  )
}