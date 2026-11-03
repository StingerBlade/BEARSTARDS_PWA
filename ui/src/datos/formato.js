// Formato de números y fechas para las pantallas de ranking y panel.

export const numero = (n) => n.toLocaleString('es-MX')
export const fecha = (iso) =>
  new Date(iso).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })
