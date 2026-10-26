# Create your tests here.
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from .models import Jugador, Participacion, Partida

# Registro, login y perfil


class RegistroLoginTests(APITestCase):
    def test_registro_crea_jugador_y_devuelve_token(self):
        r = self.client.post(
            "/api/auth/registro/",
            {"username": "oso_nuevo", "password": "Peluche-Seguro-1"},
            format="json",
        )
        self.assertEqual(r.status_code, 201)
        self.assertIn("token", r.data)
        jugador = Jugador.objects.get(username="oso_nuevo")
        self.assertNotEqual(jugador.password, "Peluche-Seguro-1")  # se guarda con hash

    def test_registro_con_usuario_repetido_da_400(self):
        Jugador.objects.create_user("oso_rojo", password="Peluche-Seguro-1")
        r = self.client.post(
            "/api/auth/registro/",
            {"username": "oso_rojo", "password": "Peluche-Seguro-2"},
            format="json",
        )
        self.assertEqual(r.status_code, 400)

    def test_login_correcto_e_incorrecto(self):
        Jugador.objects.create_user("oso_rojo", password="Peluche-Seguro-1")
        ok = self.client.post(
            "/api/auth/login/",
            {"username": "oso_rojo", "password": "Peluche-Seguro-1"},
            format="json",
        )
        mal = self.client.post(
            "/api/auth/login/",
            {"username": "oso_rojo", "password": "otra"},
            format="json",
        )
        self.assertEqual(ok.status_code, 200)
        self.assertEqual(mal.status_code, 400)

    def test_yo_sin_token_da_401(self):
        self.assertEqual(self.client.get("/api/yo/").status_code, 401)


# RANKING


class RankingTests(APITestCase):
    def test_ranking_es_publico_y_ordena_por_puntos(self):
        Jugador.objects.create_user("bajo", password="x", puntos_totales=100)
        Jugador.objects.create_user("alto", password="x", puntos_totales=900)
        r = self.client.get("/api/ranking/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual([j["username"] for j in r.data], ["alto", "bajo"])


# PARTIDAS


class ReportarPartidaTests(APITestCase):
    def setUp(self):
        self.a = Jugador.objects.create_user("oso_rojo", password="Peluche-Seguro-1")
        self.b = Jugador.objects.create_user("oso_azul", password="Peluche-Seguro-2")
        token = Token.objects.create(user=self.a)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    def reporte(self, **cambios):
        datos = {
            "match_id": "sala-1-1731000000",
            "por_abandono": False,
            "jugadores": [
                {"id": self.a.id, "puntos": 950, "kills": 4, "resultado": "victoria"},
                {"id": self.b.id, "puntos": 400, "kills": 2, "resultado": "derrota"},
            ],
        }
        datos.update(cambios)
        return datos

    def test_suma_estadisticas(self):
        r = self.client.post("/api/partidas/", self.reporte(), format="json")
        self.assertEqual(r.status_code, 201)
        self.a.refresh_from_db()
        self.b.refresh_from_db()
        self.assertEqual(
            (self.a.partidas, self.a.victorias, self.a.kills, self.a.mejor_puntuacion),
            (1, 1, 4, 950),
        )
        self.assertEqual((self.b.derrotas, self.b.puntos_totales), (1, 400))
        self.assertEqual(Participacion.objects.count(), 2)

    def test_empate(self):
        jugadores = [
            {"id": self.a.id, "puntos": 400, "kills": 2, "resultado": "empate"},
            {"id": self.b.id, "puntos": 400, "kills": 2, "resultado": "empate"},
        ]
        r = self.client.post(
            "/api/partidas/", self.reporte(jugadores=jugadores), format="json"
        )
        self.assertEqual(r.status_code, 201)
        self.a.refresh_from_db()
        self.assertEqual(self.a.empates, 1)

    def test_reporte_repetido_da_409_y_no_duplica(self):
        self.client.post("/api/partidas/", self.reporte(), format="json")
        r = self.client.post("/api/partidas/", self.reporte(), format="json")
        self.assertEqual(r.status_code, 409)
        self.assertEqual(Partida.objects.count(), 1)
        self.a.refresh_from_db()
        self.assertEqual(self.a.partidas, 1)

    def test_resultados_incoherentes_dan_400(self):
        jugadores = [
            {"id": self.a.id, "puntos": 950, "kills": 4, "resultado": "victoria"},
            {"id": self.b.id, "puntos": 400, "kills": 2, "resultado": "victoria"},
        ]
        r = self.client.post(
            "/api/partidas/", self.reporte(jugadores=jugadores), format="json"
        )
        self.assertEqual(r.status_code, 400)

    def test_acepta_puntos_cero_y_negativos(self):
        jugadores = [
            {"id": self.a.id, "puntos": 0, "kills": 0, "resultado": "victoria"},
            {"id": self.b.id, "puntos": -100, "kills": 0, "resultado": "derrota"},
        ]
        r = self.client.post(
            "/api/partidas/", self.reporte(jugadores=jugadores), format="json"
        )
        self.assertEqual(r.status_code, 201)
        self.b.refresh_from_db()
        self.assertEqual((self.b.puntos_totales, self.b.mejor_puntuacion), (-100, -100))

    def test_mejor_puntuacion_no_baja_con_una_partida_negativa(self):
        self.client.post("/api/partidas/", self.reporte(), format="json")
        jugadores = [
            {"id": self.a.id, "puntos": -50, "kills": 0, "resultado": "derrota"},
            {"id": self.b.id, "puntos": 200, "kills": 1, "resultado": "victoria"},
        ]
        self.client.post(
            "/api/partidas/",
            self.reporte(match_id="sala-1-1731000900", jugadores=jugadores),
            format="json",
        )
        self.a.refresh_from_db()
        self.assertEqual((self.a.puntos_totales, self.a.mejor_puntuacion), (900, 950))
        
    def test_mis_partidas_devuelve_historial(self):
        self.client.post("/api/partidas/", self.reporte(), format="json")
        r = self.client.get("/api/yo/partidas/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data[0]["resultado"], "victoria")
