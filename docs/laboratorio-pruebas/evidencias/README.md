# Evidencias del laboratorio de pruebas

Registro, en orden, de cómo se hizo el laboratorio de la PWA de **Little Bearstards**: desde crear la base de datos hasta probar el modo offline y correr los tests automáticos. Cada paso indica la prueba de la guía que cubre (P1 a P9) y las capturas que lo demuestran.

← [Volver a la guía del laboratorio](../README.md)

## Resumen

| Paso | Qué se hizo | Prueba | Capturas |
|---|---|---|---|
| 1 | Crear las tablas con `00_esquema.sql` | — | 01 |
| 2 | Cargar los datos de prueba con `02_carga.sql` | — | 02, 02b |
| 3 | Generar el esquema desde las migraciones | — | 02c |
| 4 | Comprobar el esquema con `migrate` | — | 03 |
| 5 | Consultar el estado inicial | P1 | 04 |
| 6 | Consultar el ranking desde la PWA (GET) | P2 | 05, 06, 07 |
| 7 | Revisar el manifiesto, el service worker y la caché | P8 | 08, 08b, 09, 10 |
| 8 | Registrar un usuario desde la PWA (POST) | P3 | 11, 12a, 12b, 12c, 13 |
| 9 | Comprobar que el registro se guardó | P4 | 14 |
| 10 | Probar las validaciones | P5 | 15 |
| 11 | Abrir la PWA sin conexión | P8 | 16 |
| 12 | Registrar sin conexión y sincronizar al volver | P9 | 17, 18, 19, 20 |
| 13 | Consultar el estado final | P4, P9 | 21, 22b |
| 14 | Revisar los logs del backend | P7 | 23 |
| 15 | Correr los tests automáticos del backend | — | 24 |

---

## Parte 1 · Base de datos

### Paso 1 · Crear las tablas
Se creó una base vacía en PostgreSQL local y se ejecutó el esquema:

    psql -U postgres -h localhost -c "CREATE DATABASE bearstards;"
    psql -U postgres -h localhost -d bearstards -f docs/laboratorio-pruebas/sql/00_esquema.sql

**Resultado:** termina con `INSERT 0 23`. Se crearon todas las tablas y se registraron las 23 migraciones de Django.

![Esquema creado](01-script-esquema.png.png)

### Paso 2 · Cargar los datos de prueba

    psql -U postgres -h localhost -d bearstards -f docs/laboratorio-pruebas/sql/02_carga.sql

**Resultado:** `INSERT 0 6`, `INSERT 0 8`, `INSERT 0 16` y `COMMIT`: 6 jugadores, 8 partidas y 16 participaciones. La partida 3 es un empate y en la 4 `oso_lila` abandonó.

![Carga de datos](02-script-carga.png)
![Contenido del script de carga](02b-contenido-carga.png)

### Paso 3 · Generar el esquema desde Django
El archivo `00_esquema.sql` no se escribió a mano: se generó con `generar_esquema.sh`, que usa `python manage.py sqlmigrate` para obtener el SQL oficial de cada migración.

    cd backend
    bash ../docs/laboratorio-pruebas/sql/generar_esquema.sh

![Generación del esquema](02c-generar-esquema.png)

### Paso 4 · Comprobar el esquema con Django
Con el backend conectado a la base local:

    python manage.py migrate

**Resultado:** `No migrations to apply.` Django reconoce que los scripts crearon el esquema completo.

![migrate sin cambios](03-migrate-sin-cambios.png)

### Paso 5 · Estado inicial (P1)

    psql -U postgres -h localhost -d bearstards -f docs/laboratorio-pruebas/sql/03_consultas.sql

**Resultado:** 6 jugadores, 8 partidas y 16 participaciones; cada partida con 2 participaciones.

![Consultas antes](04-consultas-antes.png)

---

## Parte 2 · Consulta desde la PWA (GET)

### Paso 6 · Ranking (P2)
Con el backend corriendo (`python manage.py runserver`), se compiló y abrió la PWA en Chrome:

    cd ui
    npm run build
    npm run preview

En `http://localhost:4173` el ranking muestra los 6 jugadores ordenados por puntos, con `oso_rojo` primero.

