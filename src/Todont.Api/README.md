# Todont API

A .NET Web API backend for the Todont app - helping you track things you want to avoid doing.

## Overview

The Todont API allows users to create lists of habits they want to break or things they want to avoid. Items start as "checked" (meaning you're successfully avoiding them) and can be unchecked when you slip up. Items become "inactive" when unchecked and their "avoid until" date has passed.

## Running the API

```bash
cd src/Todont.Api
dotnet run
```

The API will start on http://localhost:5161 (or check console output for the actual port).

## API Endpoints

### Health Check
```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-12T21:30:57.913645Z",
  "service": "todont-api"
}
```

### Create a List
```bash
POST /api/lists
Content-Type: application/json

{
  "name": "My Bad Habits"
}
```

Response:
```json
{
  "id": "z88P6",
  "name": "My Bad Habits",
  "url": "/l/z88P6",
  "createdAt": "2025-11-12T21:20:26.443578Z"
}
```

### Get a List
```bash
GET /api/lists/{id}
```

Response:
```json
{
  "id": "z88P6",
  "name": "My Bad Habits",
  "items": [
    {
      "id": "5bfd9629-4bc3-48f7-8f22-3c7b3beb2b4c",
      "description": "Eat candy",
      "avoidUntil": "2025-11-20T00:00:00Z",
      "isChecked": true,
      "isActive": true,
      "createdAt": "2025-11-12T21:20:31.814463Z"
    }
  ],
  "createdAt": "2025-11-12T21:20:26.443578Z"
}
```

### Add an Item to a List
```bash
POST /api/lists/{listId}/items
Content-Type: application/json

{
  "description": "Eat candy",
  "avoidUntil": "2025-11-20T00:00:00Z"  // Optional
}
```

Response:
```json
{
  "id": "5bfd9629-4bc3-48f7-8f22-3c7b3beb2b4c",
  "description": "Eat candy",
  "avoidUntil": "2025-11-20T00:00:00Z",
  "isChecked": true,
  "isActive": true,
  "createdAt": "2025-11-12T21:20:31.814463Z"
}
```

### Update Item Status
```bash
PATCH /api/lists/{listId}/items/{itemId}
Content-Type: application/json

{
  "isChecked": false
}
```

Returns: 204 No Content on success

## Item States

- **Active**: Item is checked OR item is unchecked but avoid-until date hasn't passed yet
- **Inactive**: Item is unchecked AND (no avoid-until date OR avoid-until date has passed)

Active items should be displayed normally in the UI, while inactive items should be displayed in italics with lighter gray text.

## Tech Stack

- .NET 9.0
- ASP.NET Core Minimal APIs
- In-memory data storage (data is lost on restart)
- CORS enabled for frontend integration

## Next Steps

The backend is ready for frontend integration. The API supports:
- Creating lists with unique short IDs
- Adding items with optional avoid-until dates
- Checking/unchecking items
- Automatic active/inactive state calculation
