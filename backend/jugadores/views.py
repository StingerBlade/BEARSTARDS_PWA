# Create your views here.
import logging

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.db.models import Case, F, Value, When
from django.db.models.functions import Greatest
from django.utils.http import urlsafe_base64_decode
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .correos import enviar_bienvenida, enviar_recuperacion
from .models import Jugador, Participacion, Partida, TokenCliente
from .serializers import (
    JugadorSerializer,
    ParticipacionSerializer,
    RegistroSerializer,
    ReporteSerializer,
)

logger = logging.getLogger("bearstards.api")

CONTADOR = {"victoria": "victorias", "derrota": "derrotas", "empate": "empates"}


class LimiteLogin(AnonRateThrottle):
    rate = "20/min"  # frena ataques de fuerza bruta


class LimiteRecuperar(AnonRateThrottle):
    # Contador aparte del login: pedir enlaces no gasta los intentos de entrar
    scope = "recuperar"
    rate = "5/min"


def leer_cliente(request):
    # Sin "cliente" se asume la PWA, así los clientes viejos siguen igual
    cliente = request.data.get("cliente", TokenCliente.Cliente.WEB)
    if cliente not in TokenCliente.Cliente.values:
        return None
    return cliente


def cliente_invalido():
    return Response(
        {"detail": 'El campo "cliente" debe ser "web" o "juego".'},
        status=status.HTTP_400_BAD_REQUEST,
    )


