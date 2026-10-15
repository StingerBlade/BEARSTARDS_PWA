from django.contrib.auth.models import AbstractUser
from django.db import models


class Jugador(AbstractUser):
    partidas = models.PositiveIntegerField(default=0)
    victorias = models.PositiveIntegerField(default=0)
    derrotas = models.PositiveIntegerField(default=0)
    empates = models.PositiveIntegerField(default=0)
    kills = models.PositiveIntegerField(default=0)
    puntos_totales = models.PositiveIntegerField(default=0)
    mejor_puntuacion = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "jugador"


class Partida(models.Model):
    match_id = models.CharField(max_length=64, unique=True)
    terminada_en = models.DateTimeField(auto_now_add=True)
    por_abandono = models.BooleanField(default=False)
    reportada_por = models.ForeignKey(
        Jugador, on_delete=models.PROTECT, related_name="+"
    )

    class Meta:
        db_table = "partida"


class Participacion(models.Model):
    class Resultado(models.TextChoices):
        VICTORIA = "victoria"
        DERROTA = "derrota"
        EMPATE = "empate"

    partida = models.ForeignKey(
        Partida, on_delete=models.CASCADE, related_name="participaciones"
    )
    jugador = models.ForeignKey(
        Jugador, on_delete=models.PROTECT, related_name="participaciones"
    )
    puntos = models.PositiveIntegerField()
    kills = models.PositiveIntegerField()
    resultado = models.CharField(max_length=8, choices=Resultado.choices)
    abandono = models.BooleanField(default=False)

    class Meta:
        db_table = "participacion"
        constraints = [
            models.UniqueConstraint(
                fields=["partida", "jugador"], name="uniq_jugador_partida"
            )
        ]
