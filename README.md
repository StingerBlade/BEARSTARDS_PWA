# BEARSTARDS PWA

# Integrantes
    Angel David Arras Orozco
    Angel Guillermo Gonzalez Gomez
    Dylan Munoz Flores
    Guillermo Martinez Delgadillo
    Victor Hugo Baeza Rocha


PWA de **Little Bearstards** (Turbo Studios). Presenta el juego, muestra el ranking de jugadores, permite registrarse e iniciar sesión, y recibe desde el juego (Unity) el resultado de cada partida.

> **Estado:** en desarrollo. Este documento describe la arquitectura y el diseño acordados; el backend y el despliegue en Render todavía no existen.

## Arquitectura

### Arquitectura Base

El proyecto usa una **arquitectura Base**: una sola aplicación propia que contiene la API, las reglas de negocio, la autenticación y el sitio web, desplegada como un solo servicio. La misma API REST la consumen la PWA y el juego en Unity.

### Vista general

```
   PWA (React)              Juego (Unity)
   inicio, ranking,         login, reporta
   login y panel            partidas
        │                        │
        └── HTTPS + JSON (Token) ┘
                    │
     Render · un solo servicio (Django)
       /api/  → Django REST Framework
       /      → build de la PWA (Vite)
                    │
         Supabase (PostgreSQL)
```

### Stack

| Capa | Tecnología |
|---|---|
| Front (`ui/`) | React 19 + Vite 8 + `vite-plugin-pwa` + React Router 7 + Tailwind CSS 4 |
| Back (`backend/`) | Django + Django REST Framework |
| Base de datos | PostgreSQL en Supabase (solo como base de datos) |
| Hosting | Render, un Web Service |
| CI/CD | GitHub Actions → Render |

## Diseño de la PWA

### Pantallas

| Ruta | Pantalla | Contenido | ¿Requiere sesión? |
|---|---|---|---|
| `/#/` | Inicio | Portada del juego: premisa, cómo se juega, armas, mapa de la juguetería, galería, adelanto del ranking y equipo | No |
| `/#/ranking` | Ranking | Podio de los 3 primeros, tabla de jugadores por puntos totales, buscador por nombre y la posición del jugador con sesión iniciada | No |
| `/#/login` | Iniciar sesión | Usuario y contraseña | No |
| `/#/registro` | Registro | Usuario y contraseña (mínimo 8 caracteres) | No |
| `/#/panel` | Panel | Estadísticas del jugador, gráfica de puntos de sus últimas 10 partidas e historial de partidas | Sí |

**Datos que muestra cada pantalla**

- **Ranking:** usuario, puntos totales, victorias, derrotas, empates y kills.
- **Panel, estadísticas:** partidas, victorias, derrotas, empates, kills, puntos totales y mejor puntuación.
- **Panel, historial y gráfica:** por partida, la fecha, los puntos, las kills, el resultado (victoria, derrota o empate) y si fue por abandono.

La PWA solo muestra los datos de la sección *Datos que maneja*. No se piden ni se guardan correos, rachas, logros ni rankings por periodo.

- Se usa `HashRouter`: las rutas van después del `#`, así Django solo tiene que servir `index.html`.
- Si alguien entra a `/#/panel` sin sesión, se le manda a iniciar sesión.

### Sesiones

- El registro y el inicio de sesión devuelven un **token** que identifica al jugador.
- Se usa **el mismo sistema en la PWA y en el juego**: una cuenta creada en un lado sirve en el otro.
- Para jugar en línea es **obligatorio iniciar sesión**.

### Funcionamiento sin conexión

- La interfaz queda guardada en el dispositivo y abre aunque no haya internet.
- El ranking muestra datos frescos cuando hay red y, sin red, el último que se consultó.
- Los datos personales y el inicio de sesión nunca se guardan en caché.

## Guía de estilos

Estilo **neobrutalismo cartoon**: toma del neobrutalismo los bordes gruesos, las sombras duras sin difuminar y los colores planos y saturados, y los suaviza con esquinas redondeadas, tipografía juguetona y animaciones, ambientado en una juguetería de noche. Los osos se muestran en **low poly**.

### Colores

| Token | Hex | Uso |
|---|---|---|
| `ink` | `#1b1030` | Bordes, sombras, contornos y texto sobre fondos claros |
| `night` | `#241a55` | Fondo principal y color del tema del navegador (`theme-color`) |
| `night-2` | `#34248a` | Fondo de secciones y tarjetas sobre `night` |
| `night-3` | `#46309f` | Tercer nivel de fondo |
| `paper` | `#fffaf0` | Texto principal sobre fondo oscuro y tarjetas claras |
| `cream` | `#fff3d6` | Fondo de secciones claras |
| `sun` | `#ffd23f` | Color principal: botón principal y primer lugar del ranking |
| `pink` | `#ff5fa2` | Acento: botones secundarios y tercer lugar |
| `sky` | `#3ec6ff` | Acento: segundo lugar y contorno de foco del teclado |
| `mint` | `#5be3b0` | Acento: estados positivos y etiquetas |
| `tangerine` | `#ff8a3d` | Acento: resaltados |
| `fur` / `fur-dark` | `#d99a5b` / `#a8652b` | Pelaje de los osos |

- Sobre los colores de acento (`sun`, `pink`, `sky`, `mint`, `tangerine`) el texto siempre va en `ink`.
- Sobre `night` el texto va en `paper`.
- Las secciones de la página de inicio alternan fondo oscuro (`night`) y claro (`cream`).
- La paleta es independiente de los colores del logo de Turbo Studios.

### Tipografía

| Uso | Fuente | Detalles |
|---|---|---|
| Títulos (`h1`–`h4`) y botones | **Lilita One** | Peso 400, interlineado 1.05 |
| Texto | **Fredoka** (variable) | 17 px, interlineado 1.6 |

