# BEARSTARDS PWA

# Integrantes
    Angel David Arras Orozco
    Angel Guillermo Gonzalez Gomez
    Dylan Munoz Flores
    Guillermo Martinez Delgadillo
    Victor Hugo Baeza Rocha

PWA de estadísticas y ranking de **Little Bearstards** (Turbo Studios). Muestra el ranking de jugadores y las mejores puntuaciones, permite registrarse e iniciar sesión, y recibe desde el juego (Unity) el resultado de cada partida.

## Arquitectura

### Arquitectura Base

El proyecto usa una **arquitectura Base**: una sola aplicación propia que contiene la API, las reglas de negocio, la autenticación y el sitio web, desplegada como un solo servicio. La misma API REST la consumen la PWA y el juego en Unity.

### Vista general

```
   PWA (React)              Juego (Unity)
   ranking, login           login, reporta
   y perfil                 partidas
        │                        │
        └── HTTPS + JSON (Token) ┘
                    │
     Render · un solo servicio (Django)
       /api/  → Django REST Framework
       /      → build de la PWA (Vite)
                    │
         Supabase (PostgreSQL)
```
### Create
El create solicitado estara en el formulario de registro de nuevos usuarios

### Read
El read solicitado estara a la hora de mostrar estadisticas despues de iniciar sesion


### Stack

| Capa | Tecnología |
|---|---|
| Front (`ui/`) | React 19 + Vite 8 + `vite-plugin-pwa` |
| Back (`backend/`) | Django + Django REST Framework |
| Base de datos | PostgreSQL en Supabase (solo como base de datos) |
| Hosting | Render, un Web Service |
| CI/CD | GitHub Actions → Render |

## Diseño de la PWA

### Pantallas

| Pantalla | Contenido | ¿Requiere sesión? |
|---|---|---|
| Ranking | Top 10 de jugadores por puntos totales | No |
| Mejores puntuaciones | Top 10 de puntuaciones en una sola partida | No |
| Iniciar sesión / Registro | Acceso con usuario y contraseña | No |
| Perfil | Estadísticas del jugador con sesión iniciada | Sí |

### Sesiones

- El registro y el inicio de sesión devuelven un **token** que identifica al jugador.
- Se usa **el mismo sistema en la PWA y en el juego**: una cuenta creada en un lado sirve en el otro.
- Para jugar en línea es **obligatorio iniciar sesión**.

### Funcionamiento sin conexión

- La interfaz queda guardada en el dispositivo y abre aunque no haya internet.
- El ranking muestra datos frescos cuando hay red y, sin red, el último que se consultó.
- Los datos personales y el inicio de sesión nunca se guardan en caché.

## Datos que maneja

**Jugador**
- Usuario y contraseña (la contraseña se guarda cifrada).
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
3. Título en español con prefijo: `feat:`, `fix:`, `chore:`, `docs:` o `ci:`.
4. Merge con **Squash and merge** (un commit por PR en `main`).
5. Si el CI falla, se corrige en la misma rama con un commit nuevo.
6. Nunca subir secretos (`.env`, contraseñas, llaves de Supabase, `SECRET_KEY`). Si se sube uno por error, hay que cambiarlo, porque queda en el historial.

### Checks de GitHub Actions

Corren en los PR y en los push a `main` y `development`.

| Check | Qué revisa | Cuándo corre |
|---|---|---|
| `Frontend CI / lint-and-build` | En `ui/`: `npm ci`, `npm run lint` y `npm run build` con Node 22. Guarda el build como artefacto por 7 días. | Cuando hay cambios en `ui/` o en su workflow |
| `Backend CI / lint-and-test` | En `backend/`: `ruff check`, que no falten migraciones (`makemigrations --check`) y `manage.py test`, contra un PostgreSQL temporal. | Siempre. Mientras no exista `backend/manage.py`, termina en verde sin hacer nada |

- El CI **nunca se conecta a Supabase**: usa su propia base de datos desechable, así que los tests no tocan datos reales.
- Si llega otro push a la misma rama, se cancela la corrida anterior.

### Despliegue (CD)

- Render despliega `main` **solo cuando el CI pasa** (`autoDeployTrigger: checksPass`).
- En cada deploy, `build.sh` compila la PWA, instala el backend, junta los archivos estáticos y aplica las migraciones en Supabase.
- Los secretos (`DATABASE_URL`, `SECRET_KEY`) viven solo en Render.
