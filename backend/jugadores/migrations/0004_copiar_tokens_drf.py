from django.db import migrations


def copiar_tokens(apps, schema_editor):
    # Los tokens viejos de DRF eran de la PWA: se copian como "web" con la misma
    # llave para que nadie pierda su sesión.
    Token = apps.get_model("authtoken", "Token")
    TokenCliente = apps.get_model("jugadores", "TokenCliente")
    TokenCliente.objects.bulk_create(
        [
            TokenCliente(key=t.key, jugador_id=t.user_id, cliente="web")
            for t in Token.objects.all()
        ],
        ignore_conflicts=True,
    )


class Migration(migrations.Migration):
    dependencies = [
        ("jugadores", "0003_token_cliente"),
        ("authtoken", "0004_alter_tokenproxy_options"),
    ]

    operations = [
        migrations.RunPython(copiar_tokens, migrations.RunPython.noop),
    ]
