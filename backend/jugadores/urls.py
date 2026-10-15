from django.urls import path

from . import views

urlpatterns = [
    path("auth/registro/", views.registro),
    path("auth/login/", views.login),
    path("auth/logout/", views.logout),
    path("yo/", views.yo),
    path("yo/partidas/", views.mis_partidas),
    path("partidas/", views.reportar_partida),
    path("ranking/", views.ranking),
    path("health/", views.health),
]