# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:22-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/prisma ./prisma
RUN npx prisma generate
COPY backend/ ./
RUN npm run build

# Stage 3: Production Runtime
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install openssl for Prisma runtime
RUN apk add --no-cache openssl

# Copy backend build and dependencies
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Copy generated Prisma engine
COPY --from=backend-builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=backend-builder /app/backend/node_modules/@prisma ./node_modules/@prisma
COPY --from=backend-builder /app/backend/prisma ./prisma
COPY --from=backend-builder /app/backend/dist ./dist

# Copy built frontend assets to be served by Fastify / Nginx
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

EXPOSE 4000

CMD ["node", "dist/server.js"]
