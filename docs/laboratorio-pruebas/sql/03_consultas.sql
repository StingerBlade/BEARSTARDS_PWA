SET client_encoding = 'UTF8';
-- =====================================================================
-- 03_consultas.sql — Verificación del laboratorio
-- Correr ANTES y DESPUÉS de registrar un usuario desde la PWA
-- y tomar captura de cada resultado. 
-- =====================================================================

-- 1. Cuántos registros hay en cada tabla
SELECT count(*) AS jugadores FROM jugador;
SELECT count(*) AS partidas FROM partida;
SELECT count(*) AS participaciones FROM participacion;

-- 2. Jugadores, del más nuevo al más viejo.
--    El usuario registrado desde la PWA aparece primero, con todo en 0.
--    La contraseña debe empezar con "pbkdf2_sha256$" (con hash, nunca en texto).
SELECT id, username, left(password, 25) AS inicio_del_hash,
       partidas, victorias, derrotas, empates, kills, puntos_totales
FROM jugador
ORDER BY id DESC;

-- 3. Tokens de sesión: registrarse crea uno para el usuario nuevo
SELECT user_id, created FROM authtoken_token;

-- 4. Ranking: lo mismo que devuelve GET /api/ranking/
SELECT username, puntos_totales
FROM jugador
ORDER BY puntos_totales DESC
LIMIT 10;

-- 5. Integridad: suma de las participaciones de cada jugador.
--    Debe coincidir con partidas, kills y puntos_totales de la consulta 2.
SELECT jugador_id, count(*) AS partidas, sum(kills) AS kills, sum(puntos) AS puntos
FROM participacion
GROUP BY jugador_id
ORDER BY jugador_id;

-- 6. Integridad: cada partida debe tener exactamente 2 participaciones
SELECT partida_id, count(*) AS participaciones
FROM participacion
GROUP BY partida_id
ORDER BY partida_id;