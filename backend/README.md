# Backend — BEARSTARDS PWA

API REST de la PWA de **Little Bearstards**: cuentas de usuario, sesiones con token, ranking y registro de partidas que envía el juego (Unity). También sirve el build de la interfaz en producción.

← [Volver al README principal](../README.md) · [Interfaz (`ui/`)](../ui/README.md)

## Stack

| | |
|---|---|
| Lenguaje | Python 3.12 |
| Framework | Django 5.2 + Django REST Framework |
| Sesiones | Token de DRF (`rest_framework.authtoken`) |
| Base de datos | PostgreSQL en Supabase (solo como base de datos) |
| Producción | Render (gunicorn + WhiteNoise) |

## Estructura

```
backend/
├── config/            # proyecto Django: settings, urls, wsgi
├── jugadores/         # app principal: modelos Jugador, Partida y Participacion
│   ├── migrations/    # generadas con makemigrations (no se editan a mano)
│   ├── admin.py
│   └── models.py
├── manage.py
├── requirements.txt
└── .env               # solo local, nunca se sube
```

## Puesta en marcha local

Requisitos: **Python 3.12**. En Windows con Git Bash, desde `backend/`:

```bash
python -m venv .venv
```

```bash
source .venv/Scripts/activate
```

En PowerShell la activación es `.venv\Scripts\Activate.ps1`.

```bash
pip install -r requirements.txt ruff
```

Crea `backend/.env`:

```
DEBUG=True
SECRET_KEY=cualquier-cosa-larga-para-local
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://postgres:postgres@localhost:5432/bearstards
```

- Para desarrollar, usa una base local (ver [Docker](#base-de-datos-local-con-docker)) o un proyecto de Supabase de pruebas, no el de producción.
- La URL de Supabase sale de **Connect → Session pooler → URI**. Si la contraseña tiene caracteres especiales, se codifican (`@` → `%40`).

Crear las tablas y arrancar:

```bash
python manage.py migrate
```

```bash
python manage.py runserver
```

Admin en `http://127.0.0.1:8000/admin/`. Para crear el superusuario desde Git Bash:

```bash
winpty python manage.py createsuperuser
```

## Base de datos

| Tabla | Qué guarda |
|---|---|
| `jugador` | Usuario, contraseña (con hash), partidas, victorias, derrotas, empates, kills, puntos totales y mejor puntuación |
| `partida` | `match_id` único, fecha en que terminó, si fue por abandono y quién la reportó |
| `participacion` | Una por jugador en cada partida: puntos, kills, resultado (victoria, derrota o empate) y abandono |

- Las tablas las crea Django con `makemigrations` + `migrate`. **No se crean a mano en Supabase.**
- `AUTH_USER_MODEL = "jugadores.Jugador"` debe existir antes de la primera migración.
- En Supabase la **Data API está desactivada** (Integrations → Data API): nadie puede leer las tablas sin pasar por Django. Si se crea otro proyecto de Supabase, hay que volver a desactivarla.

## API (planeada)

| Método y ruta | Sesión | Uso |
|---|---|---|
| `POST /api/auth/registro/` | No | Crear cuenta; devuelve token y jugador |
| `POST /api/auth/login/` | No | Iniciar sesión; devuelve token y jugador |
| `POST /api/auth/logout/` | Sí | Cerrar sesión |
| `GET /api/ranking/` | No | Top 10 por puntos totales |
| `GET /api/yo/` | Sí | Estadísticas del jugador |
| `GET /api/yo/partidas/` | Sí | Historial de partidas del jugador |
| `POST /api/partidas/` | Sí | El juego reporta una partida terminada |
| `GET /api/health/` | No | Render revisa que el servicio esté vivo |

Todas las rutas terminan en `/`. Las peticiones protegidas llevan `Authorization: Token <token>`.

**Requisito del docente (LB-07):** la API no puede bloquear el juego. Si no responde, Unity juega igual y conserva el resultado localmente; cada partida debe quedar registrada **una sola vez** (`match_id` único → `409` si se repite).

## Antes de hacer push

Lo mismo que revisa el CI (`Backend CI / lint-and-test`):

```bash
ruff check .
```

```bash
python manage.py makemigrations --check
```

```bash
python manage.py test
```

- Toda librería nueva va en `requirements.txt`.
- Si cambias un modelo, sube la migración generada.
- Cada endpoint nuevo lleva al menos un test.
- `.env`, `.venv/` y `staticfiles/` no se suben (ya están en `.gitignore`).

## Base de datos local con Docker

> Propuesta, basada en la *Práctica Docker* del equipo. Producción no usa Docker.

Levanta un PostgreSQL 16 (el mismo que usa el CI) para desarrollar sin tocar Supabase. Crea `backend/docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: bearstards
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Con Docker Desktop abierto:

```bash
docker compose up -d
```

```bash
docker ps
```

Con el `DATABASE_URL` local del `.env` de arriba, `python manage.py migrate` crea las tablas en ese contenedor. Para apagarlo:

```bash
docker compose down
```

Los datos se conservan en el volumen `pgdata`. Para borrarlos también: `docker compose down -v`.

## Problemas comunes

| Síntoma | Solución |
|---|---|
| `'list' object has no attribute 'lower'` | `ALLOWED_HOSTS` quedó como lista dentro de lista. Debe ser `ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")` |
| `createsuperuser` termina sin pedir datos | Git Bash en Windows: usar `winpty python manage.py createsuperuser` o PowerShell |
| `python` abre la Microsoft Store | Abrir una terminal nueva tras instalar Python, o desactivar los alias en *Configuración → Aplicaciones → Alias de ejecución* |
| Error de conexión a Supabase | `DATABASE_URL` mal copiada, se usó la conexión directa en vez del *Session pooler*, o la contraseña tiene caracteres sin codificar |
| `Not Found` en `http://127.0.0.1:8000/` | Normal: todavía no hay nada en la raíz. Usar `/admin/` |

> **Seguridad:** la página de error de Django (con `DEBUG=True`) muestra las variables de entorno, incluida la `DATABASE_URL` con su contraseña. Al compartir un error, pega solo el *traceback*.
