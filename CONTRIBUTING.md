# Contributing to Worldscape

Thank you for your interest in contributing to Worldscape! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `pnpm install`
3. Copy environment files and configure them
4. Start the development environment: `pnpm dev`

## Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** in strict mode

Code style is enforced via pre-commit hooks using Husky and lint-staged.

### Running Linters

```bash
# Lint all packages
pnpm lint

# Format all files
pnpm format

# Check formatting
pnpm format:check

# Type check
pnpm type-check
```

## Commit Messages

We follow conventional commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build process or auxiliary tool changes

Example:

```
feat(api): add world creation endpoint
fix(web): resolve navigation issue on mobile
docs: update installation instructions
```

## Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Ensure all tests pass: `pnpm test`
4. Ensure linting passes: `pnpm lint`
5. Ensure type checking passes: `pnpm type-check`
6. Push your branch and create a Pull Request
7. Wait for review and address any feedback

## Project Structure

- `apps/` - Main applications (web, api, realtime)
- `packages/` - Shared packages (ui, database, types, config)
- `services/` - Microservices (media-proxy, world-builder)
- `design/` - Design files and assets

## Adding a New Package

1. Create a new directory in the appropriate folder (`apps/`, `packages/`, or `services/`)
2. Add a `package.json` with the naming convention `@worldscape/package-name`
3. Set up TypeScript configuration extending from `@worldscape/typescript-config`
4. Set up ESLint configuration extending from `@worldscape/eslint-config`
5. Add appropriate scripts (dev, build, lint, type-check)

## Testing

```bash
# Run all tests
pnpm test

# Run tests for a specific package
pnpm test --filter @worldscape/api
```

## Database Changes

When making database changes:

1. Update the Prisma schema in `packages/database/prisma/schema.prisma`
2. Create a migration: `pnpm --filter @worldscape/database db:migrate`
3. Test the migration on a local database
4. Include the migration in your PR

## Questions?

If you have questions, please:

- Open an issue for bugs or feature requests
- Start a discussion for general questions
- Reach out to the maintainers

Thank you for contributing!
