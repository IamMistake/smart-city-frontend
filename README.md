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

```bash
cp .env.example .env
```

3. Start development server:

```bash
bun run dev
```

## Scripts

- `bun run dev` - start local dev server
- `bun run build` - type-check build pipeline and create production build
- `bun run lint` - run eslint with zero warnings allowed
- `bun run format` - format source files with prettier
- `bun run preview` - run production preview on port 5000
- `bun run typecheck` - run TypeScript type checks
- `bun run check` - lint + typecheck

## Environment variables

- `VITE_SPRING_API_BASE_URL` - Spring Boot base URL (default `http://localhost:8080`)
- `VITE_FASTAPI_API_BASE_URL` - FastAPI base URL (default `http://localhost:8000`)

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
- Request interceptor attaches bearer token from local storage
- `src/services/api/healthService.ts` includes per-service and aggregate microservice health checks for `/api/health/`
