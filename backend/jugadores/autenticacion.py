from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions
from rest_framework.authentication import TokenAuthentication

from .models import TokenCliente


class TokenClienteAuthentication(TokenAuthentication):
    """Mismo encabezado `Authorization: Token <key>`, pero con un token por cliente."""

    model = TokenCliente

    def authenticate_credentials(self, key):
        try:
            token = TokenCliente.objects.select_related("jugador").get(key=key)
        except TokenCliente.DoesNotExist:
            raise exceptions.AuthenticationFailed(_("Invalid token."))

        if not token.jugador.is_active:
            raise exceptions.AuthenticationFailed(_("User inactive or deleted."))

        return (token.jugador, token)
