# Stage 1: Builder
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.6.3 --activate

WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./

# Copy package.json files
COPY apps/auth-proxy/package.json apps/auth-proxy/
COPY tooling/eslint/package.json tooling/eslint/
COPY tooling/prettier/package.json tooling/prettier/
COPY tooling/typescript/package.json tooling/typescript/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY turbo.json tsconfig.json ./
COPY apps/auth-proxy/ apps/auth-proxy/
COPY tooling/ tooling/

# Build
RUN pnpm turbo build --filter=@matchfaca/auth-proxy...

# Stage 2: Runner
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@10.6.3 --activate

# Create non-root user
RUN addgroup -g 1001 -S matchfaca && \
    adduser -u 1001 -S matchfaca -G matchfaca

WORKDIR /app

# Copy build output
COPY --from=builder --chown=matchfaca:matchfaca /app/apps/auth-proxy/.output ./.output

USER matchfaca

EXPOSE 3001

ENV PORT=3001
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", ".output/server/index.mjs"]
