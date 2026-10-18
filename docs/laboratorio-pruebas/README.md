# Laboratorio de pruebas — BEARSTARDS PWA

Banco de pruebas de la PWA de **Little Bearstards** conectada al backend Django y a una base de datos **PostgreSQL local**. Valida:

- **Consulta (`GET`)** de los datos de los jugadores y su renderizado en la PWA.
- **Envío (`POST`)** de una transacción nueva desde la PWA: el **registro de un usuario**.
- **Persistencia e integridad** de los datos en PostgreSQL, antes y después del envío.
- **Respuesta** del backend (códigos, tiempos, memoria y consultas SQL) y **comportamiento offline** de la PWA.

← [Volver al README principal](../../README.md) · [Backend](../../backend/README.md) · [Interfaz](../../ui/README.md)

## Contenido de esta carpeta

```
docs/laboratorio-pruebas/
├── README.md               # esta guía
├── sql/
│   ├── 00_esquema.sql      # crea todas las tablas (base vacía)
│   ├── 01_limpieza.sql     # vacía los datos para repetir las pruebas
│   ├── 02_carga.sql        # carga los datos de prueba
│   ├── 03_consultas.sql    # consultas de verificación (antes y después)
│   └── generar_esquema.sh  # regenera 00_esquema.sql desde las migraciones de Django
└── evidencias/             # capturas y logs de cada prueba
```

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| PostgreSQL | 16 o superior (incluye `psql`) | Base de datos local |
| Python | 3.12 | Backend Django |
| Node.js | 22 | Interfaz (PWA) |
| Git Bash | — | Los comandos de esta guía son para Git Bash (Windows) o cualquier terminal de Linux/macOS |

> En Windows, si `psql` no se reconoce, agrega PostgreSQL al `PATH` (ajusta la versión instalada):
>
> ```bash
> echo 'export PATH="$PATH:/c/Program Files/PostgreSQL/18/bin"' >> ~/.bashrc && source ~/.bashrc
> ```

## 1. Crear la base de datos

Todos los comandos, desde la **raíz del repositorio**. Cada `psql` pide la contraseña del usuario `postgres` de tu instalación.

**1.1 Crear una base vacía**

```bash
psql -U postgres -h localhost -c "CREATE DATABASE bearstards;"
```

**1.2 Crear las tablas**

```bash
psql -U postgres -h localhost -d bearstards -f docs/laboratorio-pruebas/sql/00_esquema.sql
```

Termina con `INSERT 0 23`: crea todas las tablas y registra las 23 migraciones de Django, así el backend reconoce la base como completa.

**1.3 Cargar los datos de prueba**

```bash
psql -U postgres -h localhost -d bearstards -f docs/laboratorio-pruebas/sql/02_carga.sql
```

Termina con `INSERT 0 6`, `INSERT 0 8`, `INSERT 0 16` y `COMMIT`.

### Datos de prueba

| Jugador | Puntos | Partidas | V | D | E | Kills | Mejor |
|---|---|---|---|---|---|---|---|
| oso_rojo | 3,100 | 3 | 2 | 0 | 1 | 13 | 1,350 |
| oso_naranja | 2,100 | 3 | 1 | 1 | 1 | 9 | 800 |
| oso_rosa | 2,050 | 2 | 1 | 1 | 0 | 7 | 1,150 |
| oso_azul | 1,850 | 3 | 2 | 1 | 0 | 8 | 700 |
| oso_lila | 1,200 | 2 | 1 | 1 | 0 | 5 | 1,000 |
| oso_menta | 1,100 | 3 | 0 | 3 | 0 | 4 | 400 |

- Contraseña de todos los jugadores de prueba: **`Prueba-Lab-2026`**.
- La partida `lab-sala-03` es un **empate** y en `lab-sala-04` `oso_lila` **abandonó**.

## 2. Levantar el backend

**2.1 Entorno virtual e instalación** (desde `backend/`)

```bash
cd backend
```

```bash
python -m venv .venv
```

```bash
source .venv/Scripts/activate
```

En Linux/macOS: `source .venv/bin/activate`. El prompt debe mostrar `(.venv)`.

```bash
pip install -r requirements.txt
```

**2.2 Configurar la conexión**

```bash
cp ../.env.example .env
```

En `backend/.env`, deja activa solo la **opción A (PostgreSQL local)** y cambia `TU_PASSWORD` por la contraseña de tu usuario `postgres`.

**2.3 Comprobar y arrancar**

```bash
python manage.py migrate
```

Debe responder **`No migrations to apply.`** Eso confirma que los scripts SQL crearon el esquema completo.

