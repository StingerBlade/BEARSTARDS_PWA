import logging
from email.mime.image import MIMEImage
from pathlib import Path

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

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


def enviar_recuperacion(jugador):
    """Manda el enlace para restablecer la contraseña. Si falla, solo se registra."""
    uid = urlsafe_base64_encode(force_bytes(jugador.pk))
    token = default_token_generator.make_token(jugador)
    sitio = settings.SITIO_URL.rstrip("/")
    contexto = {
        "jugador": jugador,
        "sitio": sitio,
        "enlace": f"{sitio}/#/restablecer?uid={uid}&token={token}",
        "horas": settings.PASSWORD_RESET_TIMEOUT // 3600,
    }
    correo = EmailMultiAlternatives(
        subject="Restablece tu contraseña de Little Bearstards",
        body=render_to_string("correo/recuperar.txt", contexto),
        to=[jugador.email],
    )
    correo.attach_alternative(
        render_to_string("correo/recuperar.html", contexto), "text/html"
    )
    try:
        correo.send()
    except Exception:
        logger.exception("No se pudo enviar la recuperación: id=%s", jugador.id)
        return False
    logger.info("Recuperación enviada: id=%s", jugador.id)
    return True
