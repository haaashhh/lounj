# Quick Start Guide

This guide will help you get Worldscape up and running quickly.

## Prerequisites

Ensure you have the following installed:

- Node.js 20 or higher
- pnpm 9 or higher
- Docker and Docker Compose (optional, for containerized development)

## Setup Steps

### 1. Run the Setup Script

The easiest way to get started is to run the automated setup script:

```bash
chmod +x setup.sh
./setup.sh
```

This script will:

- Install all dependencies with pnpm
- Copy environment example files to their proper locations
- Start Docker services (PostgreSQL and Redis)
- Run database migrations

### 2. Manual Setup (Alternative)

If you prefer manual setup or the script doesn't work:

#### Install Dependencies

```bash
pnpm install
```

#### Set Up Environment Files

```bash
# Web app
cp apps/web/.env.example apps/web/.env.local

# API
cp apps/api/.env.example apps/api/.env

# Realtime server
cp apps/realtime/.env.example apps/realtime/.env

# Media proxy
cp services/media-proxy/.env.example services/media-proxy/.env

# World builder
cp services/world-builder/.env.example services/world-builder/.env

# Database package (required for Prisma)
cp packages/database/.env.example packages/database/.env
```

#### Update Environment Variables

Edit each `.env` file and update the values as needed. The DATABASE_URL should already be set correctly:

```env
DATABASE_URL="postgresql://worldscape:worldscape@localhost:5433/worldscape"
```

> **Note**: We use port 5433 instead of 5432 to avoid conflicts with any local PostgreSQL installation.

#### Start Docker Services

```bash
docker-compose up -d postgres redis
```

Wait a few seconds for services to start, then run:

#### Generate Prisma Client and Run Migrations

```bash
pnpm --filter @worldscape/database db:push
```

### 3. Start Development

Start all services:

```bash
pnpm dev
```

Or start individual services:

```bash
# Web app only
pnpm dev --filter @worldscape/web

# API only
pnpm dev --filter @worldscape/api

# All backend services
pnpm dev --filter @worldscape/api --filter @worldscape/realtime
```

### 4. Access the Application

Once running, you can access:

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Health**: http://localhost:3001/health
- **WebSocket**: ws://localhost:3002
- **Media Proxy**: http://localhost:3003
- **World Builder**: http://localhost:3004
- **PostgreSQL**: localhost:5433
- **Redis**: localhost:6379

## Troubleshooting

### "No package found in workspace" Error

If you get errors about workspace packages not being found:

1. Ensure all package.json files are present
2. Clear pnpm cache and reinstall:
   ```bash
   pnpm store prune
   rm -rf node_modules
   pnpm install
   ```

### Database Connection Issues

If you can't connect to the database:

1. Check if PostgreSQL is running:

   ```bash
   docker-compose ps
   ```

2. Verify you're using the correct port (5433):

   ```bash
   grep DATABASE_URL packages/database/.env
   # Should show: DATABASE_URL="postgresql://worldscape:worldscape@localhost:5433/worldscape"
   ```

3. If you have a local PostgreSQL running on port 5432, that's why we use 5433 for Docker. If you want to use a different port, update:
   - `docker-compose.yml` (postgres ports section)
   - All `.env` files with DATABASE_URL

4. Restart database:

   ```bash
   docker-compose restart postgres
   ```

5. Check logs:
   ```bash
   docker-compose logs postgres
   ```

### Port Already in Use

If you get "port already in use" errors:

1. Find what's using the port:

   ```bash
   lsof -i :3000  # or whatever port
   ```

2. Kill the process or change the port in the respective `.env` file

### Build Errors

If you encounter build errors:

1. Clean all builds:

   ```bash
   pnpm clean
   ```

2. Reinstall dependencies:

   ```bash
   rm -rf node_modules
   pnpm install
   ```

3. Rebuild:
   ```bash
   pnpm build
   ```

### Prisma Issues

If you have Prisma-related errors:

1. Regenerate Prisma client:

   ```bash
   pnpm --filter @worldscape/database db:generate
   ```

2. Reset database (⚠️ WARNING: This will delete all data):
   ```bash
   docker-compose down -v
   docker-compose up -d postgres
   pnpm --filter @worldscape/database db:push
   ```

## Development Workflow

### Making Changes

1. Create a feature branch
2. Make your changes
3. Run linting and type-checking:
   ```bash
   pnpm lint
   pnpm type-check
   ```
4. Format code:
   ```bash
   pnpm format
   ```
5. Commit your changes (pre-commit hooks will run automatically)

### Adding a New Package

1. Create the package directory structure
2. Add `package.json` with `@worldscape/package-name`
3. Add appropriate scripts (build, dev, lint, type-check)
4. Run `pnpm install` from the root

### Database Changes

1. Update `packages/database/prisma/schema.prisma`
2. Create migration:
   ```bash
   pnpm --filter @worldscape/database db:migrate
   ```
3. The migration will be automatically applied

## Useful Commands

```bash
# Development
pnpm dev                                    # Start all services
pnpm dev --filter @worldscape/web          # Start specific package

# Building
pnpm build                                  # Build all packages
pnpm build --filter @worldscape/api        # Build specific package

# Code Quality
pnpm lint                                   # Lint all packages
pnpm format                                 # Format all code
pnpm format:check                           # Check formatting
pnpm type-check                             # Type check all packages

# Database
pnpm --filter @worldscape/database db:generate   # Generate Prisma client
pnpm --filter @worldscape/database db:push       # Push schema changes
pnpm --filter @worldscape/database db:migrate    # Create migration
pnpm --filter @worldscape/database db:studio     # Open Prisma Studio

# Docker
docker-compose up                           # Start all services
docker-compose up -d                        # Start in background
docker-compose down                         # Stop all services
docker-compose logs -f [service]            # View logs
docker-compose restart [service]            # Restart service

# Cleaning
pnpm clean                                  # Clean all packages
rm -rf node_modules && pnpm install        # Fresh install
```

## Next Steps

- Read the [README.md](README.md) for detailed information
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Explore the codebase starting with `apps/web/src/app/page.tsx`

## Getting Help

If you encounter issues:

1. Check this troubleshooting guide
2. Search existing issues on GitHub
3. Ask in discussions
4. Open a new issue with detailed information

Happy coding! 🚀
