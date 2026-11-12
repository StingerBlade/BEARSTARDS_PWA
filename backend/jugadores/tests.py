# Create your tests here.
import copy
import json
import re
from pathlib import Path
from unittest import mock

from django.conf import settings
from django.core import mail
from django.core.cache import cache
from jsonschema import Draft202012Validator
from rest_framework.test import APITestCase

from .models import Jugador, Participacion, Partida, TokenCliente


def imprimir_separador(nombre_test):
    print(f"\n{'-' * 15} TEST: {nombre_test} {'-' * 15}")


# Registro, login y perfil


class RegistroLoginTests(APITestCase):
    def test_registro_crea_jugador_y_devuelve_token(self):
        imprimir_separador("test_registro_crea_jugador_y_devuelve_token")
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
        imprimir_separador("test_registro_con_usuario_repetido_da_400")
        Jugador.objects.create_user("oso_rojo", password="Peluche-Seguro-1")
        r = self.client.post(
            "/api/auth/registro/",
            {"username": "oso_rojo", "password": "Peluche-Seguro-2"},
            format="json",
        )
        self.assertEqual(r.status_code, 400)

    def test_login_correcto_e_incorrecto(self):
        imprimir_separador("test_login_correcto_e_incorrecto")
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
        imprimir_separador("test_yo_sin_token_da_401")
        self.assertEqual(self.client.get("/api/yo/").status_code, 401)


# Un token por cliente (web y juego)


class TokenPorClienteTests(APITestCase):
    def setUp(self):
        cache.clear()  # el límite de 20 logins/min se guarda en caché entre tests
        Jugador.objects.create_user("oso_rojo", password="Peluche-Seguro-1")

    def entrar(self, **extra):
        datos = {"username": "oso_rojo", "password": "Peluche-Seguro-1", **extra}
        return self.client.post("/api/auth/login/", datos, format="json")

    def yo(self, token):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)
        return self.client.get("/api/yo/")

    def salir(self, token):
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)
        return self.client.post("/api/auth/logout/")

    def test_web_y_juego_tienen_tokens_distintos(self):
        imprimir_separador("test_web_y_juego_tienen_tokens_distintos")
        web = self.entrar(cliente="web")
        juego = self.entrar(cliente="juego")
        self.assertEqual((web.status_code, juego.status_code), (200, 200))
        self.assertEqual(set(web.data), {"token", "jugador"})
        self.assertNotEqual(web.data["token"], juego.data["token"])
        self.assertEqual(self.yo(web.data["token"]).status_code, 200)
        self.assertEqual(self.yo(juego.data["token"]).status_code, 200)

    def test_logout_del_juego_no_cierra_la_web(self):
        imprimir_separador("test_logout_del_juego_no_cierra_la_web")
        web = self.entrar(cliente="web").data["token"]
        juego = self.entrar(cliente="juego").data["token"]
        self.assertEqual(self.salir(juego).status_code, 204)
        self.assertEqual(self.yo(juego).status_code, 401)
        self.assertEqual(self.yo(web).status_code, 200)

    def test_logout_de_la_web_no_cierra_el_juego(self):
        imprimir_separador("test_logout_de_la_web_no_cierra_el_juego")
        web = self.entrar(cliente="web").data["token"]
        juego = self.entrar(cliente="juego").data["token"]
        self.assertEqual(self.salir(web).status_code, 204)
        self.assertEqual(self.yo(web).status_code, 401)
        self.assertEqual(self.yo(juego).status_code, 200)

    def test_mismo_cliente_reutiliza_el_token(self):
        imprimir_separador("test_mismo_cliente_reutiliza_el_token")
        primero = self.entrar(cliente="juego").data["token"]
        segundo = self.entrar(cliente="juego").data["token"]
        self.assertEqual(primero, segundo)
        self.assertEqual(TokenCliente.objects.count(), 1)

    def test_cliente_invalido_da_400(self):
        imprimir_separador("test_cliente_invalido_da_400")
        r = self.entrar(cliente="consola")
        self.assertEqual(r.status_code, 400)
        self.assertIn("cliente", r.data["detail"])
        r = self.client.post(
            "/api/auth/registro/",
            {"username": "oso_nuevo", "password": "Peluche-Seguro-1", "cliente": "x"},
            format="json",
        )
        self.assertEqual(r.status_code, 400)
        self.assertFalse(Jugador.objects.filter(username="oso_nuevo").exists())

    def test_sin_cliente_se_asume_web(self):
        imprimir_separador("test_sin_cliente_se_asume_web")
        r = self.entrar()
        self.assertEqual(r.status_code, 200)
        token = TokenCliente.objects.get(key=r.data["token"])
        self.assertEqual(token.cliente, "web")
        # Y es el mismo token que si se pide "web" explícito
        self.assertEqual(self.entrar(cliente="web").data["token"], r.data["token"])

    def test_registro_desde_el_juego(self):
        imprimir_separador("test_registro_desde_el_juego")
        r = self.client.post(
            "/api/auth/registro/",
            {
                "username": "oso_nuevo",
                "password": "Peluche-Seguro-1",
                "cliente": "juego",
            },
            format="json",
        )
        self.assertEqual(r.status_code, 201)
        self.assertEqual(TokenCliente.objects.get(key=r.data["token"]).cliente, "juego")


