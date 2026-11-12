import { Link } from 'react-router-dom'
import Documento from '../components/legal/Documento'
import { CORREO, DOMICILIO, EDAD_MINIMA, INTEGRANTES, RESPONSABLE, SERVICIO, SITIO } from '../legal/datos'

const Correo = () => (
  <a href={`mailto:${CORREO}`} className="font-bold underline underline-offset-4">
    {CORREO}
  </a>
)

const secciones = [
  {
    id: 'responsable',
    titulo: 'Identidad y domicilio del responsable',
    contenido: (
      <>
        <p>
          <strong>{RESPONSABLE}</strong>, {INTEGRANTES} (en adelante, “{RESPONSABLE}”, “nosotros”), con domicilio en{' '}
          {DOMICILIO}, es responsable del tratamiento de los datos personales que se recaban a través del sitio{' '}
          <strong>{SITIO}</strong>, de su aplicación web progresiva (PWA) y del videojuego <strong>{SERVICIO}</strong>{' '}
          (en conjunto, el “Servicio”).
        </p>
        <p>
          Para cualquier asunto relacionado con este aviso o con tus datos personales, puedes escribirnos a <Correo />.
        </p>
      </>
    ),
  },
  {
    id: 'datos',
    titulo: 'Datos personales que recabamos',
    contenido: (
      <>
        <p>Recabamos únicamente los datos necesarios para que el Servicio funcione:</p>
        <ul>
          <li>
            <strong>Datos de identificación y contacto:</strong> nombre de jugador (alias) y correo electrónico. En el
            sitio web el correo se solicita al crear la cuenta; desde el videojuego es opcional.
          </li>
          <li>
            <strong>Datos de autenticación:</strong> contraseña. Se almacena únicamente en forma cifrada mediante una
            función de resumen (<em>hash</em>) irreversible; nadie, incluido {RESPONSABLE}, puede conocerla.
          </li>
          <li>
            <strong>Datos de actividad en el juego:</strong> partidas jugadas, victorias, derrotas, empates, eliminaciones
            (kills), puntos totales, mejor puntuación e historial de partidas (fecha, puntos, eliminaciones, resultado y
            si la partida terminó por abandono).
          </li>
          <li>
            <strong>Datos técnicos:</strong> identificadores de sesión (tokens) generados para el sitio web y para el
            videojuego, y registros técnicos del servidor (fecha y hora, ruta solicitada, código de respuesta y tiempo de
            respuesta). En estos registros las contraseñas y los correos electrónicos se ocultan.
          </li>
        </ul>
        <p>
          <strong>No recabamos datos personales sensibles</strong> (como origen étnico, estado de salud, creencias,
          preferencia sexual u opiniones políticas), ni datos financieros o patrimoniales. El Servicio es gratuito y no
          solicita medios de pago.
        </p>
      </>
    ),
  },
  {
    id: 'finalidades',
    titulo: 'Finalidades del tratamiento',
    contenido: (
      <>
        <p>
          Tus datos personales se utilizan para las siguientes <strong>finalidades primarias</strong>, que son
          necesarias para prestar el Servicio:
        </p>
        <ol>
          <li>Crear, autenticar y administrar tu cuenta de jugador en el sitio web y en el videojuego.</li>
          <li>Permitir tu participación en partidas en línea y mostrar tu nombre de jugador a tu rival.</li>
          <li>Registrar el resultado de cada partida y calcular tus estadísticas e historial.</li>
          <li>
            Publicar la clasificación (ranking) de jugadores, que muestra tu nombre de jugador y tus estadísticas.
          </li>
          <li>Enviarte un correo electrónico de bienvenida al crear tu cuenta.</li>
          <li>
            Mantener la seguridad e integridad del Servicio: prevenir accesos no autorizados, partidas duplicadas, abusos
            o trampas, y diagnosticar fallas técnicas.
          </li>
          <li>Atender tus solicitudes, dudas y el ejercicio de tus derechos.</li>
        </ol>
        <p>
          <strong>No utilizamos tus datos para finalidades secundarias</strong>: no los usamos con fines publicitarios,
          de mercadotecnia o prospección comercial, ni para elaborar perfiles, y no los vendemos ni los rentamos.
        </p>
      </>
    ),
  },
  {
    id: 'publico',
    titulo: 'Información visible para otras personas',
    contenido: (
      <>
        <p>Por la naturaleza del Servicio, cierta información es visible para terceros:</p>
        <ul>
          <li>
            Tu <strong>nombre de jugador y tus estadísticas</strong> pueden aparecer en la clasificación pública del sitio,
            que puede consultar cualquier persona sin iniciar sesión.
          </li>
          <li>Durante una partida, tu rival ve tu nombre de jugador.</li>
        </ul>
        <p>
          Tu correo electrónico y tu contraseña <strong>nunca</strong> se muestran a otros usuarios. Te recomendamos no
          usar tu nombre real ni datos que te identifiquen como nombre de jugador.
        </p>
      </>
    ),
  },
  {
    id: 'proveedores',
    titulo: 'Proveedores y transferencias de datos',
    contenido: (
      <>
        <p>
          Para operar el Servicio nos apoyamos en proveedores de tecnología que tratan datos personales únicamente por
          nuestra cuenta y conforme a nuestras instrucciones (remisiones), sin usarlos para fines propios:
        </p>
        <ul>
          <li>
            <strong>Render</strong>: alojamiento del servidor y de la aplicación web.
          </li>
          <li>
            <strong>Supabase</strong>: almacenamiento de la base de datos.
          </li>
          <li>
            <strong>Cloudflare</strong>: dominio, entrega de contenido y protección contra ataques.
          </li>
          <li>
            <strong>Resend</strong>: envío del correo electrónico de bienvenida.
          </li>
          <li>
            <strong>Photon (Exit Games)</strong>: servidores de partidas multijugador del videojuego; recibe tu nombre de
            jugador y un identificador numérico de tu cuenta.
          </li>
        </ul>
        <p>
          Algunos de estos proveedores tienen su infraestructura fuera de México (por ejemplo, en Estados Unidos o en la
          Unión Europea), por lo que tus datos pueden almacenarse o procesarse en otros países, siempre con medidas de
          seguridad equivalentes a las descritas en este aviso.
        </p>
        <p>
          <strong>No transferimos tus datos personales a terceros</strong> para que los traten con fines propios. Solo los
          comunicaríamos a autoridades competentes cuando exista un requerimiento fundado y motivado o una obligación
          legal, en los casos en que la ley no exige tu consentimiento.
        </p>
      </>
    ),
  },
  {
    id: 'derechos',
    titulo: 'Derechos ARCO y cómo ejercerlos',
    contenido: (
      <>
        <p>
          Tienes derecho a <strong>Acceder</strong> a tus datos personales, <strong>Rectificarlos</strong> si son
          inexactos o incompletos, <strong>Cancelarlos</strong> cuando consideres que no se requieren para las
          finalidades señaladas, y <strong>Oponerte</strong> a su tratamiento para fines específicos (derechos ARCO).
        </p>
        <p>Algunos derechos los puedes ejercer tú mismo, sin enviar una solicitud:</p>
        <ul>
          <li>
            <strong>Acceso:</strong> en <Link to="/panel" className="font-bold underline underline-offset-4">Mi panel</Link>{' '}
            ves tus estadísticas y tu historial de partidas.
          </li>
          <li>
            <strong>Cancelación:</strong> en Mi panel, con la opción <em>Eliminar cuenta</em>, confirmando con tu
            contraseña. Se aplica de inmediato.
          </li>
          <li>
            <strong>Contraseña olvidada:</strong> en{' '}
            <Link to="/recuperar" className="font-bold underline underline-offset-4">
              ¿Olvidaste tu contraseña?
            </Link>{' '}
            recibes en tu correo un enlace para elegir una nueva, que vence en 2 horas.
          </li>
        </ul>
        <p>Para cualquier otro caso, o si no puedes iniciar sesión, envía una solicitud a <Correo /> que contenga:</p>
        <ol>
          <li>Tu nombre de jugador y el correo electrónico asociado a tu cuenta.</li>
          <li>
            Los documentos que acrediten tu identidad o, en su caso, la de tu representante legal (o de tu madre, padre o
            tutor, si eres menor de edad).
          </li>
          <li>La descripción clara del derecho que deseas ejercer y de los datos a los que se refiere.</li>
          <li>Cualquier otro elemento que facilite la localización de tus datos.</li>
        </ol>
        <p>
          Te responderemos en un plazo máximo de <strong>20 días hábiles</strong> contados desde la recepción de tu
          solicitud y, si resulta procedente, la haremos efectiva dentro de los <strong>15 días hábiles</strong>{' '}
          siguientes a la respuesta. Estos plazos podrán ampliarse una sola vez por un periodo igual cuando las
          circunstancias lo justifiquen.
        </p>
        <p>
          La <strong>cancelación</strong> implica cerrar tu cuenta: se eliminan tu correo, tu contraseña y tus sesiones
          activas, tu nombre de jugador se sustituye por un identificador anónimo y dejas de aparecer en la clasificación.
          Los resultados de las partidas que ya jugaste se conservan solo de forma anónima, porque forman parte de las
          estadísticas de los otros jugadores.
        </p>
      </>
    ),
  },
  {
    id: 'revocacion',
    titulo: 'Revocación del consentimiento y limitación del uso',
    contenido: (
      <>
        <p>
          Puedes revocar en cualquier momento el consentimiento que nos otorgaste, siguiendo el mismo procedimiento
          descrito para los derechos ARCO. Ten en cuenta que, como los datos se utilizan para finalidades necesarias,
          la revocación implicará la cancelación de tu cuenta y que ya no podrás usar el Servicio.
        </p>
        <p>
          Para limitar el uso o la divulgación de tus datos, puedes escribirnos a <Correo />. En cualquier momento puedes
          cerrar sesión en el sitio web o en el videojuego; al hacerlo se invalida el identificador de sesión de ese
          dispositivo.
        </p>
      </>
    ),
  },
  {
    id: 'tecnologias',
    titulo: 'Uso de almacenamiento local y tecnologías similares',
    contenido: (
      <>
        <p>
          <strong>No utilizamos cookies de rastreo, publicidad ni herramientas de analítica de terceros.</strong> Para
          que el Servicio funcione, guardamos cierta información únicamente en tu propio dispositivo:
        </p>
        <ul>
          <li>
            <strong>Sesión del sitio web:</strong> tu identificador de sesión y tus datos básicos de jugador, en el
            almacenamiento local del navegador, para mantener tu sesión iniciada. Se borran al cerrar sesión.
          </li>
          <li>
            <strong>Funcionamiento sin conexión:</strong> la aplicación guarda una copia de la clasificación pública para
            mostrarla sin internet. Si creas tu cuenta sin conexión, el registro se conserva en tu dispositivo hasta por
            24 horas y se envía automáticamente al recuperar la conexión.
          </li>
          <li>
            <strong>Videojuego:</strong> tu identificador de sesión, tu nombre de jugador y, si no hubo conexión, los
            resultados de partidas pendientes de enviar, para no perderlos.
          </li>
        </ul>
        <p>
          Puedes eliminar esta información en cualquier momento desde la configuración de tu navegador (borrando los
          datos del sitio) o cerrando sesión.
        </p>
      </>
    ),
  },
  {
    id: 'conservacion',
    titulo: 'Conservación y seguridad de los datos',
    contenido: (
      <>
        <p>
          Conservamos tus datos mientras tu cuenta esté activa. Cuando solicites la cancelación, eliminaremos o
          anonimizaremos tus datos de forma definitiva como se describe en la sección de derechos ARCO, salvo aquellos que
          debamos conservar para cumplir una obligación legal. Los registros técnicos
          del servidor se conservan por un periodo limitado y solo con fines de seguridad y diagnóstico.
        </p>
        <p>Aplicamos medidas de seguridad administrativas, técnicas y físicas para proteger tus datos, entre ellas:</p>
        <ul>
          <li>Comunicación cifrada mediante HTTPS en el sitio web y en el videojuego.</li>
          <li>Contraseñas almacenadas únicamente en forma cifrada e irreversible.</li>
          <li>Identificadores de sesión independientes por dispositivo, que se invalidan al cerrar sesión.</li>
          <li>Acceso a la base de datos restringido al servidor del Servicio y a los integrantes autorizados.</li>
        </ul>
        <p>
          Si ocurriera una vulneración de seguridad que afecte de forma significativa tus derechos, te informaremos de
          inmediato para que puedas tomar las medidas necesarias.
        </p>
      </>
    ),
  },
  {
    id: 'menores',
    titulo: 'Datos de menores de edad',
    contenido: (
      <p>
        El Servicio está dirigido a personas de <strong>{EDAD_MINIMA} años o más</strong>. Si eres menor de 18 años,
        necesitas la autorización de tu madre, padre o tutor para crear una cuenta y para que tratemos tus datos. Si
        detectamos que una cuenta pertenece a una persona menor de {EDAD_MINIMA} años, o a un menor de edad sin dicha
        autorización, la cancelaremos. Si eres madre, padre o tutor y crees que tu hija o hijo nos proporcionó datos sin
        tu autorización, escríbenos a <Correo />.
      </p>
    ),
  },
  {
    id: 'cambios',
    titulo: 'Cambios al aviso de privacidad',
    contenido: (
      <p>
        Este aviso puede modificarse por cambios en la ley, en nuestras prácticas o en el Servicio. Cualquier cambio se
        publicará en esta misma página, indicando la fecha de la última actualización. Si el cambio es relevante, también
        te lo informaremos a través del sitio o del correo electrónico asociado a tu cuenta.
      </p>
    ),
  },
  {
    id: 'autoridad',
    titulo: 'Autoridad competente',
    contenido: (
      <p>
        Este aviso se emite conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y
        demás normativa aplicable. Si consideras que tu derecho a la protección de datos personales ha sido vulnerado,
        puedes acudir ante la autoridad competente en la materia.
      </p>
    ),
  },
]

export default function Privacidad() {
  return (
    <Documento
      etiqueta="Legal"
      titulo="Aviso de privacidad integral"
      intro={
        <p>
          En {RESPONSABLE} respetamos tu privacidad. Este aviso explica qué datos personales recabamos cuando usas{' '}
          {SERVICIO}, para qué los usamos, con quién los compartimos y cómo puedes ejercer tus derechos.
        </p>
      }
      secciones={secciones}
      otro={{ texto: 'Términos y condiciones de uso', a: '/terminos' }}
    />
  )
}
