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

> **Base de datos: Supabase.** Se usa únicamente como PostgreSQL administrado, conectado desde Django por `DATABASE_URL` (Session pooler). No se usa la API ni la autenticación de Supabase. El proyecto de Supabase ya está creado.

## Arquitectura de despliegue

Un solo servicio en Render:

```
navegador ──► Render Web Service (gunicorn + Django)
                  ├─ /api/...   → Django REST (POST /api/resultados, GET /api/ranking)
                  └─ /         → build de Vite (ui/dist) servido con WhiteNoise
                          │
                          └─► Supabase (PostgreSQL)
```

Front y back comparten dominio, así que no hace falta configurar CORS en producción. En desarrollo, Vite corre en `localhost:5173` y apunta a la API con un proxy (ver *Desarrollo local*).

---

## Reglas para trabajar en el repo

Leer esto antes de abrir tu primer PR: casi todos los problemas con el pipeline vienen de saltarse una de estas reglas.

### 1. Flujo de ramas

```
feat/<tu-nombre>/<tema>  ──PR──►  development  ──PR──►  main  ──►  Render (deploy)
```

- **Nunca** se hace push directo a `main` ni a `development`: todo entra por Pull Request.
- Ramas de trabajo: `feat/<nombre>/<tema>` (funcionalidad), `fix/<nombre>/<tema>` (corrección), `chore/<nombre>/<tema>` (infraestructura, docs).
- Los PR normales van a **`development`**. Solo se abre PR de `development` a `main` cuando hay algo estable que se quiere publicar: **cada merge a `main` despliega a producción** en Render.
- Una rama = un tema. PRs pequeños (idealmente menos de ~400 líneas) se revisan y pasan más rápido.
- Antes de abrir el PR, actualiza tu rama con la base (`git pull origin development`) y resuelve conflictos en local.

### 2. Reglas de todo PR

1. **El CI debe estar en verde** para poder mergear. No se mergea con checks rojos ni pendientes.
2. **Al menos 1 aprobación** de otra persona del equipo. Quien abre el PR no lo aprueba ni lo mergea sin revisión.
3. Llenar la plantilla del PR (se carga sola): qué cambia y el checklist.
4. Título claro en español, en imperativo y con prefijo: `feat: ...`, `fix: ...`, `chore: ...`, `docs: ...`, `ci: ...`.
5. Merge con **Squash and merge** para que `main` quede con un commit por PR.
6. Si el CI falla, **se arregla en la misma rama** con un commit nuevo. No se cierra y reabre el PR para "reintentar", salvo que el fallo sea ajeno al código (ver *Solución de problemas*).
7. **Jamás** subir secretos: `.env`, contraseñas, llaves de Supabase, `SECRET_KEY` reales. Si se sube uno por error, hay que **rotarlo** (cambiarlo en Supabase/Render) — borrarlo del repo no basta porque queda en el historial.

### 3. Qué revisa el CI

Se ejecutan **en todo PR y en todo push a `main`/`development`**, sin importar qué archivos cambien:

| Check (nombre exacto) | Qué hace | Si falla, normalmente es porque… |
|---|---|---|
| `Frontend CI / lint-and-build` | `npm ci`, `npm run lint`, `npm run build` en `ui/` | error de ESLint, error de compilación, `package-lock.json` desincronizado |
| `Backend CI / lint-and-test` | `ruff check`, `makemigrations --check`, `manage.py test` en `backend/` con Postgres temporal | error de ruff, falta una migración, un test falló, falta una dependencia en `requirements.txt` |

- Mientras `backend/manage.py` no exista, `Backend CI` termina en verde sin hacer nada. Es normal.
- El CI **no** se conecta a Supabase: usa su propio Postgres desechable, así que los tests nunca tocan datos reales.
- **CD:** Render solo despliega `main` cuando el CI pasa (`autoDeployTrigger: checksPass`).

### 4. Checklist para el FRONT (`ui/`)

Antes de hacer push, desde `ui/`:

```bash
npm ci            # instala EXACTAMENTE lo que dice package-lock.json
npm run lint      # debe terminar sin errores
npm run build     # debe compilar
```

- **Node 22** (el CI usa 22; Vite 8 exige 20.19+ o 22.12+). Con Node viejo el build local puede fallar.
- Si agregas o quitas una dependencia, usa `npm install <paquete>` **desde `ui/`** y sube `package.json` **y** `package-lock.json` juntos. Si el lock queda desincronizado, `npm ci` falla en el CI.
- No subas `node_modules/` ni `dist/` (están en `.gitignore`).
- No dejes `console.log` de depuración ni código comentado.
- Llamadas a la API siempre a rutas relativas (`/api/ranking`), nunca con `http://localhost:8000` escrito a mano: en producción front y back comparten dominio.
- Cambios al PWA (`vite.config.js`, manifest, service worker): probar con `npm run build && npm run preview`, porque el service worker no se activa en `npm run dev`.

### 5. Checklist para el BACK (`backend/`)

Antes de hacer push, desde `backend/` (con el entorno virtual activo):

```bash
pip install -r requirements.txt ruff
ruff check .                              # lint
python manage.py makemigrations --check   # ¿faltan migraciones?
python manage.py test                     # tests
```

