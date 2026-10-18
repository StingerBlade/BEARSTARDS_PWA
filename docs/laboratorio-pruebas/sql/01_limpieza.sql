SET client_encoding = 'UTF8';
-- =====================================================================
-- 01_limpieza.sql — Deja la base de PRUEBAS vacía
-- =====================================================================

BEGIN;

TRUNCATE TABLE
    participacion,
    partida,
    authtoken_token,
    django_admin_log,
    jugador_groups,
    jugador_user_permissions,
    jugador
RESTART IDENTITY CASCADE;

COMMIT;

-- Comprobación: las cuatro cuentas deben dar 0.
SELECT
    (SELECT count(*) FROM jugador)         AS jugadores,
    (SELECT count(*) FROM partida)         AS partidas,
    (SELECT count(*) FROM participacion)   AS participaciones,
    (SELECT count(*) FROM authtoken_token) AS tokens;