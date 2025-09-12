Code style and conventions

Frontend:
- TypeScript, Next.js app dir (tsconfig and eslint present). Use ESLint with `eslint-config-next`.
- Prefer functional React components, file-based routes per Next.js 15.

Backend:
- Go 1.25 modules, package layout by layers: domain, usecase, handler, infrastructure.
- GORM for ORM; prefer context-aware DB operations.
- Env configuration via environment variables; `.env` only for local dev.
- Logging with `log` package, avoid noisy warnings in containerized envs.

General:
- Keep secrets in env vars, not in repo or images.
- Docker images: multi-stage builds; final image runs as non-root `appuser`.
