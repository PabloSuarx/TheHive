# ============================================================
# TheHive — Backend (Strapi v5)
# Basado en el patrón oficial recomendado a marzo 2026.
# No existe imagen oficial de Strapi — siempre build propio.
# ============================================================

# --- Stage 1: Build (instala todo + compila admin panel) ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# --- Stage 2: Runner (solo dependencias de producción) ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# dist/ contiene todo lo compilado: admin panel, config y src
# Strapi start busca config/ y src/ en el root — copiamos desde dist/
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist/config ./config
COPY --from=builder /app/dist/src ./src
COPY --from=builder /app/public ./public

# strapi start busca el admin en node_modules/@strapi/admin/dist/server/server/build/
# pero strapi build lo genera en dist/build/ — enlazamos ambos
RUN mkdir -p /app/node_modules/@strapi/admin/dist/server/server && \
    ln -s /app/dist/build /app/node_modules/@strapi/admin/dist/server/server/build

# El directorio de uploads es un volumen montado externamente
RUN mkdir -p /app/public/uploads

EXPOSE 1337
CMD ["npm", "run", "start"]
