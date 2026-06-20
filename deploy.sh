#!/usr/bin/env bash
set -euo pipefail

echo "=== Pulling latest changes ==="
git pull origin main

echo "=== Installing dependencies ==="
npm ci --omit=dev

echo "=== Running migrations ==="
npm run migrate

echo "=== Building and restarting container ==="
docker compose down
docker compose up -d --build

echo "=== Deploy complete ==="
