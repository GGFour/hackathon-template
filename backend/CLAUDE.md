# CLAUDE.md - Backend

This file provides guidance to Claude Code (claude.ai/code) when working with the backend code in this repository.

## Backend Technology Stack

- **FastAPI** - Web framework
- **SQLModel** - ORM and validation (combines SQLAlchemy + Pydantic)
- **PostgreSQL** - Database (via psycopg driver)
- **Alembic** - Database migrations
- **JWT** - Authentication tokens
- **Pytest** - Testing
- **Ruff** - Linting and formatting
- **uv** - Package and environment management

## Development Commands

### Setup
```bash
cd backend

# Install dependencies
uv sync

# Activate virtual environment
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows
```

### Running Locally
```bash
# Stop Docker backend first
docker compose stop backend

# Run with auto-reload
fastapi dev app/main.py

# Or run from Docker container bash session
docker compose exec backend bash
fastapi run --reload app/main.py
```

### Testing
```bash
# Run all tests (from project root)
bash ./scripts/test.sh

# Run tests in running Docker container
docker compose exec backend bash scripts/tests-start.sh

# Run tests with pytest arguments (e.g., stop on first error)
docker compose exec backend bash scripts/tests-start.sh -x

# View test coverage
# Open: backend/htmlcov/index.html
```

### Database Migrations
```bash
# Enter backend container
docker compose exec backend bash

# Create a new migration after model changes
alembic revision --autogenerate -m "Add column last_name to User model"

# Apply migrations
alembic upgrade head

# View migration history
alembic history

# Rollback one migration
alembic downgrade -1
```

### Linting
```bash
# Pre-commit hooks handle this automatically, but you can run manually:
uv run ruff check --fix
uv run ruff format
```

## Project Structure

```
backend/app/
├── main.py                  # FastAPI app entry point
├── models.py                # SQLModel database models and Pydantic schemas
├── crud.py                  # Database CRUD operations
├── utils.py                 # Utility functions (email, password reset)
├── initial_data.py          # Create first superuser
├── backend_pre_start.py     # Wait for database
├── tests_pre_start.py       # Test database readiness
├── core/
│   ├── config.py            # Settings (reads from ../.env)
│   ├── db.py                # Database engine and session
│   └── security.py          # Password hashing, JWT tokens
├── api/
│   ├── main.py              # API router aggregator
│   ├── deps.py              # FastAPI dependencies (DB session, current user)
│   └── routes/
│       ├── login.py         # Authentication endpoints
│       ├── users.py         # User CRUD endpoints
│       ├── items.py         # Item CRUD endpoints
│       ├── utils.py         # Health check, test email
│       └── private.py       # Private health endpoint
├── alembic/
│   ├── env.py               # Alembic configuration
│   └── versions/            # Migration scripts (commit to git)
└── email-templates/
    ├── src/                 # MJML source files
    └── build/               # Compiled HTML templates
```

## Architecture & Key Patterns

### Application Entry Point
**File:** `app/main.py`
- Creates FastAPI app instance
- Includes API router from `app/api/main.py`
- Configures CORS using `settings.all_cors_origins`
- Integrates Sentry if `SENTRY_DSN` is set
- Mounts static files for email templates

### API Routes
**File:** `app/api/main.py`
- Aggregates all route modules from `api/routes/`
- All routes prefixed with `/api/v1`

**Route Files:**
- `routes/login.py` - POST `/login/access-token`, password recovery, reset
- `routes/users.py` - User CRUD, registration, profile
- `routes/items.py` - Item CRUD for authenticated users
- `routes/utils.py` - Health check, test email
- `routes/private.py` - Private health endpoint (no CORS)

### Database Models
**File:** `app/models.py`

**Pattern:** Each entity has multiple model classes:
- `{Entity}Base` - Shared properties (SQLModel)
- `{Entity}Create` - Properties for creation
- `{Entity}Update` - Properties for updates (all optional)
- `{Entity}` - Database table model (table=True)
- `{Entity}Public` - API response model
- `{Entity}sPublic` - Paginated list response

**Models:**
- `User` - Users with email, password, full_name, is_active, is_superuser
- `Item` - Items with title, description, owner_id (FK to User)

**All IDs are UUIDs** (uuid.uuid4)