def respuesta_sesion(jugador, codigo, cliente):
    # Cada cliente (web o juego) tiene su propio token
    token, _ = TokenCliente.objects.get_or_create(jugador=jugador, cliente=cliente)
    return Response(
        {"token": token.key, "jugador": JugadorSerializer(jugador).data},
        status=codigo,
    )


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([LimiteLogin])
def registro(request):
    cliente = leer_cliente(request)
    if cliente is None:
        return cliente_invalido()
    serializer = RegistroSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    jugador = serializer.save()
    logger.info("Jugador registrado: id=%s username=%s", jugador.id, jugador.username)
    if jugador.email:
        enviar_bienvenida(jugador)
    return respuesta_sesion(jugador, status.HTTP_201_CREATED, cliente)


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([LimiteLogin])
def login(request):
    cliente = leer_cliente(request)
    if cliente is None:
        return cliente_invalido()
    jugador = authenticate(
        username=request.data.get("username"),
        password=request.data.get("password"),
    )
    if jugador is None:
        return Response(
            {"detail": "Usuario o contraseña incorrectos."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return respuesta_sesion(jugador, status.HTTP_200_OK, cliente)


@api_view(["POST"])
def logout(request):
    request.auth.delete()  # solo el token de este cliente; el otro sigue activo
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def yo(request):
    return Response(JugadorSerializer(request.user).data)


# Derechos ARCO: recuperar la contraseña y eliminar la cuenta

MENSAJE_RECUPERAR = "Si el correo está registrado, te enviamos un enlace para restablecer tu contraseña."
ENLACE_INVALIDO = "El enlace no es válido o ya expiró. Pide uno nuevo."


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([LimiteRecuperar])
def recuperar(request):
    email = str(request.data.get("email") or "").strip()
    if not email:
        return Response(
            {"email": ["Escribe tu correo."]}, status=status.HTTP_400_BAD_REQUEST
        )
    jugador = Jugador.objects.filter(email__iexact=email, is_active=True).first()
    if jugador is not None:
        enviar_recuperacion(jugador)
    # La misma respuesta exista o no la cuenta: así no se puede averiguar qué correos están registrados
    return Response({"detail": MENSAJE_RECUPERAR})


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([LimiteRecuperar])
def restablecer(request):
    uid = str(request.data.get("uid") or "")
    token = str(request.data.get("token") or "")
    password = str(request.data.get("password") or "")

    jugador = None
    try:
        jugador = Jugador.objects.get(
            pk=urlsafe_base64_decode(uid).decode(), is_active=True
        )
    except (ValueError, TypeError, OverflowError, Jugador.DoesNotExist):
        pass
    # El token deja de servir al cambiar la contraseña, así que el enlace es de un solo uso
    if jugador is None or not default_token_generator.check_token(jugador, token):
        return Response({"detail": ENLACE_INVALIDO}, status=status.HTTP_400_BAD_REQUEST)

    try:
        validate_password(password, jugador)
    except ValidationError as error:
        return Response(
            {"password": list(error.messages)}, status=status.HTTP_400_BAD_REQUEST
        )

    with transaction.atomic():
        jugador.set_password(password)
        jugador.save(update_fields=["password"])
        # Se cierran todas las sesiones (web y juego) por si alguien más la tenía
        TokenCliente.objects.filter(jugador=jugador).delete()
    logger.info("Contraseña restablecida: id=%s", jugador.id)
    return Response({"detail": "Tu contraseña se cambió. Inicia sesión con la nueva."})


@api_view(["POST"])
def eliminar_cuenta(request):
    jugador = request.user
    if not jugador.check_password(str(request.data.get("password") or "")):
        return Response(
            {"password": ["La contraseña no es correcta."]},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Las partidas se conservan porque son parte de las estadísticas del rival:
    # se borran los datos personales y la cuenta queda anónima e inactiva.
    with transaction.atomic():
        TokenCliente.objects.filter(jugador=jugador).delete()
        Token.objects.filter(user=jugador).delete()
        jugador.username = f"eliminado_{jugador.id}"
        jugador.email = ""
        jugador.first_name = ""
        jugador.last_name = ""
        jugador.is_active = False
        jugador.set_unusable_password()
        jugador.save()
    logger.info("Cuenta eliminada y anonimizada: id=%s", jugador.id)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def mis_partidas(request):
    ultimas = (
        Participacion.objects.filter(jugador=request.user)
        .select_related("partida")
        .order_by("-partida__terminada_en")[:20]
    )
    return Response(ParticipacionSerializer(ultimas, many=True).data)


@api_view(["POST"])
def reportar_partida(request):
    serializer = ReporteSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    datos = serializer.validated_data
    try:
        with transaction.atomic():  # todo o nada
            partida = Partida.objects.create(
                match_id=datos["match_id"],
                por_abandono=datos["por_abandono"],
                reportada_por=request.user,
            )
            for j in datos["jugadores"]:
                Participacion.objects.create(
                    partida=partida,
                    jugador_id=j["id"],
                    puntos=j["puntos"],
                    kills=j["kills"],
                    resultado=j["resultado"],
                    abandono=j["abandono"],
                )
                contador = CONTADOR[j["resultado"]]
                Jugador.objects.filter(id=j["id"]).update(
                    partidas=F("partidas") + 1,
                    **{contador: F(contador) + 1},
                    kills=F("kills") + j["kills"],
                    puntos_totales=F("puntos_totales") + j["puntos"],
                    # En la primera partida se toma su puntaje aunque sea
                    # negativo; el 0 inicial no es una puntuación real.
                    mejor_puntuacion=Case(
                        When(partidas=0, then=Value(j["puntos"])),
                        default=Greatest(F("mejor_puntuacion"), Value(j["puntos"])),
                    ),
                )
    except IntegrityError:  # match_id repetido: el otro cliente ya la reportó
        return Response(
            {"detail": "Esta partida ya estaba registrada."},
            status=status.HTTP_409_CONFLICT,
        )
    logger.info("Partida registrada: id=%s match_id=%s", partida.id, partida.match_id)
    return Response({"partida": partida.id}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([AllowAny])
def ranking(request):
    # Las cuentas eliminadas (inactivas) ya no aparecen
    top = Jugador.objects.filter(is_active=True).order_by(
        "-puntos_totales", "username"
    )[:10]
    return Response(JugadorSerializer(top, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"ok": True})