- **Python 3.12.**
- **Toda librería nueva va en `backend/requirements.txt`.** Si solo la instalas en tu máquina, el CI y Render fallarán con `ModuleNotFoundError`.
- **Si cambias un modelo, sube la migración** (`python manage.py makemigrations`). El CI rechaza el PR si el modelo y las migraciones no coinciden. No edites a mano migraciones ya mergeadas.
- **Cada endpoint nuevo lleva al menos un test.** El CI es tan útil como los tests que tenga.
- Los tests no deben depender de datos del Supabase real ni de internet.
- Toda configuración sensible se lee de variables de entorno (`os.environ`), nunca valores fijos en `settings.py`.
- Proyecto Django llamado `config` y estructura `backend/manage.py` (el CI y Render dependen de esas rutas).
- Rutas de la API bajo `/api/`. Debe existir `GET /api/health/` (Render lo usa para saber si el servicio está vivo).
- Configuración de ruff: se recomienda un `backend/pyproject.toml` con `[tool.ruff]` para que todos usen las mismas reglas.

### 6. Qué necesita el backend para desplegarse

`backend/requirements.txt` con `django`, `djangorestframework`, `gunicorn`, `whitenoise`, `dj-database-url` y `psycopg[binary]`; y en `settings.py`:

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

Si el front usa React Router, el back necesitará una ruta *catch-all* hacia `index.html`.

> Con `ssl_require=not DEBUG`, los tests del CI (`DEBUG=False` contra un Postgres sin SSL) pueden fallar con un error de SSL. Si pasa, en el entorno de tests usar `DEBUG=True` o ajustar `ssl_require` por variable de entorno.

### 7. Configuración del repositorio (una sola vez, por quien administra)

En GitHub → Settings → Branches, regla para `main` **y** para `development`:

- ✅ *Require a pull request before merging* (1 aprobación).
- ✅ *Require status checks to pass before merging*, y añadir **`Frontend CI / lint-and-build`** y **`Backend CI / lint-and-test`** (aparecen en el buscador después de que hayan corrido al menos una vez).
- ✅ *Require branches to be up to date before merging*.
- ✅ *Do not allow bypassing the above settings*.

En Settings → General → Pull Requests: dejar solo *Allow squash merging* y activar *Automatically delete head branches*.

En Render: *Settings → Build & Deploy → Auto-Deploy: After CI checks pass* (ya viene así desde `render.yaml`).

### 8. Solución de problemas del pipeline

| Síntoma | Causa y solución |
|---|---|
| `npm ci` falla: *package.json and package-lock.json are not in sync* | Modificaste dependencias sin subir el lock. Corre `npm install` en `ui/` y sube `package-lock.json`. |
| Lint falla en el CI pero no en mi máquina | Tu rama está desactualizada o usas otra versión de Node. Usa Node 22 y corre `npm ci`. |
| Build falla con error de sintaxis de Vite | Node < 20.19. Actualiza a Node 22. |
| `ModuleNotFoundError` en el CI o en Render | Falta la librería en `backend/requirements.txt`. |
| `Backend CI` falla en *makemigrations --check* | Cambiaste un modelo sin migración. Corre `python manage.py makemigrations` y sube el archivo. |
| Test falla solo en el CI | El test depende de datos locales, del orden de ejecución, de la zona horaria o de Supabase. Debe ser independiente. |
| El PR dice *Expected — Waiting for status to be reported* y no avanza | El nombre del check requerido no coincide, o el workflow no corrió. Revisa la pestaña Actions; si el workflow no aparece, haz un commit nuevo a la rama. |
| El check falló por algo ajeno (red, GitHub caído, `Error: The operation was canceled`) | Re-ejecuta con *Re-run jobs*. Si falla otra vez, es real: revísalo. |
| Render no despliega tras el merge | Espera a que el CI de `main` termine en verde (`checksPass`). Si el CI pasó y no hay deploy, revisa el log en el dashboard de Render. |
| Deploy de Render falla en `cd backend` | `backend/` no existe todavía o no se llama así. |
| Deploy falla conectando a la base de datos | `DATABASE_URL` mal copiada, usa la conexión directa en vez del *Session pooler*, o la contraseña tiene caracteres especiales sin codificar (hay que *percent-encode* en la URL). |

---

## Puesta en marcha de infraestructura (una sola vez)

1. **Supabase:** proyecto creado. Cadena de conexión: *Connect → Session pooler → URI*. Se usa el pooler y no la conexión directa porque Render solo tiene IPv4.
2. **Render** (cuando exista `backend/`): *New → Blueprint*, elegir este repo y la rama `main`. Capturar `DATABASE_URL` y `ALLOWED_HOSTS` (el dominio `*.onrender.com`).
3. **GitHub:** reglas de rama de la sección 7.

Los secretos reales (`DATABASE_URL`, `SECRET_KEY`) viven **solo en Render**, nunca en el repositorio, en chats ni en tableros.

## Desarrollo local

```bash
# Front
cd ui
npm ci
npm run dev      # http://localhost:5173
npm run lint
npm run build
```

Para que el front hable con el back en local, en `ui/vite.config.js` se agrega un proxy a `/api` hacia `http://localhost:8000` cuando el backend exista:

```js
server: { proxy: { "/api": "http://localhost:8000" } },
```

Variables de entorno de ejemplo en [`.env.example`](.env.example). Copiarlas a `backend/.env` (está ignorado por Git).
