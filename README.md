# Smart City Frontend

Frontend for the Smart City Monitoring Platform — a real-time dashboard for tracking city emergencies, air pollution, and municipal incidents.

Built with **React 19**, **Vite 8**, **Chakra UI v3**, and **Clerk authentication**, communicating with dual microservice backends (Spring Boot + FastAPI).

## Getting started

```bash
bun install
cp .env.example .env
bun run dev
```

## Tech stack

| | |
|---|---|
| **Framework** | React 19, Vite 8, TypeScript 5 |
| **UI** | Chakra UI v3 |
| **Auth** | Clerk |
| **HTTP** | Axios |
| **Runtime** | Bun |

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start local dev server |
| `bun run build` | Type-check and build |
| `bun run lint` | ESLint (zero warnings) |
| `bun run format` | Format with Prettier |
| `bun run preview` | Preview production build |
| `bun run typecheck` | TypeScript checks |
| `bun run check` | Lint + typecheck |

## Environment

| Variable | Default | Description |
|---|---|---|
| `VITE_SPRING_API_BASE_URL` | `http://localhost:8080` | Spring Boot base URL |
| `VITE_FASTAPI_API_BASE_URL` | `http://localhost:8000` | FastAPI base URL |

## Routes

| Path | Page |
|---|---|
| `/` | Landing |
| `/map` | Emergency map |
| `/emergencies` | Incident list |
| `/pollution` | Air quality |
| `/chatbot` | City assistant |
| `/auth/login` | Sign in |
| `/auth/register` | Sign up |

## Features

- **Live emergency map** with incident markers
- **Air pollution monitoring** — real-time and historical data
- **City chatbot** — natural language queries
- **Dual auth** — Clerk with Spring Boot + FastAPI backends
- **Dark/light mode** with custom accent palette

## Project structure

```text
src/
  app/        # Shell, router, providers
  components/ # Reusable UI components
  constants/  # Route constants
  context/   # Global state
  hooks/    # Custom hooks
  models/   # Domain models
  pages/   # Route pages
  services/ # Axios clients + API wrappers
  styles/  # Style objects
  theme/  # Chakra theme system
  types/ # Shared TypeScript types
  utils/ # Helper functions
```

## API setup

- Two axios clients in `src/services/http/` targeting each microservice
- Bearer token attached via request interceptor
- Health checks at `/api/health/` (per-service + aggregate)
