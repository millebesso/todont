# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Todont is a habit-tracking application that helps users avoid doing things they shouldn't. Unlike a traditional todo list where items start unchecked and get checked off when completed, todont items start checked (meaning you're successfully avoiding them) and become unchecked when you slip up. Items can have an "avoid until" date and transition between active and inactive states based on their checked status and date.

The project consists of:
- **Backend**: .NET 9.0 Web API (src/Todont.Api)
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS v4 (src/Todont.Web)

## Build and Run Commands

### Building
```bash
# Build entire solution
dotnet build

# Build API only
dotnet build src/Todont.Api/Todont.Api.csproj
```

### Running the API
```bash
# From repository root
dotnet run --project src/Todont.Api/Todont.Api.csproj

# From API directory
cd src/Todont.Api
dotnet run
```

The API runs on http://localhost:5161 by default (check console output for actual port).

### Testing
```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test tests/Todont.Api.Test/Todont.Api.Test.csproj

# Run tests with verbosity
dotnet test --verbosity normal
```

### Running the Frontend
```bash
# From repository root
cd src/Todont.Web
npm install  # First time only
npm run dev

# The dev server runs on http://localhost:5173
# Vite proxy forwards /api requests to backend at http://localhost:5161
```

### Building the Frontend
```bash
cd src/Todont.Web
npm run build     # TypeScript compilation + production build
npm run preview   # Preview production build
```

### Running Full Stack
To run the full application, start both servers in separate terminals:
```bash
# Terminal 1 - Backend
dotnet run --project src/Todont.Api/Todont.Api.csproj

# Terminal 2 - Frontend
cd src/Todont.Web && npm run dev
```

## Architecture

### Core Business Logic

The application has two key domain models in `src/Todont.Api/Models/`:

- **TodontList**: Represents a collection of items. Each list gets a unique 5-character short ID (e.g., "z88P6") generated using alphanumeric characters.
- **TodontItem**: Represents a single habit to avoid. Items have:
  - `IsChecked`: boolean indicating current status (starts as `true`)
  - `AvoidUntil`: optional DateTime for when the item can be marked inactive
  - `IsActive()`: method that calculates whether item is active based on checked state and date

**Active/Inactive State Logic** (in `TodontItem.IsActive()` at src/Todont.Api/Models/TodontItem.cs:11):
- If checked: always active
- If unchecked and no `AvoidUntil` date: inactive
- If unchecked with `AvoidUntil` date: active until date passes

### Repository Pattern

The API uses a repository pattern with `ITodontRepository` interface (src/Todont.Api/Services/ITodontRepository.cs) currently implemented by `InMemoryTodontRepository` which uses `ConcurrentDictionary<string, TodontList>` for thread-safe in-memory storage. Data is lost on restart.

### API Structure

The API uses ASP.NET Core Minimal APIs pattern (src/Todont.Api/Program.cs) with:
- Dependency injection configured in the builder
- CORS enabled with `AllowAnyOrigin` for frontend integration
- OpenAPI/Swagger support in development mode
- Endpoints mapped directly in Program.cs (no controllers)

### Testing

Tests use xUnit with `WebApplicationFactory<Program>` for integration testing. The `ApiFactory` class in tests/Todont.Api.Test/UnitTest1.cs configures a test environment and test client for making HTTP requests against the API.

## Key API Endpoints

- `POST /api/lists` - Create a new list, returns short ID
- `GET /api/lists/{id}` - Get list with all items (items include computed `isActive` property)
- `POST /api/lists/{listId}/items` - Add item to list (items start checked by default)
- `PATCH /api/lists/{listId}/items/{itemId}` - Update item's checked status

## Frontend Architecture

### Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast HMR, ESM-based)
- **Styling**: Tailwind CSS v4 (uses `@import "tailwindcss"` syntax)
- **Routing**: React Router v6
- **State Management**: React Context API + custom hooks
- **HTTP Client**: Native fetch API

### Project Structure

```
src/Todont.Web/src/
├── components/       # React components
│   ├── ListCreator.tsx    # Home page for creating lists
│   ├── TodontList.tsx     # List view with items
│   ├── TodontItem.tsx     # Individual item component
│   └── NotFound.tsx       # 404 page
├── context/          # React Context providers
│   └── TodontContext.tsx  # Global state (errors, etc.)
├── hooks/            # Custom React hooks
│   └── useTodontList.ts   # List state management with optimistic updates
├── types/            # TypeScript type definitions
│   └── todont.ts          # Type aliases matching API DTOs
└── utils/            # Utility functions
    └── api.ts             # API client with fetch wrappers
```

### Key Frontend Patterns

**Type Imports**: Uses `import type` syntax for type-only imports to avoid runtime errors:
```typescript
import type { TodontList, TodontItem } from '../types/todont.js';
```

**Type Definitions**: Types are defined as `type` aliases (not `interface`) in `src/Todont.Web/src/types/todont.ts` to ensure proper ESM compatibility.

**Optimistic Updates**: The `useTodontList` hook implements optimistic UI updates for toggling items - updates UI immediately, then calls API, reverting on failure.

**Active/Inactive Styling**: Backend calculates `isActive` property. Frontend applies Tailwind classes:
- Active items: `text-gray-900 font-normal`
- Inactive items: `text-gray-400 italic font-light`

**Routing**:
- `/` - Home page with ListCreator
- `/l/:id` - View/manage specific list
- `*` - NotFound page

**API Proxy**: Vite dev server proxies `/api/*` requests to `http://localhost:5161` (configured in `vite.config.ts`)

### Tailwind CSS v4 Notes

- Uses new `@import "tailwindcss"` syntax in `src/index.css`
- Requires `@tailwindcss/postcss` plugin (not the old `tailwindcss` PostCSS plugin)
- No `tailwind.config.js` needed (removed in v4)
- PostCSS config in `postcss.config.js` uses `@tailwindcss/postcss`

## Important Implementation Details

### Backend
- List IDs are 5-character alphanumeric strings generated in `TodontList.GenerateShortId()`
- Item IDs are GUIDs generated in `TodontItem` constructor
- All timestamps use `DateTime.UtcNow`
- DTOs are in `src/Todont.Api/DTOs/` for request/response serialization
- The `Program` class is made `public partial` (src/Todont.Api/Program.cs:137) to enable integration testing with WebApplicationFactory

### Frontend
- Import paths for types must use `.js` extension for ESM compatibility (e.g., `'../types/todont.js'`)
- All type imports use `import type` syntax to avoid empty module errors
- Date inputs use HTML5 `<input type="date">` which returns ISO 8601 strings
- API client uses empty string for `API_BASE_URL` to leverage Vite proxy in development
- Components use optimistic updates for better UX - UI updates immediately before API confirmation
