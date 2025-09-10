# Krist Monorepo

A personal monorepo built with Turborepo containing multiple applications and packages.

## Getting Started

After cloning this repository, run:

```sh
bun install
npm run submodules:init  # Initialize submodules
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `colin`: an [Astro](https://astro.build/) personal website
- `nos`: a [React Router](https://reactrouter.com/) web application with Cloudflare integration
- `turbo-cache-on-cloudflare`: a submodule containing Turborepo remote cache for Cloudflare Workers
- `@repo/ui`: a shared React component library
- `@repo/eslint-config`: ESLint configurations
- `@repo/typescript-config`: TypeScript configurations used throughout the monorepo

## Submodule Management

This repository contains submodules that need to be initialized and updated. Use these commands:

### NPM Scripts (Recommended)

```sh
# Initialize submodules (for fresh clones)
npm run submodules:init

# Update submodules to latest commits
npm run submodules:update

# Check status of all submodules
npm run submodules:status

# Sync submodule URLs from .gitmodules
npm run submodules:sync
```

### Direct Shell Script Usage

```sh
# All commands available through the shell script
./scripts/submodules.sh help

# Examples:
./scripts/submodules.sh init     # Initialize submodules
./scripts/submodules.sh update   # Update to latest
./scripts/submodules.sh status   # Show status
```

### For New Team Members

When you first clone this repository:

1. Clone the repo: `git clone <repo-url>`
2. Install dependencies: `bun install`
3. Initialize submodules: `npm run submodules:init` (this happens automatically via postinstall)

### Keeping Submodules Updated

To pull the latest changes from all submodules:

```sh
npm run submodules:update
```

**Note**: This updates submodules to their latest commits. If you want to pin specific versions, commit the submodule changes after updating.

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
