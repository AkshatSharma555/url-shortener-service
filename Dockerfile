# ==========================================
# STAGE 1: Build Stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Production Runner Stage
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

# Alpine par Prisma ke liye OpenSSL aur compatibility libraries install karna zaroori hai
RUN apk add --no-cache openssl libc6-compat

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/server.js"]