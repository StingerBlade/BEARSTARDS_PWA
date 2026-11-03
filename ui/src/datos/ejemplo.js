// Datos de ejemplo para maquetar. Tienen los mismos campos que la API
// (GET /api/ranking/, /api/yo/ y /api/yo/partidas/) y se reemplazan al conectarla.

export const RANKING = [
  { id: 1, username: 'OjoDeBotón', puntos_totales: 35800, victorias: 24, derrotas: 15, empates: 3, kills: 121 },
  { id: 2, username: 'PeluchePunk', puntos_totales: 33000, victorias: 26, derrotas: 18, empates: 2, kills: 113 },
  { id: 3, username: 'Panzón', puntos_totales: 29750, victorias: 25, derrotas: 20, empates: 2, kills: 104 },
  { id: 4, username: 'OsoPardo', puntos_totales: 29350, victorias: 19, derrotas: 17, empates: 1, kills: 98 },
  { id: 5, username: 'DonRelleno', puntos_totales: 24750, victorias: 16, derrotas: 15, empates: 1, kills: 84 },
  { id: 6, username: 'TeddyTorpe', puntos_totales: 23750, victorias: 13, derrotas: 22, empates: 2, kills: 80 },
  { id: 7, username: 'OsoDemo', puntos_totales: 22300, victorias: 15, derrotas: 11, empates: 3, kills: 71 },
  { id: 8, username: 'ZurcidoZ', puntos_totales: 20800, victorias: 18, derrotas: 9, empates: 1, kills: 69 },
  { id: 9, username: 'Pelusa', puntos_totales: 20700, victorias: 16, derrotas: 6, empates: 1, kills: 66 },
  { id: 10, username: 'MrCremallera', puntos_totales: 19700, victorias: 21, derrotas: 10, empates: 1, kills: 63 },
]

export const PARTIDAS = [
  { fecha: '2026-11-11T19:40:00Z', puntos: 900, kills: 4, resultado: 'victoria', abandono: false },
  { fecha: '2026-11-09T21:05:00Z', puntos: 250, kills: 1, resultado: 'derrota', abandono: false },
  { fecha: '2026-11-07T18:20:00Z', puntos: 700, kills: 3, resultado: 'empate', abandono: false },
  { fecha: '2026-11-05T20:10:00Z', puntos: 800, kills: 4, resultado: 'victoria', abandono: false },
  { fecha: '2026-11-04T17:45:00Z', puntos: 550, kills: 2, resultado: 'victoria', abandono: false },
  { fecha: '2026-11-02T22:30:00Z', puntos: 300, kills: 1, resultado: 'derrota', abandono: true },
  { fecha: '2026-10-31T19:00:00Z', puntos: -50, kills: 0, resultado: 'derrota', abandono: false },
  { fecha: '2026-10-28T16:15:00Z', puntos: 1500, kills: 5, resultado: 'victoria', abandono: false },
  { fecha: '2026-10-27T20:50:00Z', puntos: 150, kills: 1, resultado: 'derrota', abandono: false },
  { fecha: '2026-10-24T18:35:00Z', puntos: 500, kills: 2, resultado: 'victoria', abandono: false },
]

export const partidasDe = (j) => j.victorias + j.derrotas + j.empates
export const numero = (n) => n.toLocaleString('es-MX')