```bash
python manage.py runserver
```

Abre `http://127.0.0.1:8000/api/ranking/`: deben aparecer los 6 jugadores, con `oso_rojo` primero.

## 3. Levantar la PWA

> **Pendiente:** se completa cuando esté lista la interfaz.

En **otra terminal**, desde `ui/`:

```bash
cd ui
```

```bash
npm ci
```

```bash
npm run dev
```

Abre `http://localhost:5173`. Vite reenvía las peticiones `/api/...` al backend (`localhost:8000`).

## 4. Pruebas y evidencias

Guarda cada captura en `evidencias/` con el número de la prueba (por ejemplo `P2-network-get.png`).

| # | Prueba | Qué hacer | Resultado esperado | Evidencia |
|---|---|---|---|---|
| P1 | Estado inicial | Ejecutar `03_consultas.sql` | 6 jugadores, 8 partidas, 16 participaciones; cada partida con 2 participaciones | Captura de `psql` o pgAdmin: **antes** |
| P2 | Consulta `GET` | Abrir la PWA | El ranking muestra los 6 jugadores ordenados por puntos | Captura de la PWA, pestaña **Network** (`GET /api/ranking/`: 200, tiempo, tamaño, headers) y **Console** |
| P3 | Envío `POST` | Registrar un usuario nuevo desde la PWA | Respuesta 201; aparece en el ranking con 0 puntos | **Network** (`POST /api/auth/registro/`: payload, 201, tiempo) y **Console** |
| P4 | Persistencia | Volver a ejecutar `03_consultas.sql` | 7 jugadores; el nuevo con contadores en 0, contraseña con hash (`pbkdf2_sha256$…`) y su token creado | Captura de `psql` o pgAdmin: **después** |
| P5 | Validaciones | Registrar el mismo usuario otra vez, y una contraseña corta | Respuesta 400 con el mensaje de error; no se crea nada | Network y captura de la PWA |
| P6 | Login y perfil | Iniciar sesión con `oso_rojo` | El perfil muestra sus totales y su historial de 3 partidas | Network de `GET /api/yo/` y `GET /api/yo/partidas/` |
| P7 | Logs del backend | Revisar la terminal de `runserver` tras P2–P6 | Una línea por petición: método, ruta, código, tiempo, tamaños, memoria y consultas SQL | Captura de la terminal |
| P8 | Offline | DevTools → Network → *Offline* y recargar | **Pendiente:** se completa con el service worker | Pestaña **Application** (Service Worker y Cache Storage) |

Para ejecutar las consultas de verificación:

```bash
psql -U postgres -h localhost -d bearstards -f docs/laboratorio-pruebas/sql/03_consultas.sql
```

### Cómo leer el log del backend

```
INFO bearstards.peticiones POST /api/auth/registro/ -> 201 | 812.4 ms | payload 52 B {'username': 'oso_nuevo', 'password': '***'} | respuesta 201 B | memoria pico 310.2 KB | SQL 4 consultas en 95.1 ms
```

| Parte | Significado |
|---|---|
| `POST /api/auth/registro/ -> 201` | Método, ruta y código de respuesta |
| `812.4 ms` | Tiempo total de procesamiento |
| `payload 52 B {...}` | Tamaño y contenido recibido; **la contraseña nunca se registra** (`***`) |
| `respuesta 201 B` | Tamaño de la respuesta |
| `memoria pico` | Memoria reservada durante la petición (solo con `DEBUG=True`) |
| `SQL 4 consultas en 95.1 ms` | Consultas a PostgreSQL y su tiempo total |

El registro tarda más que las consultas porque el hash de la contraseña es lento **a propósito**, para dificultar ataques de fuerza bruta.

## 5. Repetir las pruebas desde cero

Para volver al estado inicial sin recrear las tablas:

```bash
psql -U postgres -h localhost -d bearstards -f docs/laboratorio-pruebas/sql/01_limpieza.sql
```

```bash
psql -U postgres -h localhost -d bearstards -f docs/laboratorio-pruebas/sql/02_carga.sql
```

`01_limpieza.sql` borra **todos** los datos (incluidos los usuarios registrados en las pruebas). Úsalo solo en la base local de pruebas.

## Regenerar el esquema

Solo hace falta si cambian los modelos de Django. Desde `backend/`, con el entorno activo y `DATABASE_URL` apuntando a un PostgreSQL:

```bash
bash ../docs/laboratorio-pruebas/sql/generar_esquema.sh
```

El script usa `python manage.py sqlmigrate`, que imprime el SQL oficial de cada migración, y agrega el registro de migraciones al final.