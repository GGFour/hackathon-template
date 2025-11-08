# CLAUDE.md - Frontend

This file provides guidance to Claude Code (claude.ai/code) when working with the frontend code in this repository.

## Frontend Technology Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Query** - Server state management
- **TanStack Router** - File-based routing
- **Chakra UI** - Component library
- **React Hook Form** - Form handling
- **Axios** - HTTP client (via generated OpenAPI client)
- **Playwright** - End-to-end testing
- **Biome** - Linting and formatting

## Development Commands

### Setup
```bash
cd frontend

# Install Node.js version (using fnm or nvm)
fnm install && fnm use
# or: nvm install && nvm use

# Install dependencies
npm install
```

### Development
```bash
# Run dev server (hot reload)
npm run dev
# Opens at http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Lint and format
npm run lint
```

### Generate API Client
```bash
# After backend OpenAPI schema changes
# From project root:
./scripts/generate-client.sh

# Or manually:
# 1. Download http://localhost:8000/api/v1/openapi.json
# 2. Save as frontend/openapi.json
# 3. Run: npm run generate-client
```

### Testing
```bash
# Start backend for tests
docker compose up -d --wait backend

# Run Playwright tests
npx playwright test

# Run with UI mode (interactive)
npx playwright test --ui

# Cleanup after tests
docker compose down -v
```

### Linting
```bash
# Pre-commit hooks handle this automatically
npm run lint
```

## Project Structure

```
frontend/src/
├── main.tsx                 # App entry point, router setup
├── theme.tsx                # Chakra UI theme customization
├── utils.ts                 # Utility functions (error handling)
├── vite-env.d.ts            # Vite type definitions
├── routeTree.gen.ts         # Auto-generated route tree (don't edit)
├── client/                  # Auto-generated OpenAPI client (don't edit)
│   ├── index.ts             # Exports all services
│   ├── sdk.gen.ts           # API service classes
│   ├── types.gen.ts         # TypeScript types
│   ├── schemas.gen.ts       # Zod schemas
│   └── core/                # HTTP client internals
├── components/
│   ├── Common/              # Shared components
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   ├── Sidebar.tsx      # Side navigation
│   │   ├── SidebarItems.tsx # Navigation links
│   │   ├── UserMenu.tsx     # User dropdown menu
│   │   └── ...
│   ├── Admin/               # User management (superuser only)
│   │   ├── AddUser.tsx
│   │   ├── EditUser.tsx
│   │   └── DeleteUser.tsx
│   ├── Items/               # Item CRUD components
│   │   ├── AddItem.tsx
│   │   ├── EditItem.tsx
│   │   └── DeleteItem.tsx
│   ├── UserSettings/        # User profile and settings
│   │   ├── UserInformation.tsx
│   │   ├── ChangePassword.tsx
│   │   ├── DeleteAccount.tsx
│   │   └── Appearance.tsx
│   ├── Pending/             # Loading skeletons
│   └── ui/                  # Chakra UI primitives
├── hooks/
│   ├── useAuth.ts           # Authentication hook
│   └── useCustomToast.ts    # Toast notifications
├── routes/                  # File-based routing
│   ├── __root.tsx           # Root layout
│   ├── _layout.tsx          # Authenticated layout with sidebar
│   ├── _layout/
│   │   ├── index.tsx        # Dashboard (/)
│   │   ├── admin.tsx        # Admin page (/admin)
│   │   ├── items.tsx        # Items list (/items)
│   │   └── settings.tsx     # User settings (/settings)
│   ├── login.tsx            # Login page (/login)
│   ├── signup.tsx           # Sign up page (/signup)
│   ├── recover-password.tsx # Password recovery (/recover-password)
│   └── reset-password.tsx   # Password reset (/reset-password)
└── theme/
    └── button.recipe.ts     # Button variants
```

## Architecture & Key Patterns

### Routing with TanStack Router
**File-based routing:** Routes automatically registered from `src/routes/`

**Route Naming Convention:**
- `__root.tsx` - Root layout (wraps all routes)
- `_layout.tsx` - Nested layout (shared layout for multiple routes)
- `_layout/index.tsx` - Route at `/` (within _layout)
- `_layout/items.tsx` - Route at `/items` (within _layout)
- `login.tsx` - Route at `/login` (outside _layout)

**Protected Routes:**
Routes under `_layout.tsx` check authentication in `beforeLoad`:
```typescript
beforeLoad: async () => {
  if (!isLoggedIn()) {
    throw redirect({ to: "/login" })
  }
}
```

**Navigation:**
```typescript
import { useNavigate } from "@tanstack/react-router"
const navigate = useNavigate()
navigate({ to: "/items" })
```

### State Management with TanStack Query

**Server State:** TanStack Query manages all server data
**Local State:** React useState for UI state
**Auth State:** localStorage for access token, TanStack Query for user profile

**Query Keys:**
- `["currentUser"]` - Current user profile
- `["users"]` - Users list (admin)
- `["items"]` - Items list

**Pattern:**
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["items"],
  queryFn: () => ItemsService.readItems({ skip: 0, limit: 100 }),
})

