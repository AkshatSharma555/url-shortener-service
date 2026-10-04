# ==========================================
# STAGE 1: Build Stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Dependencies install karne ke liye package files copy karo
COPY package*.json tsconfig.json ./
COPY prisma ./prisma/

# Clean install dependencies
RUN npm ci

# Source code copy karke production build (TypeScript -> JavaScript) compile karo
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Production Runner Stage
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Sirf production dependencies install karo taaki image lightweight rahe
COPY package*.json ./
RUN npm ci --only=production

# Builder stage se compiled dist folder aur prisma schema uthao
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Production container ke andar Prisma Client generate karo
RUN npx prisma generate

# Port expose karo
EXPOSE 3000

# Application start command
CMD ["node", "dist/server.js"]