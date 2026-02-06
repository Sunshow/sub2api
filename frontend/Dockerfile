# =============================================================================
# Sub2API Frontend Dockerfile (Standalone)
# =============================================================================
# Multi-stage build for optimized production image
# Stage 1: Build frontend with Node.js
# Stage 2: Serve with Nginx
# =============================================================================

ARG NODE_IMAGE=node:24-alpine
ARG NGINX_IMAGE=nginx:alpine

# -----------------------------------------------------------------------------
# Stage 1: Frontend Builder
# -----------------------------------------------------------------------------
FROM ${NODE_IMAGE} AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Create backend directory structure for vite build output
RUN mkdir -p ../backend/internal/web

# Build frontend (outputs to ../backend/internal/web/dist per vite.config.ts)
RUN pnpm run build

# -----------------------------------------------------------------------------
# Stage 2: Nginx Runtime
# -----------------------------------------------------------------------------
FROM ${NGINX_IMAGE}

# Labels
LABEL maintainer="Wei-Shaw <github.com/Wei-Shaw>"
LABEL description="Sub2API Frontend - Standalone Nginx Image"

# Install envsubst for environment variable substitution
RUN apk add --no-cache gettext

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx configuration template
COPY nginx.conf /etc/nginx/nginx.conf.template

# Copy built frontend from builder stage (from vite's configured outDir)
COPY --from=builder /backend/internal/web/dist /usr/share/nginx/html

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
