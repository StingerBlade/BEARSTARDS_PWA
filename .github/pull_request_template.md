## Qué cambia

<!-- Una o dos líneas. -->

## Tipo

- [ ] Front (`ui/`)
- [ ] Back (`backend/`)
- [ ] CI / infraestructura

## Checklist

- [ ] Probé en local lo que cambié
- [ ] Front: `npm run lint` y `npm run build` pasan en local
- [ ] Back: `ruff check .` y `python manage.py test` pasan en local
- [ ] Back: si cambié modelos, incluí las migraciones
- [ ] Back: si agregué librerías, actualicé `requirements.txt`
- [ ] No subí `.env`, contraseñas, llaves ni cadenas de conexión
- [ ] El PR apunta a `development` (o a `main` solo si es un release)
