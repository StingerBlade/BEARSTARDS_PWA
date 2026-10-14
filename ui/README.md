# Interfaz (UI) — BEARSTARDS PWA

Interfaz de la PWA de **Little Bearstards**: página de inicio del juego, ranking, registro, inicio de sesión y panel del jugador.

← [Volver al README principal](../README.md) · [Backend (`backend/`)](../backend/README.md)

> **Estado:** en `main` todavía está la plantilla de Vite. La propuesta de interfaz (pantallas, componentes y estilos) está maquetada con datos de prueba y pendiente de subir. Lo que sigue describe la estructura acordada.

## Stack

| | |
|---|---|
| Framework | React 19 + Vite 8 |
| PWA | `vite-plugin-pwa` (manifiesto y service worker con Workbox) |
| Rutas | React Router 7 (`HashRouter`) |
| Estilos | Tailwind CSS 4 con tokens en `src/index.css` |
| Fuentes | Lilita One y Fredoka (`@fontsource`, funcionan sin conexión) |

## Puesta en marcha

Requisitos: **Node 22** (el CI usa 22; Vite 8 exige 20.19+ o 22.12+). Desde `ui/`:

```bash
npm ci
```

```bash
npm run dev
```

La app abre en `http://localhost:5173`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run lint` | Revisa el código con ESLint |
| `npm run build` | Genera `dist/` para producción |
| `npm run preview` | Sirve `dist/`; aquí sí se activa el service worker |

**Antes de hacer push**, lo mismo que revisa el CI (`Frontend CI / lint-and-build`): `npm ci`, `npm run lint` y `npm run build` deben terminar sin errores.

## Conectar con el backend en local

Con el backend corriendo en `http://localhost:8000` (ver [backend/README.md](../backend/README.md)), agrega el proxy en `vite.config.js`:

```js
server: { proxy: { "/api": "http://localhost:8000" } },
```

Las llamadas a la API siempre usan **rutas relativas** (`/api/ranking/`), nunca `http://localhost:8000` escrito a mano: en producción front y back comparten dominio.

## Estructura

```
ui/src/
├── api/            # cliente.js: todas las llamadas a /api/ (agrega el token)
├── auth/           # contexto de sesión: token, jugador, login, registro, logout
├── components/     # Navbar, Footer, Hero, Bear, Icons, ProtectedRoute, ui.js...
├── pages/          # Home, Ranking, Login, Register, Panel
├── assets/         # logos e imágenes de los osos
├── index.css       # tokens de diseño (colores, fuentes, sombras, animaciones)
├── App.jsx         # rutas
└── main.jsx        # punto de entrada
```

## Pantallas

| Ruta | Pantalla | ¿Requiere sesión? |
|---|---|---|
| `/#/` | Inicio | No |
| `/#/ranking` | Ranking | No |
| `/#/login` | Iniciar sesión | No |
| `/#/registro` | Registro | No |
| `/#/panel` | Panel del jugador | Sí |

## Reglas para trabajar en `ui/`

- Al agregar o quitar una dependencia, usa `npm install <paquete>` desde `ui/` y sube `package.json` **y** `package-lock.json` juntos.
- No subas `node_modules/` ni `dist/`.
- Solo se muestran los datos acordados: nada de correos, rachas, logros ni rankings por periodo.
- Cada lista (ranking, historial) maneja los estados **cargando**, **vacía** y **error**.
- Si la API responde `401`, se borra la sesión y se manda a iniciar sesión.
- Cambios al PWA (manifiesto o service worker): prueba con `npm run build` y `npm run preview`, porque el service worker no se activa en `npm run dev`.

## Diseño

La guía de estilos completa (colores, tipografía, bordes, componentes, animación y diseño adaptativo) está en el [README principal](../README.md#guía-de-estilos).
