from django.contrib.auth.password_validation import (
    validate_password as validar_password,
)
from rest_framework import serializers

from .models import Jugador, Participacion

class JugadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jugador
        fields = [
            "id",
            "username",
            "partidas",
            "victorias",
            "derrotas",
            "empates",
            "kills",
            "puntos_totales",
            "mejor_puntuacion",
        ]


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Jugador
        fields = ["username", "password"]

    def validate_password(self, value):
        validar_password(value)
        return value

    def create(self, validated_data):
        # create_user guarda la contraseña con hash.
        return Jugador.objects.create_user(**validated_data)

class ParticipacionSerializer(serializers.ModelSerializer):
    fecha = serializers.DateTimeField(source="partida.terminada_en")
    por_abandono = serializers.BooleanField(source="partida.por_abandono")

    class Meta:
        model = Participacion
        fields = ["fecha", "puntos", "kills", "resultado", "abandono", "por_abandono"]


class ParticipanteSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    puntos = serializers.IntegerField(min_value=0)
    kills = serializers.IntegerField(min_value=0)
    resultado = serializers.ChoiceField(choices=Participacion.Resultado.choices)
    abandono = serializers.BooleanField(default=False)


class ReporteSerializer(serializers.Serializer):
    match_id = serializers.CharField(max_length=64)
    por_abandono = serializers.BooleanField(default=False)
    jugadores = ParticipanteSerializer(many=True)

    def validate(self, data):
        jugadores = data["jugadores"]
        ids = {j["id"] for j in jugadores}
        if len(jugadores) != 2 or len(ids) != 2:
            raise serializers.ValidationError("Deben venir exactamente 2 jugadores distintos.")
        if Jugador.objects.filter(id__in=ids).count() != 2:
            raise serializers.ValidationError("Algún jugador no existe.")
        if self.context["request"].user.id not in ids:
            raise serializers.ValidationError("Solo un jugador de la partida puede reportarla.")

        resultados = sorted(j["resultado"] for j in jugadores)
        if resultados not in (["derrota", "victoria"], ["empate", "empate"]):
            raise serializers.ValidationError(
                "Debe haber una victoria y una derrota, o dos empates."
            )

        abandonos = [j for j in jugadores if j["abandono"]]
        if data["por_abandono"]:
            if len(abandonos) != 1 or abandonos[0]["resultado"] != "derrota":
                raise serializers.ValidationError("En un abandono, quien abandona pierde.")
        elif abandonos:
            raise serializers.ValidationError("Hay un abandono pero por_abandono es false.")
        return data