# RANKING


class CorreoBienvenidaTests(APITestCase):
    def registrar(self, **extra):
        datos = {"username": "oso_correo", "password": "Peluche-Seguro-1", **extra}
        return self.client.post("/api/auth/registro/", datos, format="json")

    def test_con_correo_manda_bienvenida_con_imagenes(self):
        imprimir_separador("test_con_correo_manda_bienvenida_con_imagenes")
        r = self.registrar(email="Oso@Ejemplo.com")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(
            Jugador.objects.get(username="oso_correo").email, "oso@ejemplo.com"
        )
        self.assertEqual(len(mail.outbox), 1)
        correo = mail.outbox[0]
        self.assertEqual(correo.to, ["oso@ejemplo.com"])
        self.assertIn("oso_correo", correo.subject)
        html = correo.alternatives[0][0]
        self.assertIn("¡Hola, oso_correo!", html)
        # Cada cid: del HTML tiene su imagen adjunta
        adjuntas = {a["Content-ID"].strip("<>") for a in correo.attachments}
        for cid in (
            "bear-player",
            "weapon-sewing-needle",
            "weapon-dart-blaster-v2",
            "item-thread-spool",
        ):
            self.assertIn(f"cid:{cid}", html)
            self.assertIn(cid, adjuntas)

    def test_sin_correo_no_manda_nada(self):
        imprimir_separador("test_sin_correo_no_manda_nada")
        self.assertEqual(self.registrar().status_code, 201)
        self.assertEqual(len(mail.outbox), 0)

    def test_correo_repetido_da_400(self):
        imprimir_separador("test_correo_repetido_da_400")
        Jugador.objects.create_user(
            "oso_rojo", email="oso@ejemplo.com", password="Peluche-Seguro-1"
        )
        r = self.registrar(email="OSO@ejemplo.com")
        self.assertEqual(r.status_code, 400)
        self.assertIn("email", r.data)

    def test_si_falla_el_envio_el_registro_sigue(self):
        imprimir_separador("test_si_falla_el_envio_el_registro_sigue")
        with mock.patch(
            "django.core.mail.EmailMultiAlternatives.send",
            side_effect=OSError("sin red"),
        ):
            r = self.registrar(email="oso@ejemplo.com")
        self.assertEqual(r.status_code, 201)
        self.assertTrue(Jugador.objects.filter(username="oso_correo").exists())


