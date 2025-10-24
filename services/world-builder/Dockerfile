FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.1 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY turbo.json ./
COPY services/world-builder/package.json ./services/world-builder/
COPY packages/*/package.json ./packages/
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm turbo build --filter=@worldscape/world-builder

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/services/world-builder/dist ./services/world-builder/dist
COPY --from=builder /app/services/world-builder/package.json ./services/world-builder/
COPY --from=deps /app/node_modules ./node_modules
WORKDIR /app/services/world-builder
EXPOSE 3004
CMD ["pnpm", "start"]
