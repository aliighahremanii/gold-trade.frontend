# syntax=docker/dockerfile:1

# Single source of truth for the Bun version used across every stage.
ARG BUN_VERSION=1.3.14

# Browser-visible values must be supplied at image build time for Next.js.
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_API_BASE_URL

# ---- Dependencies -----------------------------------------------------------
# Install dependencies in a full image (distroless has no shell, so RUN there
# is impossible). Cached as its own layer keyed on the manifests only.
FROM oven/bun:${BUN_VERSION}-slim AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- Builder ----------------------------------------------------------------
FROM oven/bun:${BUN_VERSION}-slim AS builder
WORKDIR /app
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# ---- Runner -----------------------------------------------------------------
# Distroless: no shell, no package manager, runs as the unprivileged `nonroot`
# user. We only copy the standalone server, static assets, and public files.
FROM oven/bun:${BUN_VERSION}-distroless AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# `output: "standalone"` ships its own minimal node_modules + server.js.
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/public ./public

USER nonroot
EXPOSE 3000

# Reset any inherited entrypoint so the command is deterministic: `bun server.js`.
ENTRYPOINT ["bun"]
CMD ["server.js"]
