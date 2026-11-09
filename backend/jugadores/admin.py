from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Jugador, Participacion, Partida, TokenCliente

admin.site.register(Jugador, UserAdmin)
admin.site.register(Partida)
admin.site.register(Participacion)


@admin.register(TokenCliente)
class TokenClienteAdmin(admin.ModelAdmin):
    list_display = ["jugador", "cliente", "creado"]
    list_filter = ["cliente"]
    search_fields = ["jugador__username"]