class RankingTests(APITestCase):
    def test_ranking_es_publico_y_ordena_por_puntos(self):
        imprimir_separador("test_ranking_es_publico_y_ordena_por_puntos")
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
        token = TokenCliente.objects.create(jugador=self.a, cliente="juego")
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
        imprimir_separador("test_suma_estadisticas")
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
        imprimir_separador("test_empate")
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
        imprimir_separador("test_reporte_repetido_da_409_y_no_duplica")
        self.client.post("/api/partidas/", self.reporte(), format="json")
        r = self.client.post("/api/partidas/", self.reporte(), format="json")
        self.assertEqual(r.status_code, 409)
        self.assertEqual(Partida.objects.count(), 1)
        self.a.refresh_from_db()
        self.assertEqual(self.a.partidas, 1)

    def test_resultados_incoherentes_dan_400(self):
        imprimir_separador("test_resultados_incoherentes_dan_400")
        jugadores = [
            {"id": self.a.id, "puntos": 950, "kills": 4, "resultado": "victoria"},
            {"id": self.b.id, "puntos": 400, "kills": 2, "resultado": "victoria"},
        ]
        r = self.client.post(
            "/api/partidas/", self.reporte(jugadores=jugadores), format="json"
        )
        self.assertEqual(r.status_code, 400)

    def test_acepta_puntos_cero_y_negativos(self):
        imprimir_separador("test_acepta_puntos_cero_y_negativos")
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
        imprimir_separador("test_mejor_puntuacion_no_baja_con_una_partida_negativa")
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
        imprimir_separador("test_mis_partidas_devuelve_historial")
        self.client.post("/api/partidas/", self.reporte(), format="json")
        r = self.client.get("/api/yo/partidas/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data[0]["resultado"], "victoria")

    def test_abandono_valido_suma_estadisticas(self):
        imprimir_separador("test_abandono_valido_suma_estadisticas")
        jugadores = [
            {"id": self.a.id, "puntos": 700, "kills": 3, "resultado": "victoria"},
            {
                "id": self.b.id,
                "puntos": 100,
                "kills": 0,
                "resultado": "derrota",
                "abandono": True,
            },
        ]
        r = self.client.post(
            "/api/partidas/",
            self.reporte(por_abandono=True, jugadores=jugadores),
            format="json",
        )
        self.assertEqual(r.status_code, 201)
        self.assertTrue(Partida.objects.get().por_abandono)
        self.assertTrue(Participacion.objects.get(jugador=self.b).abandono)
        self.a.refresh_from_db()
        self.b.refresh_from_db()
        self.assertEqual((self.a.victorias, self.a.puntos_totales), (1, 700))
        self.assertEqual((self.b.derrotas, self.b.partidas), (1, 1))

    def test_abandonos_incoherentes_dan_400(self):
        imprimir_separador("test_abandonos_incoherentes_dan_400")
        victoria = {"id": self.a.id, "puntos": 700, "kills": 3, "resultado": "victoria"}
        derrota = {"id": self.b.id, "puntos": 100, "kills": 0, "resultado": "derrota"}
        casos = [
            # por_abandono sin nadie que abandone
            (True, [victoria, derrota]),
            # quien abandona no puede ganar
            (True, [{**victoria, "abandono": True}, derrota]),
            # hay abandono pero la partida no dice por_abandono
            (False, [victoria, {**derrota, "abandono": True}]),
        ]
        for por_abandono, jugadores in casos:
            with self.subTest(por_abandono=por_abandono, jugadores=jugadores):
                r = self.client.post(
                    "/api/partidas/",
                    self.reporte(por_abandono=por_abandono, jugadores=jugadores),
                    format="json",
                )
                self.assertEqual(r.status_code, 400)
        self.assertEqual(Partida.objects.count(), 0)


# Contrato con el juego (CI-P03): contratos/resultado-partida.schema.json

ESQUEMA = json.loads(
    (Path(settings.BASE_DIR) / "contratos" / "resultado-partida.schema.json").read_text(
        encoding="utf-8"
    )
)
VALIDADOR = Draft202012Validator(ESQUEMA)


class ContratoResultadoTests(APITestCase):
    def setUp(self):
        self.a = Jugador.objects.create_user("oso_rojo", password="Peluche-Seguro-1")
        self.b = Jugador.objects.create_user("oso_azul", password="Peluche-Seguro-2")
        token = TokenCliente.objects.create(jugador=self.a, cliente="juego")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token.key)

    def ejemplo(self):
        # El ejemplo del esquema con los ids de los jugadores de la prueba
        datos = copy.deepcopy(ESQUEMA["examples"][0])
        datos["jugadores"][0]["id"] = self.a.id
        datos["jugadores"][1]["id"] = self.b.id
        return datos

    def test_el_esquema_es_valido(self):
        imprimir_separador("test_el_esquema_es_valido")
        Draft202012Validator.check_schema(ESQUEMA)

    def test_el_ejemplo_cumple_el_esquema_y_la_api_lo_acepta(self):
        imprimir_separador("test_el_ejemplo_cumple_el_esquema_y_la_api_lo_acepta")
        datos = self.ejemplo()
        VALIDADOR.validate(datos)
        r = self.client.post("/api/partidas/", datos, format="json")
        self.assertEqual(r.status_code, 201)

    def test_resultado_con_campos_faltantes_da_400(self):
        imprimir_separador("test_resultado_con_campos_faltantes_da_400")
        faltantes = [("match_id", None), ("jugadores", None)] + [
            (campo, 0) for campo in ESQUEMA["$defs"]["jugador"]["required"]
        ]
        for campo, jugador in faltantes:
            with self.subTest(falta=campo):
                datos = self.ejemplo()
                datos["match_id"] = f"sin-{campo}"
                if jugador is None:
                    del datos[campo]
                else:
                    del datos["jugadores"][jugador][campo]
                self.assertFalse(VALIDADOR.is_valid(datos))
                r = self.client.post("/api/partidas/", datos, format="json")
                self.assertEqual(r.status_code, 400)
        self.assertEqual(Partida.objects.count(), 0)


