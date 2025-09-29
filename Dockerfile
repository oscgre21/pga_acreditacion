# Dockerfile para PGA - Portal de Gestión Aeroportuaria
# Multi-stage build for optimization

# =====================================
# Dependencies Stage
# =====================================
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# =====================================
# Builder Stage
# =====================================
FROM node:18-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Copy environment files (if they exist)
COPY .env* ./

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN pnpm build

# Remove development dependencies to reduce size
RUN pnpm prune --prod

# =====================================
# Runner Stage
# =====================================
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install pnpm
RUN npm install -g pnpm

# Copy built application from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy necessary files for runtime
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/healthcheck.js ./healthcheck.js

# Copy node_modules with Prisma client (if exists)
COPY --from=builder /app/node_modules ./node_modules

# Set correct permissions
USER nextjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
#HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#  CMD node healthcheck.js || exit 1

# Start the application
CMD ["node", "server.js"]