import { numero } from '../../datos/ejemplo'

// En celular se ocultan V/D/E/Kills y se muestran en una línea bajo el nombre
const opcional = 'hidden px-3 py-3 text-right sm:table-cell'

export default function TablaRanking({ filas, usuario, busqueda }) {
  if (!filas.length) {
    return <p className="p-8 text-center font-semibold">Ningún jugador coincide con “{busqueda}”.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <caption className="sr-only">Ranking: top 10 por puntos totales</caption>
        <thead>
          <tr className="border-b-4 border-ink bg-sun font-display text-sm tracking-wider uppercase">
            <th scope="col" className="px-4 py-3 sm:px-6">#</th>
            <th scope="col" className="px-3 py-3">Jugador</th>
            <th scope="col" className={opcional}>Victorias</th>
            <th scope="col" className={opcional}>Derrotas</th>
            <th scope="col" className={opcional}>Empates</th>
            <th scope="col" className={opcional}>Kills</th>
            <th scope="col" className="px-4 py-3 text-right sm:px-6">Puntos</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((j) => {
            const mia = j.username === usuario
            return (
              <tr key={j.id} className={`border-t-2 border-ink/10 font-semibold ${mia ? 'bg-mint' : ''}`}>
                <td className="px-4 py-3 font-display text-xl sm:px-6">{j.puesto}</td>
                <td className="px-3 py-3">
                  {j.username}
                  {mia && <span className="text-sm"> (tú)</span>}
                  <span className="block text-[.8rem] text-ink/65 sm:hidden">
                    {j.victorias} V · {j.derrotas} D · {j.empates} E · {j.kills} kills
                  </span>
                </td>
                <td className={`${opcional} text-ink/70`}>{j.victorias}</td>
                <td className={`${opcional} text-ink/70`}>{j.derrotas}</td>
                <td className={`${opcional} text-ink/70`}>{j.empates}</td>
                <td className={`${opcional} text-ink/70`}>{j.kills}</td>
                <td className="px-4 py-3 text-right font-display text-xl text-tangerine-dark sm:px-6">
                  {numero(j.puntos_totales)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}