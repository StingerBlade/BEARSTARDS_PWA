SET client_encoding = 'UTF8';
-- =====================================================================
-- Requisito: haber ejecutado 00_esquema.sql (o python manage.py migrate) en la base.
-- 02_carga.sql — Datos de prueba del laboratorio
-- Correr SOLO en la base de PRUEBAS y siempre DESPUÉS de 01_limpieza.sql
-- (la limpieza reinicia los ids, así los jugadores quedan con id 1 a 6).
--
-- 6 jugadores, 8 partidas y 16 participaciones (2 por partida).
-- Contraseña de todos los jugadores de prueba: Prueba-Lab-2026
-- =====================================================================

BEGIN;

-- Jugadores: id 1 a 6, en este orden
INSERT INTO jugador (password, is_superuser, username, first_name, last_name, email,
                     is_staff, is_active, date_joined, partidas, victorias, derrotas,
                     empates, kills, puntos_totales, mejor_puntuacion)
VALUES
    ('pbkdf2_sha256$1000000$Pt4hhks2smdXqRukNfCC4u$IUM3NEDHFdBqy0OAVkVOoW7vOxbl6C6ePbk8j6cLGmA=', false, 'oso_rojo',    '', '', '', false, true, now(), 3, 2, 0, 1, 13, 3100, 1350),
    ('pbkdf2_sha256$1000000$Pt4hhks2smdXqRukNfCC4u$IUM3NEDHFdBqy0OAVkVOoW7vOxbl6C6ePbk8j6cLGmA=', false, 'oso_azul',    '', '', '', false, true, now(), 3, 2, 1, 0,  8, 1850,  700),
    ('pbkdf2_sha256$1000000$Pt4hhks2smdXqRukNfCC4u$IUM3NEDHFdBqy0OAVkVOoW7vOxbl6C6ePbk8j6cLGmA=', false, 'oso_naranja', '', '', '', false, true, now(), 3, 1, 1, 1,  9, 2100,  800),
    ('pbkdf2_sha256$1000000$Pt4hhks2smdXqRukNfCC4u$IUM3NEDHFdBqy0OAVkVOoW7vOxbl6C6ePbk8j6cLGmA=', false, 'oso_menta',   '', '', '', false, true, now(), 3, 0, 3, 0,  4, 1100,  400),
    ('pbkdf2_sha256$1000000$Pt4hhks2smdXqRukNfCC4u$IUM3NEDHFdBqy0OAVkVOoW7vOxbl6C6ePbk8j6cLGmA=', false, 'oso_lila',    '', '', '', false, true, now(), 2, 1, 1, 0,  5, 1200, 1000),
    ('pbkdf2_sha256$1000000$Pt4hhks2smdXqRukNfCC4u$IUM3NEDHFdBqy0OAVkVOoW7vOxbl6C6ePbk8j6cLGmA=', false, 'oso_rosa',    '', '', '', false, true, now(), 2, 1, 1, 0,  7, 2050, 1150);

-- Partidas: id 1 a 8. La 3 es un empate y la 4 terminó por abandono.
INSERT INTO partida (match_id, terminada_en, por_abandono, reportada_por_id)
VALUES
    ('lab-sala-01', now(), false, 1),
    ('lab-sala-02', now(), false, 3),
    ('lab-sala-03', now(), false, 3),
    ('lab-sala-04', now(), true,  2),
    ('lab-sala-05', now(), false, 6),
    ('lab-sala-06', now(), false, 1),
    ('lab-sala-07', now(), false, 5),
    ('lab-sala-08', now(), false, 2);

-- Participaciones: 2 por partida (partida_id, jugador_id, ...)
INSERT INTO participacion (partida_id, jugador_id, puntos, kills, resultado, abandono)
VALUES
    (1, 1, 1350, 5, 'victoria', false), (1, 2,  600, 3, 'derrota', false),
    (2, 3,  750, 3, 'victoria', false), (2, 4,  400, 2, 'derrota', false),
    (3, 1,  800, 4, 'empate',   false), (3, 3,  800, 4, 'empate',  false),
    (4, 2,  550, 2, 'victoria', false), (4, 5,  200, 1, 'derrota', true),
    (5, 6, 1150, 4, 'victoria', false), (5, 4,  350, 1, 'derrota', false),
    (6, 1,  950, 4, 'victoria', false), (6, 6,  900, 3, 'derrota', false),
    (7, 5, 1000, 4, 'victoria', false), (7, 3,  550, 2, 'derrota', false),
    (8, 2,  700, 3, 'victoria', false), (8, 4,  350, 1, 'derrota', false);

COMMIT;