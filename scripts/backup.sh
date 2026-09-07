#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Copia de seguridad de Paraiso Cupcake Shop.
#   - Volcado de la base de datos comprimido.
#   - Archivo con las imagenes subidas desde el panel de administracion.
#   - Borrado de las copias antiguas.
#   - Envio a Google Drive, para que exista una copia fuera del servidor.
# ---------------------------------------------------------------------------
set -euo pipefail

PROYECTO=/opt/paraisocupcake
DESTINO=/var/backups/paraisocupcake
REMOTO=gdrive:paraisocupcake-backups
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

# --- Rotacion local ---
find "$DESTINO/db"    -name 'db-*.sql.gz'    -mtime +$DIAS_BD    -delete
find "$DESTINO/media" -name 'media-*.tar.gz' -mtime +$DIAS_MEDIA -delete

# --- Copia fuera del servidor ---
if rclone listremotes 2>/dev/null | grep -q '^gdrive:'; then
  # La base de datos ocupa kilobytes: se usa "copy", que anade sin borrar.
  # Asi el historial completo sigue en Drive aunque el servidor pierda sus
  # copias locales, que es justo el escenario del que queremos protegernos.
  rclone copy "$DESTINO/db" "$REMOTO/db" --transfers 2

  # Las imagenes ocupan decenas de megas: se usa "sync", que deja Drive
  # igual que el servidor. Refleja la rotacion y evita que crezca sin fin.
  rclone sync "$DESTINO/media" "$REMOTO/media" --transfers 2

  echo "$(date '+%F %T') copias enviadas a Google Drive"
else
  echo "$(date '+%F %T') AVISO: rclone sin configurar, copias solo en local"
fi

echo "$(date '+%F %T') copia correcta: db-$FECHA.sql.gz"