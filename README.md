# Worldscape

A modern monorepo for creating and exploring immersive worlds.

## Project Structure

```
worldscape/
├── apps/
│   ├── web/                 # Next.js frontend
│   ├── api/                 # Backend API service
│   └── realtime/            # WebSocket server
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── database/            # Prisma schemas
│   ├── config/              # Shared configs
│   └── types/               # TypeScript definitions
├── services/
│   ├── media-proxy/         # Media API gateway
│   └── world-builder/       # World creation service
└── design/
    ├── figma/               # Design files
    ├── assets/              # Raw assets
    └── worlds/              # Pre-built world templates
```

## Tech Stack

- **Framework**: [Turborepo](https://turbo.build/repo)
- **Frontend**: [Next.js 14](https://nextjs.org/) with App Router
- **Backend**: [Fastify](https://www.fastify.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma](https://www.prisma.io/)
- **Real-time**: WebSocket server
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Language**: TypeScript with strict mode
- **Linting**: ESLint + Prettier
- **Validation**: Zod
- **CI/CD**: GitHub Actions
- **Containerization**: Docker & Docker Compose

## Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm 9 or higher
- Docker and Docker Compose (for local development)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd worldscape
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
# Copy example env files
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env
cp apps/realtime/.env.example apps/realtime/.env
cp services/media-proxy/.env.example services/media-proxy/.env
cp services/world-builder/.env.example services/world-builder/.env
cp packages/database/.env.example packages/database/.env
```

4. Start the database:

```bash
docker-compose up postgres redis -d
```

> **Note**: PostgreSQL runs on port **5433** (not the default 5432) to avoid conflicts with any local PostgreSQL installation you might have.

5. Run database migrations:

```bash
pnpm --filter @worldscape/database db:push
```

> **Note**: Use `db:push` for development to quickly sync your schema. Use `db:migrate` for production to create proper migration files.

### Development

Start all services in development mode:

```bash
pnpm dev
```

Or start individual services:

```bash
# Start web app
pnpm dev --filter @worldscape/web

# Start API
pnpm dev --filter @worldscape/api

# Start realtime server
pnpm dev --filter @worldscape/realtime
```

### Using Docker Compose

Start all services with Docker:

```bash
docker-compose up
```

Services will be available at:

- Web: http://localhost:3000
- API: http://localhost:3001
- WebSocket: ws://localhost:3002
- Media Proxy: http://localhost:3003
- World Builder: http://localhost:3004
- PostgreSQL: localhost:5433
- Redis: localhost:6379

## Available Scripts

- `pnpm dev` - Start development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Lint all packages
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm type-check` - Run TypeScript type checking
- `pnpm test` - Run tests
- `pnpm clean` - Clean build artifacts and node_modules

## Database

The project uses Prisma for database management:

```bash
# Generate Prisma client
pnpm --filter @worldscape/database db:generate

# Push schema changes to database
pnpm --filter @worldscape/database db:push

# Create a migration
pnpm --filter @worldscape/database db:migrate

# Open Prisma Studio
pnpm --filter @worldscape/database db:studio
```

## Git Hooks

This project uses Husky for Git hooks:

- **pre-commit**: Runs lint-staged to lint and format staged files

## CI/CD

GitHub Actions workflows are configured for:

- **CI**: Runs on PRs and pushes to main/develop
  - Linting
  - Type checking
  - Format checking
  - Building
  - Testing

- **CD**: Runs on pushes to main
  - Builds Docker images
  - Pushes to GitHub Container Registry
  - Deploys to production (configure deployment script)

## Environment Variables

See `.env.example` files in each app/service for required environment variables.

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests and linting
4. Create a pull request

## License

[Add your license here]
