import FormularioCuenta from '../components/cuenta/FormularioCuenta'
import TarjetaCuenta from '../components/cuenta/TarjetaCuenta'

export default function Login() {
  return (
    <TarjetaCuenta
      titulo="Iniciar sesión"
      subtitulo="Revisa tus stats y tu lugar en el ranking."
      pie={{ texto: '¿Aún no tienes cuenta?', enlace: 'Crea una', a: '/registro' }}
    >
      <FormularioCuenta tipo="login" />
    </TarjetaCuenta>
  )
}