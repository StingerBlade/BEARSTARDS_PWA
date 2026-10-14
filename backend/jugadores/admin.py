from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Jugador, Participacion, Partida

admin.site.register(Jugador, UserAdmin)
admin.site.register(Partida)
admin.site.register(Participacion)