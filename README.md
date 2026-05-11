# Smart City Frontend

Frontend application for the Smart City Monitoring Platform.

## Stack

- React 19
- Vite 8
- TypeScript 5
- Chakra UI v3
- React Router
- Axios
- Bun

## Getting started

1. Install dependencies:

```bash
bun install
```

2. Create environment file:

```powershell
# PowerShell (Windows)
Copy-Item .env.example .env

# Command Prompt (Windows)
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

3. Start development server:

```bash
bun run dev
```

## Docker

The repo includes a full-stack Docker Compose setup at the repository root.

Before building the stack:

1. Ensure `smart-city-frontend/.env` contains the browser-facing API URLs.
2. Ensure `smart-city-backend/.env` contains backend runtime secrets and service env vars.

Start the full stack from the repo root:

```bash
docker compose up --build
```

Published ports:

- Frontend: `http://localhost:3000`
- Spring service: `http://localhost:8080`
- FastAPI service: `http://localhost:8000`
- Postgres: `localhost:5432`

Notes:

- The frontend image reads `smart-city-frontend/.env` during the Vite build.
- The backend services read `smart-city-backend/.env` through Compose `env_file`.
- The FastAPI container runs `alembic upgrade head` before starting `uvicorn`.

`bun` commands in this README work on Windows, macOS, and Linux.

## Scripts

- `bun run dev` - start local dev server
- `bun run build` - type-check build pipeline and create production build
- `bun run lint` - run eslint with zero warnings allowed
- `bun run test` - run the Vitest test suite
- `bun run format` - format source files with prettier
- `bun run preview` - run production preview on port 5000
- `bun run typecheck` - run TypeScript type checks
- `bun run check` - lint + typecheck

## CI

- GitHub Actions runs on every `push` and `pull_request`.
- The workflow runs `bun run lint`, `bun run test`, and `bun run build`.
- The exact required status check name is `Frontend CI / frontend-quality`.
- GitHub branch protection or rulesets must be configured manually in repository settings if you want that required check to block merges.
- This repository only defines the workflow; it does not enforce merge blocking until the GitHub rule is turned on.

## Environment variables

- `VITE_SPRING_API_BASE_URL` - Spring Boot base URL (default `http://localhost:8080`)
- `VITE_FASTAPI_API_BASE_URL` - FastAPI base URL (default `http://localhost:8000`)
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for the React app
- `VITE_CLERK_JWT_TEMPLATE` - optional Clerk JWT template name used when requesting backend tokens

## Routing

- `/`
- `/map`
- `/emergencies`
- `/pollution`
- `/chatbot`
- `/auth/login`
- `/auth/register`

## Architecture (hybrid)

```text
src/
  app/         # app shell, router, top-level providers
  components/  # reusable UI and view components
  constants/   # route constants and app constants
  context/     # global context providers (light app-level state)
  hooks/       # reusable hooks
  models/      # domain models
  pages/       # route pages
  services/    # axios http client + API services
  styles/      # reusable style objects
  theme/       # chakra theme system/tokens
  types/       # shared TypeScript types
  utils/       # pure helper functions
```

## Theme

- Supports light/dark mode toggle (top-right button)
- Uses custom dark-green accent palette via Chakra system config
- Uses white/black centered visual base with semantic tokens

## API setup

- `src/services/http/createHttpClient.ts` configures shared axios behavior
- `src/services/http/springClient.ts` and `src/services/http/fastapiClient.ts` target each microservice
- Request interceptor attaches Clerk bearer token from `ClerkAuthBridge`
- `src/app/providers/CurrentUserSync.tsx` calls Spring `/api/auth/me` after login to provision/sync the local backend user
- `src/services/api/healthService.ts` includes per-service and aggregate microservice health checks for `/api/health/`
- `src/services/api/chatbotService.ts` sends chat requests to FastAPI `/api/chatbot/*`
- Landing page backend cards include a `Test Auth Endpoint` button for `/api/auth/me` on each service
