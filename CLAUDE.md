# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack FastAPI template with React frontend. Uses Docker Compose for orchestration, PostgreSQL for data, and includes authentication, user management, and item CRUD operations. Built for hackathons and rapid prototyping.

## Technology Stack

**Backend:** FastAPI, SQLModel, PostgreSQL, Alembic, JWT auth, Pydantic
**Frontend:** React, TypeScript, Vite, TanStack Query/Router, Chakra UI
**DevOps:** Docker Compose, Traefik, GitHub Actions, pre-commit hooks

## Development Commands

### Docker Compose Development
```bash
# Start all services with hot reload
docker compose watch

# Stop specific service
docker compose stop backend|frontend

# View logs
docker compose logs -f backend

# View logs for all services
docker compose logs
```

### Code Quality
```bash
# Install pre-commit hooks (run from project root)
uv run pre-commit install

# Run manually on all files
uv run pre-commit run --all-files
```

### Generate Frontend API Client
```bash
# After backend OpenAPI schema changes
./scripts/generate-client.sh
```

## Project Structure

```
.
├── backend/           # FastAPI backend (see backend/CLAUDE.md)
├── frontend/          # React frontend (see frontend/CLAUDE.md)
├── scripts/           # Utility scripts
├── .env               # Environment configuration (all services)
├── docker-compose.yml                 # Production Docker config
├── docker-compose.override.yml        # Development overrides
└── docker-compose.traefik.yml         # Standalone Traefik config
```

## Environment Configuration

Root `.env` file contains all configuration. Key variables:

**Required for deployment (change from defaults):**
- `SECRET_KEY` - JWT signing key (generate: `python -c "import secrets; print(secrets.token_urlsafe(32))"`)
- `FIRST_SUPERUSER_PASSWORD` - Admin password
- `POSTGRES_PASSWORD` - Database password

**Development:**
- `DOMAIN=localhost` (local) or `localhost.tiangolo.com` (to test Traefik subdomain routing)
- `FRONTEND_HOST=http://localhost:5173` (used for email links)
- `ENVIRONMENT=local|staging|production`

**Database:**
- `POSTGRES_SERVER=localhost` (local dev) or `db` (Docker Compose)
- `POSTGRES_PORT=5432`
- `POSTGRES_DB=app`
- `POSTGRES_USER=postgres`

**Email (optional):**
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAILS_FROM_EMAIL`
- Email templates in `backend/app/email-templates/`

## Docker Compose Architecture

**Services:**
- `db` - PostgreSQL with health checks
- `prestart` - Runs Alembic migrations before backend starts
- `backend` - FastAPI on port 8000
- `frontend` - Vite dev server (dev) or Nginx (production) on port 5173/80
- `adminer` - Database web UI on port 8080
- `traefik` - Reverse proxy (included in override file for local testing)

**URLs (Development):**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- Adminer: http://localhost:8080
- Traefik UI: http://localhost:8090
- MailCatcher: http://localhost:1080

**With localhost.tiangolo.com (subdomain testing):**
- Frontend: http://dashboard.localhost.tiangolo.com
- Backend: http://api.localhost.tiangolo.com

## Authentication Flow

1. User submits credentials to `/api/v1/login/access-token`
2. Backend validates, returns JWT token
3. Frontend stores token in localStorage
4. Token included in API requests via auto-generated OpenAPI client
5. Backend validates token in `get_current_user` dependency
6. Protected routes use `CurrentUser` dependency

## Common Workflows

### Adding a New Model
1. Define model in `backend/app/models.py` (table model + Pydantic schemas)
2. Add CRUD functions in `backend/app/crud.py`
3. Create routes in `backend/app/api/routes/` (import in `api/main.py`)
4. Create migration: `docker compose exec backend bash` then `alembic revision --autogenerate -m "description"`
5. Apply migration: `alembic upgrade head`
6. Regenerate frontend client: `./scripts/generate-client.sh`
7. Add frontend components/hooks using generated service

### Modifying Existing Model
1. Update model in `backend/app/models.py`
2. Create migration: `docker compose exec backend bash` then `alembic revision --autogenerate -m "description"`
3. Apply migration: `alembic upgrade head`
4. Update CRUD/routes if needed
5. Regenerate frontend client: `./scripts/generate-client.sh`
6. Update frontend components if schema changed

## Deployment

Uses GitHub Actions for CI/CD (`.github/workflows/`):
- **Staging:** Auto-deploy on push to `master` branch (requires self-hosted runner labeled `staging`)
- **Production:** Auto-deploy on release publish (requires self-hosted runner labeled `production`)

See `deployment.md` for detailed setup instructions.

## Important Notes

- Always regenerate frontend client after backend OpenAPI schema changes
- Backend reads `.env` from parent directory (`../env` relative to `backend/`)
- Database migrations must be committed to git
- Pre-commit hooks enforce code formatting (Ruff for Python, Biome for TypeScript)
- Use `uv` for Python package management (not pip/poetry)
