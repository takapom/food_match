Project: food_mathching
Purpose: Web app for food/restaurant matching with a Go backend (JWT auth, MySQL, GORM, simple HTTP handlers) and a Next.js frontend.
Tech stack:
- Frontend: Next.js 15, React 19, TypeScript
- Backend: Go 1.25, GORM, MySQL 8, JWT (github.com/golang-jwt/jwt/v5), godotenv
- Infra: Docker Compose (backend service + MySQL), Alpine-based images
Structure:
- root (Next.js app): `src/`, `public/`, `package.json`
- backend: Go service with `domain/`, `usecase/`, `handler/`, `infrastructure/`, `migrations/`, `config/`, `main.go`, `Dockerfile`, `docker-compose.yml`
Entrypoints:
- Frontend: `npm run dev` / `npm run build` / `npm start`
- Backend: `docker compose up` inside `backend/` (builds Go binary and runs alongside MySQL)
Notable details:
- Backend reads env via injected variables; .env is optional during container runtime.
- DB is exposed on 3306; app on 8080. DB healthcheck gates app startup.
- JWT secret must be set via `JWT_SECRET` for non-default secrets.
