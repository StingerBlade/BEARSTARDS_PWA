# Create your views here.
import logging

from django.contrib.auth import authenticate
from django.db import IntegrityError, transaction
from django.db.models import Case, F, Value, When
from django.db.models.functions import Greatest
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle

from .correos import enviar_bienvenida
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
    top = Jugador.objects.order_by("-puntos_totales", "username")[:10]
    return Response(JugadorSerializer(top, many=True).data)


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"ok": True})