const mutation = useMutation({
  mutationFn: (data) => ItemsService.createItem({ requestBody: data }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["items"] })
  },
})
```

### Authentication Hook
**File:** `src/hooks/useAuth.ts`

**Exports:**
- `useAuth()` - Hook with login/logout/signup mutations and current user
- `isLoggedIn()` - Check if token exists in localStorage

**Usage:**
```typescript
const { user, loginMutation, logout, signUpMutation } = useAuth()

// Login
loginMutation.mutate({ username: email, password })

// Logout
logout() // Clears token and redirects to /login

// Sign up
signUpMutation.mutate({ email, password, full_name })
```

**Token Storage:**
- Stored in `localStorage.getItem("access_token")`
- Automatically included in API requests by OpenAPI client
- Configured in `src/client/core/OpenAPI.ts`

### Auto-generated API Client
**Directory:** `src/client/`

**Generated from:** Backend OpenAPI schema at `/api/v1/openapi.json`

**Services:**
- `LoginService` - Authentication endpoints
- `UsersService` - User CRUD and profile
- `ItemsService` - Item CRUD
- `UtilsService` - Health check, test email

**Usage:**
```typescript
import { ItemsService, UsersService } from "@/client"

// All functions return Promises
const items = await ItemsService.readItems({ skip: 0, limit: 100 })
const user = await UsersService.readUserMe()
```

**Types:**
All TypeScript types auto-generated in `types.gen.ts`:
```typescript
import type { UserPublic, ItemCreate, ItemsPublic } from "@/client"
```

**Regenerate after backend changes:**
1. Backend schema must be updated
2. Run `./scripts/generate-client.sh`
3. Commit changes to `src/client/`

### Component Patterns

**Form Handling:**
Uses React Hook Form:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

<input {...register("email", { required: "Email is required" })} />
{errors.email && <span>{errors.email.message}</span>}
```

**Dialogs/Modals:**
Chakra UI Dialog component:
```typescript
<DialogRoot open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>Title</DialogHeader>
    <DialogBody>Content</DialogBody>
    <DialogFooter>Actions</DialogFooter>
  </DialogContent>
</DialogRoot>
```

**Toasts:**
```typescript
import { useCustomToast } from "@/hooks/useCustomToast"
const toast = useCustomToast()

toast({ title: "Success", status: "success" })
toast({ title: "Error", status: "error" })
```

**Skeletons:**
Loading states with Chakra Skeleton:
```typescript
{isLoading ? <SkeletonText /> : <Text>{data.title}</Text>}
```

### Theme & Styling
**File:** `src/theme.tsx`

- Chakra UI theme customization
- Dark mode support via `next-themes`
- Custom button recipes in `theme/button.recipe.ts`

**Dark Mode:**
```typescript
import { useColorMode } from "@/components/ui/color-mode"
const { colorMode, toggleColorMode } = useColorMode()
```

### Error Handling
**File:** `src/utils.ts`

**Helper:** `handleError(err: ApiError)`
- Shows toast with error message
- Extracts detail from API error responses

**Usage:**
```typescript
onError: (err: ApiError) => {
  handleError(err)
}
```

## Adding New Features

### Adding a New Page
1. Create file in `src/routes/` (e.g., `_layout/new-page.tsx`)
2. Export component with route definition
3. Add navigation link in `src/components/Common/SidebarItems.tsx`
4. Route auto-registers at `/new-page`

### Adding a New Component
1. Create in appropriate `src/components/` subdirectory
2. Follow existing patterns (props interface, TypeScript)
3. Use Chakra UI components
4. Export component

### Adding CRUD for New Entity
1. Ensure backend has endpoints and client is regenerated
2. Create components in `src/components/{Entity}/`
   - `Add{Entity}.tsx` - Create dialog
   - `Edit{Entity}.tsx` - Update dialog
   - `Delete{Entity}.tsx` - Delete confirmation
3. Create page in `src/routes/_layout/{entity}.tsx` with list view
4. Use TanStack Query for data fetching and mutations

### Updating After Backend Changes
1. Regenerate client: `./scripts/generate-client.sh`
2. Update TypeScript types in components
3. Update query functions to use new service methods
4. Update forms if request/response schemas changed

## Configuration

### Environment Variables
**File:** `frontend/.env` (optional)

- `VITE_API_URL` - Override API base URL (default: inferred from current host)

### Build Configuration
**File:** `vite.config.ts`

- TanStack Router plugin auto-generates route tree
- React SWC for fast compilation
- Proxy to backend in dev mode (if needed)

### OpenAPI Client Configuration
**File:** `openapi-ts.config.ts`

- Input: `openapi.json`
- Output: `src/client/`
- Client: `axios`

## Testing

### Playwright Tests
**Directory:** `frontend/tests/` (if exists)

**Pattern:**
```typescript
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('http://localhost:5173/login')
  // Test interactions
})
```

### Running Tests
1. Start backend: `docker compose up -d --wait backend`
2. Run: `npx playwright test`
3. Cleanup: `docker compose down -v`

## Important Notes

- Always regenerate API client after backend schema changes
- Don't manually edit files in `src/client/` or `src/routeTree.gen.ts`
- Use TypeScript types from generated client
- Access token stored in localStorage (not in React state)
- All API requests automatically include authentication token
- Biome handles linting/formatting (configured in `biome.json`)
