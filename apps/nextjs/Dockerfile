# Stage 1: Builder
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.6.3 --activate

WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./

# Copy all package.json files for dependency resolution
COPY apps/nextjs/package.json apps/nextjs/
COPY apps/auth-proxy/package.json apps/auth-proxy/
COPY packages/api/package.json packages/api/
COPY packages/auth/package.json packages/auth/
COPY packages/db/package.json packages/db/
COPY packages/ui/package.json packages/ui/
COPY packages/validators/package.json packages/validators/
COPY tooling/eslint/package.json tooling/eslint/
COPY tooling/prettier/package.json tooling/prettier/
COPY tooling/tailwind/package.json tooling/tailwind/
COPY tooling/typescript/package.json tooling/typescript/
COPY tooling/github/package.json tooling/github/

# Install dependencies (with frozen lockfile for reproducibility)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY turbo.json tsconfig.json ./
COPY apps/nextjs/ apps/nextjs/
COPY packages/ packages/
COPY tooling/ tooling/

# Build
RUN pnpm turbo build --filter=@matchfaca/nextjs...

# Stage 2: Runner
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10.6.3 --activate

# Create non-root user
RUN addgroup -g 1001 -S matchfaca && \
    adduser -u 1001 -S matchfaca -G matchfaca

WORKDIR /app

# Copy standalone build output
COPY --from=builder --chown=matchfaca:matchfaca /app/apps/nextjs/.next/standalone ./
COPY --from=builder --chown=matchfaca:matchfaca /app/apps/nextjs/.next/static ./apps/nextjs/.next/static
COPY --from=builder --chown=matchfaca:matchfaca /app/apps/nextjs/public ./apps/nextjs/public

# Switch to non-root user
USER matchfaca

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "apps/nextjs/server.js"]
