Docker compose for Go backend + MySQL
=====================================

Commands
--------
- Build and start in background: `docker compose up -d`
- View logs: `docker compose logs -f`
- Stop: `docker compose down`
- Reset MySQL data (DANGEROUS): `docker compose down -v`

What gets created
-----------------
- Service `db` (MySQL 8.0): exposed on `localhost:3306`
- Service `app` (Go): exposed on `localhost:8080`
- Named volume `mysql_data` for persistent DB storage

Environment
-----------
- Variables live in `backend/.env`. Defaults are safe for local dev.
- App reads `PORT`, `JWT_SECRET`, and DB_* variables.

Health
------
- `db` has a healthcheck; the `app` waits until MySQL is healthy.

Notes
-----
- Add SQL files under `backend/mysql/init` to seed data. They run once at first DB init.
- If the app binary needs different ports, update `PORT` and the compose mapping.