# Derechos ARCO: recuperar la contraseña y eliminar la cuenta


class CuentaArcoTests(APITestCase):
    def setUp(self):
        cache.clear()  # el login y la recuperación tienen límite por minuto
        self.jugador = Jugador.objects.create_user(
            "oso_rojo", email="rojo@correo.com", password="Peluche-Seguro-1"
        )
        self.rival = Jugador.objects.create_user(
            "oso_azul", password="Peluche-Seguro-2"
        )

    def entrar(self, password="Peluche-Seguro-1", cliente="web"):
        return self.client.post(
            "/api/auth/login/",
            {"username": "oso_rojo", "password": password, "cliente": cliente},
            format="json",
        )

    def pedir_enlace(self):
        self.client.post(
            "/api/auth/recuperar/", {"email": "ROJO@correo.com"}, format="json"
        )
        enlace = re.search(r"uid=([^&\s]+)&token=([^\s]+)", mail.outbox[-1].body)
        return enlace.group(1), enlace.group(2)

    def test_recuperar_con_correo_registrado_envia_enlace(self):
        imprimir_separador("test_recuperar_con_correo_registrado_envia_enlace")
        r = self.client.post(
            "/api/auth/recuperar/", {"email": "Rojo@Correo.com"}, format="json"
        )
        self.assertEqual(r.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ["rojo@correo.com"])
        self.assertIn("/#/restablecer?uid=", mail.outbox[0].body)

    def test_recuperar_con_correo_desconocido_responde_igual(self):
        imprimir_separador("test_recuperar_con_correo_desconocido_responde_igual")
        conocido = self.client.post(
            "/api/auth/recuperar/", {"email": "rojo@correo.com"}, format="json"
        )
        desconocido = self.client.post(
            "/api/auth/recuperar/", {"email": "nadie@correo.com"}, format="json"
        )
        self.assertEqual(desconocido.status_code, 200)
        self.assertEqual(desconocido.data, conocido.data)
        self.assertEqual(len(mail.outbox), 1)  # solo el del correo registrado

    def test_restablecer_cambia_la_contrasena_y_cierra_sesiones(self):
        imprimir_separador("test_restablecer_cambia_la_contrasena_y_cierra_sesiones")
        viejo = self.entrar(cliente="juego").data["token"]
        uid, token = self.pedir_enlace()
        r = self.client.post(
            "/api/auth/restablecer/",
            {"uid": uid, "token": token, "password": "Peluche-Nuevo-9"},
            format="json",
        )
        self.assertEqual(r.status_code, 200)
        self.assertEqual(TokenCliente.objects.filter(jugador=self.jugador).count(), 0)
        self.client.credentials(HTTP_AUTHORIZATION="Token " + viejo)
        self.assertEqual(self.client.get("/api/yo/").status_code, 401)
        self.client.credentials()
        self.assertEqual(self.entrar().status_code, 400)
        self.assertEqual(self.entrar("Peluche-Nuevo-9").status_code, 200)

    def test_enlace_de_restablecer_solo_sirve_una_vez(self):
        imprimir_separador("test_enlace_de_restablecer_solo_sirve_una_vez")
        uid, token = self.pedir_enlace()
        datos = {"uid": uid, "token": token, "password": "Peluche-Nuevo-9"}
        self.assertEqual(
            self.client.post(
                "/api/auth/restablecer/", datos, format="json"
            ).status_code,
            200,
        )
        datos["password"] = "Otra-Clave-77"
        self.assertEqual(
            self.client.post(
                "/api/auth/restablecer/", datos, format="json"
            ).status_code,
            400,
        )

    def test_restablecer_con_enlace_invalido_o_contrasena_debil_da_400(self):
        imprimir_separador(
            "test_restablecer_con_enlace_invalido_o_contrasena_debil_da_400"
        )
        uid, token = self.pedir_enlace()
        invalido = self.client.post(
            "/api/auth/restablecer/",
            {"uid": uid, "token": "falso-123", "password": "Peluche-Nuevo-9"},
            format="json",
        )
        self.assertEqual(invalido.status_code, 400)
        debil = self.client.post(
            "/api/auth/restablecer/",
            {"uid": uid, "token": token, "password": "123"},
            format="json",
        )
        self.assertEqual(debil.status_code, 400)
        self.assertIn("password", debil.data)
        self.jugador.refresh_from_db()
        self.assertTrue(self.jugador.check_password("Peluche-Seguro-1"))

    def test_eliminar_cuenta_con_contrasena_incorrecta_da_400(self):
        imprimir_separador("test_eliminar_cuenta_con_contrasena_incorrecta_da_400")
        token = self.entrar().data["token"]
        self.client.credentials(HTTP_AUTHORIZATION="Token " + token)
        r = self.client.post(
            "/api/yo/eliminar/", {"password": "No-Es-Esta"}, format="json"
        )
        self.assertEqual(r.status_code, 400)
        self.jugador.refresh_from_db()
        self.assertTrue(self.jugador.is_active)

    def test_eliminar_cuenta_anonimiza_y_cierra_sesiones(self):
        imprimir_separador("test_eliminar_cuenta_anonimiza_y_cierra_sesiones")
        # Una partida contra el rival: debe seguir contando para él
        partida = Partida.objects.create(match_id="arco-1", reportada_por=self.rival)
        Participacion.objects.create(
            partida=partida,
            jugador=self.jugador,
            puntos=100,
            kills=1,
            resultado="derrota",
        )
        Participacion.objects.create(
            partida=partida,
            jugador=self.rival,
            puntos=400,
            kills=2,
            resultado="victoria",
        )
        web = self.entrar().data["token"]
        juego = self.entrar(cliente="juego").data["token"]

        self.client.credentials(HTTP_AUTHORIZATION="Token " + web)
        r = self.client.post(
            "/api/yo/eliminar/", {"password": "Peluche-Seguro-1"}, format="json"
        )
        self.assertEqual(r.status_code, 204)

        self.jugador.refresh_from_db()
        self.assertEqual(self.jugador.username, f"eliminado_{self.jugador.id}")
        self.assertEqual(self.jugador.email, "")
        self.assertFalse(self.jugador.is_active)
        self.assertFalse(self.jugador.has_usable_password())
        for token in (web, juego):
            self.client.credentials(HTTP_AUTHORIZATION="Token " + token)
            self.assertEqual(self.client.get("/api/yo/").status_code, 401)
        self.client.credentials()
        self.assertEqual(self.entrar().status_code, 400)
        nombres = [j["username"] for j in self.client.get("/api/ranking/").data]
        self.assertNotIn(self.jugador.username, nombres)
        self.assertEqual(Participacion.objects.filter(partida=partida).count(), 2)
