import { Link } from 'react-router-dom'
import Documento from '../components/legal/Documento'
import { CORREO, EDAD_MINIMA, INTEGRANTES, RESPONSABLE, SERVICIO, SITIO } from '../legal/datos'

const Correo = () => (
  <a href={`mailto:${CORREO}`} className="font-bold underline underline-offset-4">
    {CORREO}
  </a>
)

const Aviso = () => (
  <Link to="/privacidad" className="font-bold underline underline-offset-4">
    Aviso de privacidad
  </Link>
)

const secciones = [
  {
    id: 'aceptacion',
    titulo: 'Aceptación de los términos',
    contenido: (
      <>
        <p>
          Estos Términos y condiciones de uso (los “Términos”) regulan el acceso y uso del sitio <strong>{SITIO}</strong>,
          de su aplicación web progresiva (PWA) y del videojuego <strong>{SERVICIO}</strong> (en conjunto, el
          “Servicio”), operados por <strong>{RESPONSABLE}</strong>, {INTEGRANTES}.
        </p>
        <p>
          Al crear una cuenta o usar el Servicio, declaras que leíste, entendiste y aceptas estos Términos y nuestro{' '}
          <Aviso />. Si no estás de acuerdo, no debes usar el Servicio.
        </p>
      </>
    ),
  },
  {
    id: 'servicio',
    titulo: 'Descripción del Servicio',
    contenido: (
      <>
        <p>
          {SERVICIO} es un videojuego multijugador de combate uno contra uno, con estética de caricatura, desarrollado como
          proyecto académico. El sitio web presenta el juego, permite crear una cuenta, consultar la clasificación pública
          de jugadores y revisar las estadísticas e historial de partidas propias.
        </p>
        <p>
          El Servicio es <strong>gratuito</strong>, no incluye compras, suscripciones ni publicidad, y no otorga premios
          de ningún tipo.
        </p>
      </>
    ),
  },
  {
    id: 'requisitos',
    titulo: 'Requisitos para usar el Servicio',
    contenido: (
      <ul>
        <li>
          Debes tener al menos <strong>{EDAD_MINIMA} años</strong>. Si eres menor de 18 años, necesitas la autorización
          de tu madre, padre o tutor, quien acepta estos Términos en tu nombre y es responsable de tu uso del Servicio.
        </li>
        <li>
          Debes proporcionar información verdadera al registrarte. Si tu correo cambia, puedes pedir que lo actualicemos
          conforme al <Aviso />.
        </li>
        <li>Para jugar en línea necesitas una cuenta y una conexión a internet.</li>
      </ul>
    ),
  },
  {
    id: 'cuenta',
    titulo: 'Tu cuenta',
    contenido: (
      <>
        <ul>
          <li>Tu cuenta es personal e intransferible; no puedes venderla, prestarla ni compartirla.</li>
          <li>
            Eres responsable de mantener la confidencialidad de tu contraseña y de toda la actividad realizada con tu
            cuenta. Si sospechas un acceso no autorizado, cierra sesión en tus dispositivos y escríbenos de inmediato a{' '}
            <Correo /> para proteger tu cuenta.
          </li>
          <li>
            Tu nombre de jugador es público. No puede ser ofensivo, discriminatorio, de contenido sexual, suplantar a otra
            persona o marca, ni contener datos personales de terceros. Podemos solicitarte que lo cambies o suspender la
            cuenta si incumple esta regla.
          </li>
          <li>
            Puedes solicitar el cierre de tu cuenta en cualquier momento escribiendo a <Correo />, conforme al
            procedimiento del <Aviso />.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'conducta',
    titulo: 'Reglas de conducta',
    contenido: (
      <>
        <p>Al usar el Servicio te comprometes a no:</p>
        <ul>
          <li>
            Usar trampas, programas de terceros, modificaciones del cliente, bots o cualquier medio que otorgue una ventaja
            injusta o altere los resultados de las partidas.
          </li>
          <li>
            Manipular, falsificar o enviar resultados de partidas por medios distintos al propio videojuego, ni intentar
            alterar la clasificación o las estadísticas.
          </li>
          <li>
            Aprovechar errores del Servicio en lugar de reportarlos, o acordar resultados con otros jugadores para inflar
            estadísticas.
          </li>
          <li>
            Intentar acceder sin autorización a cuentas, servidores, bases de datos o sistemas del Servicio, ni realizar
            pruebas de vulnerabilidad, ataques de denegación de servicio o cargas automatizadas.
          </li>
          <li>Acosar, amenazar, discriminar o suplantar a otros jugadores o a {RESPONSABLE}.</li>
          <li>Usar el Servicio con fines comerciales o para cualquier actividad contraria a la ley.</li>
        </ul>
        <p>
          Abandonar una partida en curso (salir desde el menú, cerrar el juego o desconectarse) se registra como derrota.
        </p>
      </>
    ),
  },
  {
    id: 'resultados',
    titulo: 'Partidas, estadísticas y clasificación',
    contenido: (
      <>
        <p>
          Los resultados de las partidas se calculan en el videojuego y se registran en nuestros servidores al terminar
          cada partida. Si en ese momento no hay conexión, el juego conserva el resultado y lo envía después.
        </p>
        <p>
          Las estadísticas y la clasificación tienen un fin exclusivamente recreativo, no constituyen un concurso y no dan
          derecho a premios. Nos reservamos el derecho de corregir, invalidar o eliminar resultados obtenidos mediante
          trampas, errores técnicos o incumplimiento de estos Términos, y de reiniciar la clasificación cuando sea
          necesario.
        </p>
      </>
    ),
  },
  {
    id: 'contenido',
    titulo: 'Contenido del juego',
    contenido: (
      <p>
        {SERVICIO} contiene violencia de caricatura entre peluches, sin sangre ni contenido explícito. Las marcas,
        logotipos y nombres comerciales que aparecen dentro del juego son <strong>parodias</strong> creadas para el
        proyecto y no están afiliados, patrocinados ni respaldados por las marcas reales.
      </p>
    ),
  },
  {
    id: 'propiedad',
    titulo: 'Propiedad intelectual',
    contenido: (
      <>
        <p>
          El videojuego, el sitio web, su código, diseños, personajes, ilustraciones, modelos 3D, textos, logotipos y
          demás contenidos son propiedad de {RESPONSABLE} y de sus integrantes, o se usan con autorización o bajo las
          licencias correspondientes, y están protegidos por la Ley Federal del Derecho de Autor y demás leyes aplicables.
        </p>
        <p>
          Te otorgamos una licencia personal, gratuita, limitada, no exclusiva, revocable e intransferible para usar el
          Servicio con fines recreativos y no comerciales. No puedes copiar, modificar, distribuir, vender, descompilar o
          aplicar ingeniería inversa al Servicio, salvo en los casos que la ley permita expresamente.
        </p>
      </>
    ),
  },
  {
    id: 'disponibilidad',
    titulo: 'Disponibilidad y cambios del Servicio',
    contenido: (
      <p>
        {SERVICIO} es un proyecto académico en desarrollo. El Servicio se ofrece “tal como está” y “según
        disponibilidad”: puede presentar errores, interrupciones o periodos de mantenimiento, y podemos modificar,
        suspender o dar por terminado el Servicio, total o parcialmente, en cualquier momento. Cuando sea posible,
        avisaremos con anticipación a través del sitio web.
      </p>
    ),
  },
  {
    id: 'responsabilidad',
    titulo: 'Limitación de responsabilidad',
    contenido: (
      <>
        <p>En la medida permitida por la ley, {RESPONSABLE} no será responsable por:</p>
        <ul>
          <li>Interrupciones, fallas de conexión o pérdida de progreso, estadísticas o resultados de partidas.</li>
          <li>
            Fallas de los servicios de terceros de los que depende el Servicio (alojamiento, base de datos, red o
            servidores multijugador).
          </li>
          <li>Daños derivados del uso indebido del Servicio o del incumplimiento de estos Términos.</li>
          <li>La conducta de otros jugadores dentro o fuera del Servicio.</li>
        </ul>
        <p>Nada en estos Términos limita los derechos que te otorga la legislación mexicana y que no pueden renunciarse.</p>
      </>
    ),
  },
  {
    id: 'suspension',
    titulo: 'Suspensión y cancelación de cuentas',
    contenido: (
      <p>
        Podemos suspender o cancelar, temporal o definitivamente, la cuenta de quien incumpla estos Términos, en especial
        las reglas de conducta, así como invalidar los resultados obtenidos de forma indebida. Si consideras que la medida
        fue un error, puedes escribirnos a <Correo /> para que la revisemos.
      </p>
    ),
  },
  {
    id: 'privacidad',
    titulo: 'Privacidad',
    contenido: (
      <p>
        El tratamiento de tus datos personales se rige por nuestro <Aviso />, que forma parte de estos Términos.
      </p>
    ),
  },
  {
    id: 'modificaciones',
    titulo: 'Modificaciones a los Términos',
    contenido: (
      <p>
        Podemos actualizar estos Términos. Publicaremos la versión vigente en esta página con su fecha de actualización y,
        si los cambios son relevantes, te lo informaremos por el sitio o por correo electrónico. Si continúas usando el
        Servicio después de la publicación, se entenderá que aceptas los Términos modificados.
      </p>
    ),
  },
  {
    id: 'ley',
    titulo: 'Legislación aplicable y jurisdicción',
    contenido: (
      <p>
        Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Para su interpretación y cumplimiento, las
        partes se someten a los tribunales competentes de la ciudad de Chihuahua, Chihuahua, renunciando a cualquier otro
        fuero que pudiera corresponderles por razón de su domicilio presente o futuro, salvo que la ley aplicable disponga
        otra cosa.
      </p>
    ),
  },
  {
    id: 'contacto',
    titulo: 'Contacto',
    contenido: <p>Para dudas, aclaraciones o reportes sobre estos Términos, escríbenos a <Correo />.</p>,
  },
]

export default function Terminos() {
  return (
    <Documento
      etiqueta="Legal"
      titulo="Términos y condiciones de uso"
      intro={
        <p>
          Léelos con atención: establecen las reglas para usar {SERVICIO}, tus responsabilidades como jugador y las
          nuestras.
        </p>
      }
      secciones={secciones}
      otro={{ texto: 'Aviso de privacidad', a: '/privacidad' }}
    />
  )
}
