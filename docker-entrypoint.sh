#!/bin/sh
set -e

echo "=== Running migrations ==="
node migrations/run.js

echo "=== Starting app ==="
exec node index.js
