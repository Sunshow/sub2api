#!/bin/sh
set -e

# Default backend URL if not provided
BACKEND_URL=${BACKEND_URL:-http://localhost:8080}

echo "==================================="
echo "Sub2API Frontend Container Starting"
echo "==================================="
echo "Backend URL: ${BACKEND_URL}"
echo "==================================="

# Substitute environment variables in nginx config
envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Test nginx configuration
nginx -t

# Start nginx in foreground
exec nginx -g 'daemon off;'
