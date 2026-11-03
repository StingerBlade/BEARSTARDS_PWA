import logging
from email.mime.image import MIMEImage
from pathlib import Path

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

logger = logging.getLogger("bearstards.correo")

# PNG que van dentro del correo; el HTML los usa como cid:<nombre sin .png>
IMAGENES = Path(__file__).resolve().parent / "correo"


def enviar_bienvenida(jugador):
    """Manda el correo de bienvenida. Si falla, solo se registra: el registro no se cae."""
    contexto = {"jugador": jugador, "sitio": settings.SITIO_URL.rstrip("/")}
    correo = EmailMultiAlternatives(
        subject=f"¡Bienvenido a la tienda, {jugador.username}!",
        body=render_to_string("correo/bienvenida.txt", contexto),
        to=[jugador.email],
    )
    correo.attach_alternative(
        render_to_string("correo/bienvenida.html", contexto), "text/html"
    )
    # "related" junta el HTML con sus imágenes para que se vean sin descargarlas
    correo.mixed_subtype = "related"
    for archivo in sorted(IMAGENES.glob("*.png")):
        imagen = MIMEImage(archivo.read_bytes(), "png")
        imagen.add_header("Content-ID", f"<{archivo.stem}>")
        imagen.add_header("Content-Disposition", "inline", filename=archivo.name)
        correo.attach(imagen)

    try:
        correo.send()
    except Exception:
        logger.exception("No se pudo enviar la bienvenida: id=%s", jugador.id)
        return False
    logger.info("Bienvenida enviada: id=%s", jugador.id)
    return True
