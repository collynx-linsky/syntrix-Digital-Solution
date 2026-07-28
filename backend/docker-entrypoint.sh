#!/bin/sh
set -e

echo "Waiting for database..."
python - <<'PYEOF'
import os, sys, time
import psycopg
from urllib.parse import urlparse

url = urlparse(os.environ.get("DATABASE_URL", ""))
for _ in range(30):
    try:
        psycopg.connect(
            host=url.hostname, port=url.port or 5432,
            user=url.username, password=url.password,
            dbname=url.path.lstrip("/"),
        ).close()
        break
    except Exception:
        time.sleep(1)
else:
    sys.exit("Database not available after 30s")
PYEOF

python manage.py migrate --noinput
python manage.py collectstatic --noinput

exec "$@"