**Relationships:**
- User → Items (one-to-many with cascade_delete=True)
- Item.owner_id → User.id (foreign key with CASCADE delete)

### CRUD Operations
**File:** `app/crud.py`

Provides database operations:
- `create_user()` - Hash password, create user
- `update_user()` - Update user fields, rehash password if changed
- `get_user_by_email()` - Find user by email
- `authenticate()` - Verify email/password
- Item CRUD functions

### Dependency Injection Pattern
**File:** `app/api/deps.py`

**Key Dependencies:**
- `SessionDep` = `Annotated[Session, Depends(get_db)]` - Database session
- `TokenDep` = `Annotated[str, Depends(reusable_oauth2)]` - JWT token from request
- `CurrentUser` = `Annotated[User, Depends(get_current_user)]` - Authenticated user
- `get_current_active_superuser()` - Verify superuser privileges

**Usage in Routes:**
```python
@router.get("/items")
def read_items(session: SessionDep, current_user: CurrentUser):
    # session and current_user automatically injected
    items = session.exec(select(Item).where(Item.owner_id == current_user.id)).all()
    return items
```

### Configuration
**File:** `app/core/config.py`

- `Settings` class using Pydantic BaseSettings
- Reads from `../.env` (parent directory)
- Validates required fields on startup
- Computed fields: `SQLALCHEMY_DATABASE_URI`, `all_cors_origins`, `emails_enabled`
- Warns if default secrets used in production
- Global instance: `settings = Settings()`

### Security
**File:** `app/core/security.py`

- Password hashing: `passlib` with bcrypt
- JWT token creation: `pyjwt` with HS256 algorithm
- Token expiration: 8 days (configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`)
- Token payload: `{"sub": str(user.id)}`

### Database Migrations
**Alembic Configuration:**
- Auto-imports models from `app/models.py`
- Migrations in `app/alembic/versions/`
- Prestart script (`scripts/prestart.sh`) runs `alembic upgrade head` before backend starts

**Workflow:**
1. Modify models in `app/models.py`
2. Generate migration: `alembic revision --autogenerate -m "description"`
3. Review generated migration in `alembic/versions/`
4. Apply: `alembic upgrade head`
5. Commit migration file to git

### Email Templates
**Directory:** `app/email-templates/`

- **Source:** `.mjml` files in `src/` (MJML markup)
- **Build:** `.html` files in `build/` (compiled HTML)
- Convert with VS Code MJML extension: `Ctrl+Shift+P` → "MJML: Export to HTML"
- Templates: `new_account.html`, `reset_password.html`, `test_email.html`

### Testing
**Directory:** `backend/tests/`

- Uses Pytest
- Test database created/destroyed per test
- Test user credentials in fixtures
- Coverage report: `htmlcov/index.html`

## Important Patterns

### Adding a New Endpoint
1. Define route function in appropriate `api/routes/*.py` file
2. Use dependency injection for `SessionDep`, `CurrentUser`, etc.
3. Return Pydantic models (defined in `models.py`)
4. Raise `HTTPException` for errors
5. Import route in `api/main.py` if new module

### Adding a New Model
1. Define all model classes in `models.py` (Base, Create, Update, DB table, Public)
2. Add CRUD functions in `crud.py`
3. Create Alembic migration
4. Apply migration
5. Create routes in `api/routes/`

### Using Database Sessions
- Always use `SessionDep` dependency in route functions
- Don't manually create sessions in route handlers
- Session automatically committed/rolled back by FastAPI

### Authentication
- Public routes: No dependencies
- Authenticated routes: Add `current_user: CurrentUser` parameter
- Admin routes: Add `current_user: Annotated[User, Depends(get_current_active_superuser)]` parameter

## Configuration Notes

- Settings read from `../.env` (one level above backend directory)
- In Docker: `POSTGRES_SERVER=db` (service name)
- Local dev: `POSTGRES_SERVER=localhost` (assumes local PostgreSQL)
- Virtual environment at `backend/.venv/`
- Python 3.10+ required (specified in `pyproject.toml`)

## Common Issues

- **Migrations not applying:** Ensure prestart service completed successfully in Docker
- **Import errors:** Ensure virtual environment is activated
- **Database connection errors:** Check `POSTGRES_*` env vars, ensure db service is healthy
- **Token errors:** Verify `SECRET_KEY` is set and consistent