- **Network:** `GET /api/ranking/` responde **200**, con su tiempo y tamaño.
- **Console:** el cliente de la API registra `[API] GET /api/ranking/ → 200 en … ms` y muestra los datos con `console.table`.

![Ranking en la PWA](05-pwa-ranking.png)
![Network del GET](06-network-get.png)
![Console del GET](07-console-get.png)

### Paso 7 · Configuración de la PWA (P8)
En **F12 → Application** se revisó que la PWA estuviera bien configurada:

- **Manifest:** nombre, colores e íconos de 192 y 512 px.
- **Service workers:** `sw.js` activo.
- **Cache Storage:** `workbox-precache` (la interfaz) y `api-ranking` (la última copia del ranking).

![Manifest](08-manifest.png)
![Manifest, detalle](08b-manifest.png)
![Service worker activo](09-service-worker.png)
![Cache Storage](10-cache-storage.png)

---

## Parte 3 · Envío desde la PWA (POST)

### Paso 8 · Registrar un usuario (P3)
Desde el formulario **Registrarse** se creó un usuario nuevo. La PWA respondió "Listo: sesión iniciada como …".

- **Headers:** `POST /api/auth/registro/` con `Content-Type: application/json` y respuesta **201**.
- **Payload:** `{"username": …, "password": …}`.
- **Response:** `{"token": …, "jugador": {…}}`, con todos los contadores en 0.
- **Console:** `[API] POST /api/auth/registro/ → 201 en … ms`.

![Registro en la PWA](11-pwa-registro.png)
![Headers del POST](12a-network-post-headers.png)
![Payload del POST](12b-network-post-payload.png)
![Respuesta del POST](12c-network-post-response.png)
![Console del POST](13-console-post.png)

### Paso 9 · Comprobar que se guardó (P4)
Se volvió a ejecutar `03_consultas.sql`.

**Resultado:** ahora hay 7 jugadores. El nuevo aparece primero con todo en 0, su contraseña empieza con `pbkdf2_sha256$` (guardada con hash, nunca en texto) y tiene su token de sesión.

![Consultas después](14-consultas-despues.png)

### Paso 10 · Validaciones (P5)
Se intentó registrar un usuario que ya existía y una contraseña inválida.

**Resultado:** el backend responde **400** con el motivo y no se crea nada.

![Validación 400](15-validacion-400.png)

---

## Parte 4 · Modo offline y sincronización

### Paso 11 · Abrir la PWA sin conexión (P8)
Después de abrir la PWA una vez con conexión, en **Network** se activó **Offline** y se recargó.

**Resultado:** la app abre igual y el ranking muestra la última copia guardada; las respuestas dicen *(ServiceWorker)*.

![App sin conexión](16-offline-app.png)

### Paso 12 · Registrar sin conexión y sincronizar (P9)
Sin sesión y todavía en **Offline**, se registró otro usuario:

1. La PWA mostró: "Sin conexión: el registro quedó en cola y se enviará solo al volver la conexión."
2. La petición quedó guardada en **Application → IndexedDB → `workbox-background-sync` → `requests`**.
3. Se volvió a **No throttling**: el service worker reenvió `POST /api/auth/registro/` y el backend respondió **201**.
4. La cola de IndexedDB quedó vacía.

![Registro sin conexión](17-offline-registro.png)
![Petición en la cola de IndexedDB](18-indexeddb-cola.png)
![Sincronización al volver la conexión](19-online-sync.png)
![Cola vacía](20-indexeddb-vacia.png)

### Paso 13 · Estado final (P4 y P9)
Se ejecutó `03_consultas.sql` por última vez y se recargó la PWA.

**Resultado:** el usuario sincronizado aparece en la base y en el ranking.

![Consultas finales](21-consultas-final.png)
![Ranking final](22b-pwa-ranking-final.png)

---

## Parte 5 · Respuesta del backend

### Paso 14 · Logs (P7)
En la terminal de `runserver` quedó una línea por cada petición de los pasos anteriores, con este formato:

    POST /api/auth/registro/ -> 201 | 812.4 ms | payload 52 B {'username': '…', 'password': '***'} | respuesta 201 B | memoria pico 310.2 KB | SQL 4 consultas en 95.1 ms

