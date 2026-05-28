# Western Balkans Edu4Migration Platform

This repository now contains the original static mockup plus a modernized full-stack implementation.

## Structure

- `frontend/` - React + Vite public website and protected admin panel.
- `backend/` - ASP.NET Core Web API with SQLite, JWT authentication, content/news/media endpoints.
- `assets/` - original static-site assets.
- `*.html`, `styles.css`, `script.js` - original static mockup kept as reference.

## Architecture

The React frontend renders the public project site from API data where available and falls back to seeded local content while the API is offline. The admin panel is protected with JWT login and can edit homepage content, create/update/delete news, and manage image/media references through the backend.

The ASP.NET Core API uses SQLite for development and seeds:

- default admin user
- homepage content
- public content pages
- sample news

Default development admin:

- Email: `admin@edu4migration.local`
- Password: `ChangeMe123!`

Change these values and the JWT key before deployment.

## Run Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:5173`.

## Run Backend

Install the .NET 8 SDK, then:

```powershell
cd backend
dotnet restore
dotnet run
```

The frontend expects the API at `http://localhost:5088/api` by default. To override it:

```powershell
$env:VITE_API_URL="https://your-api.example.com/api"
npm.cmd run dev
```

## Main API Endpoints

- `POST /api/auth/login`
- `GET /api/content/homepage`
- `PUT /api/content/homepage` protected
- `GET /api/content/pages/{slug}`
- `PUT /api/content/pages/{slug}` protected
- `GET /api/news`
- `POST /api/news` protected
- `PUT /api/news/{id}` protected
- `DELETE /api/news/{id}` protected
- `POST /api/media/upload` protected
