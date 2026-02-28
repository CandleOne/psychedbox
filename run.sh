#!/bin/bash
# run.sh — Entrypoint for the production Docker container.
# If Litestream is configured (LITESTREAM_BUCKET is set), it runs Litestream
# as a wrapper around the Node.js process, providing continuous SQLite backup.
# Otherwise, it starts Node.js directly.

set -e

if [ -n "$LITESTREAM_BUCKET" ]; then
  echo "🔄 Litestream enabled — restoring DB from replica (if exists)..."
  litestream restore -if-replica-exists -config /etc/litestream.yml /app/data/psychedbox.db
  echo "🚀 Starting app with Litestream replication..."
  exec litestream replicate -config /etc/litestream.yml -exec "node dist/index.js"
else
  echo "⚠️  Litestream not configured (LITESTREAM_BUCKET not set) — running without backups"
  exec node dist/index.js
fi
