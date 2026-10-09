# BEARSTARDS PWA

PWA de ranking de **Little Bearstards** (Turbo Studios). Muestra el ranking de partidas del videojuego y recibe los resultados desde Unity.

Planeación y documentación: [planeacion_integradora](https://github.com/StingerBlade/planeacion_integradora).

## Stack

| Capa | Tecnología | Responsable |
|---|---|---|
| Front (`ui/`) | React 19 + Vite 8 + `vite-plugin-pwa` | Angel Arras |
| Back (`backend/`) | Django + Django REST Framework | G. González |
| Base de datos | **PostgreSQL en Supabase** | — |
| Hosting | Render (un Web Service, plan Starter $7/mes) | — |
| CI | GitHub Actions | — |

> **Base de datos: Supabase.** Se usa únicamente como PostgreSQL administrado, conectado desde Django por `DATABASE_URL`. No se usa la API ni la autenticación de Supabase. **El proyecto de Supabase aún no está creado** (pendiente).

## Arquitectura de despliegue

Un solo servicio en Render:

```
navegador ──► Render Web Service (gunicorn + Django)
                  ├─ /api/...   → Django REST (POST /api/resultados, GET /api/ranking)
                  └─ /         → build de Vite (ui/dist) servido con WhiteNoise
                          │
                          └─► Supabase (PostgreSQL)
```

Front y back comparten dominio, así que no hace falta configurar CORS en producción. En desarrollo, Vite corre en `localhost:5173` y debe apuntar a la API con un proxy (ver abajo).

## CI/CD

| Workflow | Cuándo corre | Qué hace |
|---|---|---|
| `.github/workflows/frontend-ci.yml` | PR y push a `main`/`development` que toquen `ui/` | `npm ci`, `npm run lint`, `npm run build` |
| `.github/workflows/backend-ci.yml` | PR y push a `main`/`development` que toquen `backend/` | `ruff`, chequeo de migraciones, `manage.py test` con Postgres temporal |

- El CI **no** usa Supabase: levanta su propio Postgres desechable.
- **CD:** Render despliega solo cuando el CI pasa (`autoDeployTrigger: checksPass` en `render.yaml`).

### Puesta en marcha (una sola vez)

1. **Supabase:** crear el proyecto y copiar la cadena *Session pooler* (Settings → Database). Usar el pooler y no la conexión directa, porque Render solo tiene IPv4.
2. **Render:** *New → Blueprint*, elegir este repo. Capturar `DATABASE_URL` (la de Supabase) y `ALLOWED_HOSTS` (el dominio `*.onrender.com`).
3. **GitHub:** Settings → Branches → regla para `main` que exija los checks *Frontend CI* y *Backend CI*.

### Qué necesita el backend para que esto funcione

Para G. González, al crear `backend/`:

- Proyecto Django llamado `config` y `backend/requirements.txt` con `django`, `djangorestframework`, `gunicorn`, `whitenoise`, `dj-database-url` y `psycopg[binary]`.
- Endpoint de salud `GET /api/health/` (lo usa Render).
- En `settings.py`:

```python
import os, dj_database_url
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.environ["SECRET_KEY"]
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

DATABASES = {
    "default": dj_database_url.config(
        env="DATABASE_URL", conn_max_age=600, ssl_require=not DEBUG
    )
}
# Si se usa el pooler en modo transaccion (puerto 6543), añadir:
# DATABASES["default"]["DISABLE_SERVER_SIDE_CURSORS"] = True

MIDDLEWARE.insert(1, "whitenoise.middleware.WhiteNoiseMiddleware")
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
# El build de Vite (index.html, assets, service worker del PWA) se sirve desde raíz:
WHITENOISE_ROOT = BASE_DIR.parent / "ui" / "dist"
WHITENOISE_INDEX_FILE = True
```

- Las rutas de la API van bajo `/api/`, para no chocar con las rutas del front. La navegación interna del front (SPA) necesitará una ruta *catch-all* hacia `index.html` si se usa React Router.

## Desarrollo local

```bash
# Front
cd ui
npm ci
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

Para que el front hable con el back en local, en `ui/vite.config.js` se agrega un proxy a `/api` hacia `http://localhost:8000` cuando el backend exista.

## Variables de entorno

Ver [`.env.example`](.env.example). Los secretos reales (`DATABASE_URL`, `SECRET_KEY`) viven solo en Render y nunca en el repositorio.
