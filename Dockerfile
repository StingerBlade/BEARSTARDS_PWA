# Imagen de la PWA de Little Bearstards: Django sirve /api/ y el build de Vite.

# Etapa 1: compilar la PWA con Node
FROM node:22-alpine AS front
WORKDIR /app/ui
# Primero solo las dependencias, para que Docker las reutilice si no cambian
COPY ui/package.json ui/package-lock.json ./
RUN npm ci
COPY ui/ ./
RUN npm run build

# Etapa 2: backend con Python (la imagen final no lleva Node)
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./
COPY --from=front /app/ui/dist /app/ui/dist
# collectstatic solo necesita una SECRET_KEY cualquiera; la real llega al arrancar
RUN SECRET_KEY=solo-para-build python manage.py collectstatic --no-input

# No correr como root
RUN useradd --create-home bearstards
USER bearstards

EXPOSE 8000
# Al arrancar: crear/actualizar tablas y levantar el servidor
CMD ["sh", "-c", "python manage.py migrate --no-input && gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000}"]