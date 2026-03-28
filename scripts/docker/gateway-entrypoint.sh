#!/bin/sh
set -eu

# Railway/Fly/Kubernetes volumes are often root-owned; the gateway runs as `node` (uid 1000)
# and must write OPENCLAW_STATE_DIR (e.g. /data/.openclaw). Fix ownership when we start as root.
if [ "$(id -u)" = "0" ]; then
  if [ -d /data ]; then
    chown -R node:node /data
  fi
  exec /usr/sbin/runuser -u node -g node -- "$@"
fi

exec "$@"
