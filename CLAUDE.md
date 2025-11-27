# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Todont is a habit-tracking application that helps users avoid doing things they shouldn't. Unlike a traditional todo list where items start unchecked and get checked off when completed, todont items start checked (meaning you're successfully avoiding them) and become unchecked when you slip up. Items can have an "avoid until" date and transition between active and inactive states based on their checked status and date.

The project consists of a .NET 9.0 Web API backend (currently in development) with plans for a React frontend.

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

## Important Implementation Details

- List IDs are 5-character alphanumeric strings generated in `TodontList.GenerateShortId()`
- Item IDs are GUIDs generated in `TodontItem` constructor
- All timestamps use `DateTime.UtcNow`
- DTOs are in `src/Todont.Api/DTOs/` for request/response serialization
- The `Program` class is made `public partial` (src/Todont.Api/Program.cs:137) to enable integration testing with WebApplicationFactory
