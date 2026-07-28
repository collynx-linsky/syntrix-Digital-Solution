FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/ requirements/
ARG ENVIRONMENT=production
RUN pip install -r requirements/${ENVIRONMENT}.txt

COPY . .

RUN chmod +x docker-entrypoint.sh \
    && adduser --disabled-password --no-create-home syntrix \
    && mkdir -p /app/media /app/staticfiles \
    && chown -R syntrix /app/media /app/staticfiles
USER syntrix

EXPOSE 8000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3"]
