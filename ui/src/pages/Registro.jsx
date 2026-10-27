import FormularioCuenta from '../components/cuenta/FormularioCuenta'
import TarjetaCuenta from '../components/cuenta/TarjetaCuenta'

export default function Registro() {
  return (
    <TarjetaCuenta
      titulo="Crear cuenta"
      subtitulo="Elige tu nombre de oso. Es el mismo que verás en el juego."
      pie={{ texto: '¿Ya tienes cuenta?', enlace: 'Inicia sesión', a: '/login' }}
    >
      <FormularioCuenta tipo="registro" />
    </TarjetaCuenta>
  )
}