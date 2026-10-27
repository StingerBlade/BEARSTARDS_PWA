// Clases repetidas del diseño: se definen una vez y las usan todas las pantallas.

const botonBase =
  'inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-display text-lg tracking-wide toon cursor-pointer select-none transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:pointer-events-none disabled:opacity-60'

const variantes = {
  sun: 'bg-sun text-ink',
  paper: 'bg-paper text-ink',
  sky: 'bg-sky text-ink',
  pink: 'bg-pink text-ink',
  tangerine: 'bg-tangerine text-ink',
  ink: 'bg-ink text-paper border-paper',
}

export function boton(variante = 'sun', extra = '') {
  return `${botonBase} ${variantes[variante]} ${extra}`.trim()
}

export const input =
  'w-full rounded-2xl border-[3px] border-ink bg-white px-4 py-3 text-ink placeholder:text-ink/40 shadow-[3px_3px_0_var(--color-ink)] focus:shadow-[3px_3px_0_var(--color-sky)] focus:outline-none aria-[invalid=true]:border-yarn aria-[invalid=true]:shadow-[3px_3px_0_var(--color-yarn)]'

export const etiqueta = 'mb-1.5 block font-display text-lg tracking-wide'

// Píldora inclinada que va arriba de cada título de sección
export const chip =
  'mb-3 inline-block -rotate-2 rounded-full border-[3px] border-ink bg-pink px-4 py-1 font-display text-sm tracking-[0.2em] text-ink uppercase shadow-toon-sm'

export const tituloSeccion = 'text-[clamp(2.4rem,6vw,4.6rem)]'