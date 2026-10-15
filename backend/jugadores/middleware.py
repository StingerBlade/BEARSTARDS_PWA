import json
import logging
import time
import tracemalloc

from django.conf import settings
from django.db import connection

logger = logging.getLogger("bearstards.peticiones")

CAMPOS_OCULTOS = {"password"}
# Render consulta /api/health/ cada pocos segundos; registrarla solo llenaría los logs.
RUTAS_SIN_LOG = {"/api/health/"}

class _ContadorConsultas:
    """Cuenta las consultas SQL de una petición y el tiempo que tardan en la base de datos."""

    def __init__(self):
        self.total = 0
        self.ms = 0.0

    def __call__(self, execute, sql, params, many, context):
        inicio = time.perf_counter()
        try:
            return execute(sql, params, many, context)
        finally:
            self.total += 1
            self.ms += (time.perf_counter() - inicio) * 1000

def _resumen_payload(request):
    """Campos del JSON recibido, con las contraseñas ocultas."""
    if request.method not in ("POST", "PUT", "PATCH") or not request.body:
        return "-"
    try:
        datos = json.loads(request.body)
    except ValueError:
        return "(no es JSON)"
    if not isinstance(datos, dict):
        return type(datos).__name__
    return {k: ("***" if k in CAMPOS_OCULTOS else v) for k, v in datos.items()}

class LogPeticionesMiddleware:
    """Registra cada petición a /api/: método, ruta, código, tiempo, tamaños, memoria y SQL.

    Escribe en la consola; en Render se ve en el panel de Logs del servicio.
    La memoria se mide con tracemalloc solo cuando DEBUG=True, porque agrega costo.
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.medir_memoria = settings.DEBUG
        if self.medir_memoria and not tracemalloc.is_tracing():
            tracemalloc.start()

    def __call__(self, request):
        if not request.path.startswith("/api/") or request.path in RUTAS_SIN_LOG:
            return self.get_response(request)

        # Leer el cuerpo aquí lo deja en caché, y DRF lo puede volver a leer después.
        payload = _resumen_payload(request)
        contador = _ContadorConsultas()
        if self.medir_memoria:
            tracemalloc.reset_peak()
            memoria_inicial, _ = tracemalloc.get_traced_memory()

        inicio = time.perf_counter()
        with connection.execute_wrapper(contador):
            response = self.get_response(request)
        ms = (time.perf_counter() - inicio) * 1000

        memoria = "-"
        if self.medir_memoria:
            _, pico = tracemalloc.get_traced_memory()
            memoria = f"{(pico - memoria_inicial) / 1024:.1f} KB"
        tamano_respuesta = "-" if response.streaming else f"{len(response.content)} B"

        logger.info(
            "%s %s -> %s | %.1f ms | payload %s B %s | respuesta %s | "
            "memoria pico %s | SQL %s consultas en %.1f ms",
            request.method,
            request.get_full_path(),
            response.status_code,
            ms,
            len(request.body),
            payload,
            tamano_respuesta,
            memoria,
            contador.total,
            contador.ms,
        )
        return response