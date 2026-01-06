# Todont

A somewhat silly habit-tracking application that helps you avoid doing things you shouldn't. Unlike a traditional todo list where items start unchecked and get checked off when completed, todont items start checked (meaning you're successfully avoiding them) and become unchecked when you slip up.

## Features

- Create shareable lists with unique short URLs
- Add items with optional "avoid until" dates
- Items start checked (you're doing them) and can be unchecked when you don't.
- Inline editing and deletion of items
- Persistent storage with SQLite

## Getting Started

### Prerequisites

- [.NET 9.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18 or later)

### Running the Application

1. **Start the backend API:**
   ```bash
   dotnet run --project src/Todont.Api/Todont.Api.csproj
   ```
   The API runs on http://localhost:5161

2. **Start the frontend (in a separate terminal):**
   ```bash
   cd src/Todont.Web
   npm install  # First time only
   npm run dev
   ```
   The frontend runs on http://localhost:5173

3. **Open your browser** to http://localhost:5173