| Parte | Significado |
|---|---|
| `POST /api/auth/registro/ -> 201` | Método, ruta y código de respuesta |
| `812.4 ms` | Tiempo total de la petición |
| `payload … {…}` | Tamaño y contenido recibido; la contraseña nunca se registra (`***`) |
| `respuesta … B` | Tamaño de la respuesta |
| `memoria pico` | Memoria usada durante la petición (solo con `DEBUG=True`) |
| `SQL … consultas en … ms` | Consultas a PostgreSQL y su tiempo total |

El registro es la petición más lenta porque el hash de la contraseña (PBKDF2) es lento a propósito, para dificultar ataques de fuerza bruta.

![Logs del backend](23-logs-backend.png)

---

## Parte 6 · Tests automáticos

### Paso 15 · Correr los tests del backend
Además de las pruebas manuales, el backend tiene 10 tests automáticos en `backend/jugadores/tests.py`. Se ejecutaron desde `backend/`, con el entorno virtual activo:

    python manage.py test

Django crea una base de datos temporal, corre los tests y la borra al terminar, así que nunca tocan los datos del laboratorio ni los de Supabase.

**Resultado:** `Ran 10 tests` y `OK`.

Los 10 tests, por grupo:

**Grupo 1 · `RegistroLoginTests`: cuentas y sesiones**

1. **`test_registro_crea_jugador_y_devuelve_token`**: registrarse responde **201** y devuelve un token, y la contraseña se guarda **con hash**, no en texto plano.
2. **`test_registro_con_usuario_repetido_da_400`**: registrar un usuario que ya existe responde **400**; no se pueden crear dos cuentas con el mismo nombre.
3. **`test_login_correcto_e_incorrecto`**: con la contraseña correcta, el login responde **200**; con una incorrecta, **400**.
4. **`test_yo_sin_token_da_401`**: pedir el perfil (`/api/yo/`) sin token responde **401**; el perfil está protegido.

**Grupo 2 · `RankingTests`**

5. **`test_ranking_es_publico_y_ordena_por_puntos`**: el ranking (`/api/ranking/`) se ve **sin iniciar sesión** y ordena a los jugadores de más a menos puntos.

**Grupo 3 · `ReportarPartidaTests`: el endpoint que usa Unity**

Antes de cada test se crean dos jugadores (`oso_rojo` y `oso_azul`) y se inicia sesión como el primero.

6. **`test_suma_estadisticas`**: al reportar una partida, el ganador suma partida, victoria, kills, puntos y mejor puntuación, y el perdedor suma su derrota; se crean las 2 participaciones.
7. **`test_empate`**: si los dos jugadores empatan, a cada uno se le suma **1 al contador de empates**.
8. **`test_reporte_repetido_da_409_y_no_duplica`**: si la misma partida (mismo `match_id`) se reporta dos veces, el segundo reporte responde **409** y las estadísticas **no se cuentan doble**.
9. **`test_resultados_incoherentes_dan_400`**: un reporte con resultados imposibles (dos victorias en la misma partida) responde **400** y no se guarda.
10. **`test_mis_partidas_devuelve_historial`**: después de una partida, `/api/yo/partidas/` devuelve el historial del jugador con su resultado.

Los mismos tests corren solos en GitHub Actions (*Backend CI / lint-and-test*) en cada push y Pull Request, contra un PostgreSQL 16 temporal.

![Tests del backend](24-tests.png)

---

## Conclusión

| Qué se validó | Resultado | Pasos |
|---|---|---|
| Base de datos replicable con scripts SQL | Esquema idéntico al de Django (`No migrations to apply`) | 1–4 |
| Consulta `GET` desde la PWA | Ranking mostrado y ordenado, respuesta 200 | 6 |
| Envío `POST` desde la PWA | Usuario creado, respuesta 201 | 8 |
| Persistencia e integridad | El usuario quedó en PostgreSQL con contraseña con hash y token | 5, 9, 13 |
| Validaciones | Datos inválidos rechazados con 400 | 10 |
| Modo offline | La app y el ranking funcionan sin conexión | 7, 11 |
| Sincronización offline/online | El registro sin red se envió solo al volver la conexión | 12 |
| Respuesta del backend | Tiempo, tamaños, memoria y consultas SQL de cada petición | 14 |
| Reglas del backend con tests automáticos | 10 tests en verde (`Ran 10 tests … OK`) | 15 |