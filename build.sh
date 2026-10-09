#!/usr/bin/env bash
# Build de Render: compila el front (Vite) y prepara el back (Django).
# Render ejecuta este script en cada deploy (ver render.yaml).
set -o errexit

# 1) Front: genera ui/dist
(cd ui && npm ci && npm run build)

# 2) Back
cd backend
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input
