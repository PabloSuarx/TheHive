# ============================================================
# TheHive — Frontend (Astro con @astrojs/node SSR)
# Requiere en astro.config.mjs:
#   import node from "@astrojs/node";
#   output: "server",
#   adapter: node({ mode: "standalone" }),
# ============================================================

# --- Stage 1: Dependencias ---
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile

# --- Stage 2: Build ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Estas vars son necesarias en build-time para las PUBLIC_ de Astro
ARG PUBLIC_STRAPI_URL
ARG PUBLIC_SITE_URL
ENV PUBLIC_STRAPI_URL=$PUBLIC_STRAPI_URL
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL

RUN npm run build

# --- Stage 3: Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Solo copiamos el output del build (standalone mode)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
