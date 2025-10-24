#!/bin/bash

set -e

echo "🚀 Setting up Worldscape development environment..."

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Please install pnpm first:"
    echo "   npm install -g pnpm"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need Docker for local development."
    echo "   Visit https://docs.docker.com/get-docker/"
fi

echo "📦 Installing dependencies..."
pnpm install

echo "📝 Setting up environment files..."

# Web app
if [ ! -f apps/web/.env.local ]; then
    cp apps/web/.env.example apps/web/.env.local
    echo "✅ Created apps/web/.env.local"
else
    echo "⏭️  apps/web/.env.local already exists"
fi

# API
if [ ! -f apps/api/.env ]; then
    cp apps/api/.env.example apps/api/.env
    echo "✅ Created apps/api/.env"
else
    echo "⏭️  apps/api/.env already exists"
fi

# Realtime
if [ ! -f apps/realtime/.env ]; then
    cp apps/realtime/.env.example apps/realtime/.env
    echo "✅ Created apps/realtime/.env"
else
    echo "⏭️  apps/realtime/.env already exists"
fi

# Media proxy
if [ ! -f services/media-proxy/.env ]; then
    cp services/media-proxy/.env.example services/media-proxy/.env
    echo "✅ Created services/media-proxy/.env"
else
    echo "⏭️  services/media-proxy/.env already exists"
fi

# World builder
if [ ! -f services/world-builder/.env ]; then
    cp services/world-builder/.env.example services/world-builder/.env
    echo "✅ Created services/world-builder/.env"
else
    echo "⏭️  services/world-builder/.env already exists"
fi

# Database package (for Prisma)
if [ ! -f packages/database/.env ]; then
    cp packages/database/.env.example packages/database/.env
    echo "✅ Created packages/database/.env"
else
    echo "⏭️  packages/database/.env already exists"
fi

echo "🐳 Starting Docker services..."
if command -v docker &> /dev/null; then
    docker-compose up -d postgres redis
    echo "⏳ Waiting for database to be ready..."
    sleep 5

    echo "🗄️  Running database migrations..."
    pnpm --filter @worldscape/database db:push

    echo "✅ Docker services started!"
else
    echo "⚠️  Skipping Docker setup (Docker not installed)"
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Review and update environment variables in .env files"
echo "  2. Run 'pnpm dev' to start all services"
echo "  3. Visit http://localhost:3000 to see the web app"
echo ""
echo "Happy coding! 🚀"
