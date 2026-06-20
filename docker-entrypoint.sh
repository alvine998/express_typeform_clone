#!/bin/sh
set -e

echo "=== Running migrations ==="
node migrations/run.js

echo "=== Seeding data ==="
node seeders/dummy-data.js

echo "=== Starting app ==="
exec node index.js