- Las dos fuentes se instalan con npm (`@fontsource`), así que funcionan sin conexión.
- Los títulos grandes llevan contorno y sombra oscura (`text-outline`).
- Números con formato de México (`1,250`).

### Bordes y sombras

| Clase | Borde | Sombra |
|---|---|---|
| `toon-sm` | 3 px `ink` | 3 px 3 px dura |
| `toon` | 3 px `ink` | 5 px 5 px dura |
| `toon-lg` | 4 px `ink` | 8 px 8 px dura |

- Esquinas redondeadas: botones en forma de píldora; tarjetas e inputs con radio grande (16 a 32 px).
- Las sombras nunca se difuminan.

### Componentes

- **Botones:** píldora con borde y sombra `toon`, texto en Lilita One. Variantes: principal (`sun`), `pink`, `sky`, claro (`paper`) y oscuro (`ink`). Al pasar el mouse se levantan; al presionar se hunden y pierden la sombra.
- **Inputs:** fondo blanco, borde de 3 px `ink`, esquinas redondeadas y sombra pequeña que se vuelve `sky` al enfocar.
- **Podio del ranking:** 1.º en `sun`, 2.º en `sky`, 3.º en `pink`.
- **Íconos:** propios, en SVG, con el mismo estilo que los osos: contorno grueso en `ink` y colores planos. No se usan emojis.
- **Osos:** imágenes WebP low poly con fondo transparente. Son provisionales: se reemplazan por capturas de los modelos finales del juego con los mismos nombres de archivo.

### Animación y accesibilidad

- Animaciones suaves: osos que flotan (`bob`), que se balancean (`wiggle`), estrellas que parpadean (`twinkle`), una cinta de texto en movimiento (`marquee`) y elementos que aparecen al hacer scroll.
- Si el usuario tiene activado **reducir movimiento** en su sistema, se desactivan todas las animaciones.
- Todo elemento enfocado con el teclado muestra un contorno `sky` de 4 px.
- Ancho máximo del contenido: entre 1024 y 1280 px, centrado.

### Tecnología de estilos

- **Tailwind CSS 4**: los colores, fuentes, sombras y animaciones se definen como *tokens* en `ui/src/index.css` (`@theme`).
- Las clases reutilizables de botones e inputs están en `ui/src/components/ui.js`.

## Datos que maneja

**Jugador**
- Usuario y contraseña (la contraseña se guarda con hash, nunca en texto plano).
- Partidas jugadas, victorias, derrotas y empates.
- Kills.
- Puntos totales.
- Mejor puntuación.

**Partida**
- Identificador único de la partida.
- Fecha en que terminó.
- Si terminó por abandono.

**Participación** (un registro por cada jugador en cada partida)
- Puntos y kills que hizo en esa partida.
- Resultado: victoria, derrota o empate.
- Si abandonó.

### Reglas del juego que respetan los datos

- Todas las partidas duran 10 minutos.
- Gana quien tenga más puntos; si quedan iguales, es empate.
- Quien abandona pierde automáticamente.
- El juego envía los datos solo al terminar la partida, y cada partida se registra una sola vez.

## Flujo de trabajo y CI/CD

### Ramas

```
feat/<nombre>/<tema>  ──PR──►  development  ──PR──►  main  ──►  Render (deploy)
```

- Nunca se hace push directo a `main` ni a `development`: todo entra por Pull Request.
- Ramas de trabajo: `feat/<nombre>/<tema>`, `fix/<nombre>/<tema>` y `chore/<nombre>/<tema>`.
- Los PR normales van a `development`. Solo se abre PR de `development` a `main` cuando hay algo estable, porque **cada merge a `main` despliega a producción**.

### Reglas de todo PR

1. El CI debe estar en verde para poder mergear.
2. Al menos 1 aprobación de otra persona del equipo.
3. Llenar la plantilla del PR (se carga sola): qué cambia y el checklist.
4. Título en español con prefijo: `feat:`, `fix:`, `chore:`, `docs:` o `ci:`.
5. Merge con **Squash and merge** (un commit por PR en `main`).
6. Si el CI falla, se corrige en la misma rama con un commit nuevo.
7. Nunca subir secretos (`.env`, contraseñas, llaves de Supabase, `SECRET_KEY`). Si se sube uno por error, hay que cambiarlo, porque queda en el historial.

### Checks de GitHub Actions

Corren **siempre** en los PR hacia `main` o `development` y en los push a esas ramas, sin importar qué archivos cambien. Así, si se marcan como obligatorios en GitHub, ningún PR se queda esperando un check que nunca corre.

| Check | Qué revisa |
|---|---|
| `Frontend CI / lint-and-build` | En `ui/`: `npm ci`, `npm run lint` y `npm run build` con Node 22. Guarda el build como artefacto por 7 días. |
| `Backend CI / lint-and-test` | En `backend/`: `ruff check`, que no falten migraciones (`makemigrations --check`) y `manage.py test`, contra un PostgreSQL temporal. Mientras no exista `backend/manage.py`, termina en verde sin hacer nada. |

- El CI **nunca se conecta a Supabase**: usa su propia base de datos desechable, así que los tests no tocan datos reales.
- Si llega otro push a la misma rama, se cancela la corrida anterior.

### Despliegue (CD)

- Render despliega `main` **solo cuando el CI pasa** (`autoDeployTrigger: checksPass`).
- En cada deploy, `build.sh` compila la PWA, instala el backend, junta los archivos estáticos y aplica las migraciones en Supabase.
- Los secretos (`DATABASE_URL`, `SECRET_KEY`) viven solo en Render.
