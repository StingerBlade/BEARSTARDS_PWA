import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Armas from '../components/inicio/Armas'
import Cierre from '../components/inicio/Cierre'
import Cinta from '../components/inicio/Cinta'
import ComoSeJuega from '../components/inicio/ComoSeJuega'
import Equipo from '../components/inicio/Equipo'
import Galeria from '../components/inicio/Galeria'
import Hero from '../components/inicio/Hero'
import Jugueteria from '../components/inicio/Jugueteria'
import Premisa from '../components/inicio/Premisa'
import RankingAdelanto from '../components/inicio/RankingAdelanto'

const irA = (id) => document.getElementById(id)?.scrollIntoView()

export default function Home() {
  const { state } = useLocation()
  const navigate = useNavigate()

  // Si se llegó desde el menú de otra pantalla, baja a la sección pedida
  useEffect(() => {
    if (!state?.seccion) return
    requestAnimationFrame(() => irA(state.seccion))
    navigate('.', { replace: true, state: null })
  }, [state, navigate])

  return (
    <>
      <Hero irA={irA} />
      <Cinta />
      <Premisa />
      <ComoSeJuega />
      <Armas />
      <Jugueteria />
      <Galeria />
      <RankingAdelanto />
      <Equipo />
      <Cierre />
    </>
  )
}