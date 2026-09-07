#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Copia de seguridad de Paraiso Cupcake Shop.
#   - Volcado de la base de datos comprimido.
#   - Archivo con las imagenes subidas desde el panel de administracion.
#   - Borrado de las copias antiguas.
# ---------------------------------------------------------------------------
# set -e   corta el script si un comando falla, para no dar por buena
#          una copia incompleta.
# set -u   corta si se usa una variable sin definir.
# pipefail hace que un fallo de pg_dump no pase desapercibido por estar
#          en mitad de una tuberia con gzip.
set -euo pipefail

PROYECTO=/opt/paraisocupcake
DESTINO=/var/backups/paraisocupcake
COMPOSE="docker compose -f $PROYECTO/docker-compose.prod.yml"
FECHA=$(date +%Y%m%d-%H%M)

DIAS_BD=14
DIAS_MEDIA=7

mkdir -p "$DESTINO/db" "$DESTINO/media"

# Las credenciales salen del .env: nunca se escriben en este archivo,
# que si esta en el repositorio.
set -a
source "$PROYECTO/.env"
set +a

# --- Base de datos ---
$COMPOSE exec -T db pg_dump -U "$DB_USER" -d "$DB_NAME" \
  | gzip > "$DESTINO/db/db-$FECHA.sql.gz"

# --- Imagenes ---
tar -czf "$DESTINO/media/media-$FECHA.tar.gz" -C "$PROYECTO/backend" media

# --- Rotacion ---
# La base de datos ocupa poco y es lo mas valioso: se guardan mas dias.
find "$DESTINO/db"    -name 'db-*.sql.gz'      -mtime +$DIAS_BD    -delete
find "$DESTINO/media" -name 'media-*.tar.gz'   -mtime +$DIAS_MEDIA -delete

echo "$(date '+%F %T') copia correcta: db-$FECHA.sql.gz"