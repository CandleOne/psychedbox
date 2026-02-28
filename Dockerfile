# ── Build stage ────────────────────────────────────────────────────────────────
FROM node:24-slim AS build

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Install all dependencies (including native builds)
COPY package.json pnpm-lock.yaml .npmrc* ./
COPY patches/ patches/
RUN pnpm install --frozen-lockfile

# Verify better-sqlite3 native addon was built
RUN find node_modules -name "better_sqlite3*" -o -name "*.node" 2>/dev/null | head -20 && \
    npm rebuild better-sqlite3 && \
    find node_modules -name "better_sqlite3*" -o -name "*.node" 2>/dev/null | head -20

# Copy source and build
COPY . .
RUN pnpm build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:24-slim AS production

# Install Litestream for continuous SQLite backup
ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.13/litestream-v0.3.13-linux-amd64.deb /tmp/litestream.deb
RUN dpkg -i /tmp/litestream.deb && rm /tmp/litestream.deb

WORKDIR /app

# Copy full node_modules with compiled native addons from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Copy built output from build stage
COPY --from=build /app/dist ./dist

# Copy Litestream config and entrypoint
COPY litestream.yml /etc/litestream.yml
COPY run.sh /app/run.sh
RUN chmod +x /app/run.sh

# Create data directory for SQLite (persisted via Fly volume)
RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["/app/run.sh"]
