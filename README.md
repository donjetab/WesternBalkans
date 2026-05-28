# Western Balkans Edu4Migration Platform

Start the React project from the repository root:

```powershell
npm.cmd run dev
```

Or double-click:

```text
start-frontend.cmd
```

Then open:

```text
http://127.0.0.1:5173/
```

If Vite says `Port 5173 is in use, trying another one`, open the new URL it prints, usually `http://127.0.0.1:5174/`.

The `old/` folder is only the archived static HTML/CSS version. Do not start the new project from `old/index.html`.

## Useful Commands

```powershell
npm.cmd run build
npm.cmd run preview
```

Backend, after installing the .NET 8 SDK:

```powershell
dotnet run --project backend/Edu4Migration.Api.csproj
```

Or double-click:

```text
start-backend.cmd
```

Keep both frontend and backend terminal windows open when using the admin panel.

Default development admin:

- Email: `admin@edu4migration.local`
- Password: `ChangeMe123!`
