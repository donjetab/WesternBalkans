# Temporary GitHub Pages preview

The snapshot in `src/data/fallbackData.js` contains 13 content pages, 10 published articles, both languages and partners. Its media is in `public/uploads/` (47 files). Admin accounts and credentials are not exported.

The workflow at `../.github/workflows/deploy.yml` deploys pushes to `main` and supports manual runs. Select **Settings > Pages > Source > GitHub Actions**. URL: https://donjetab.github.io/WesternBalkans/

The workflow uses Node 24, pnpm 10.15.1, `pnpm install --frozen-lockfile` and `pnpm build`. It sets `VITE_STATIC_PREVIEW=true` to use the snapshot without localhost. Vite uses `/WesternBalkans/` as its base. Hash routing supports shared links and refreshes, such as `/WesternBalkans/#/news`. Generated `dist/` is ignored and uploaded as a workflow artifact.

To build locally in PowerShell, run from `frontend/` with pnpm installed:

```powershell
pnpm install --frozen-lockfile
$env:VITE_STATIC_PREVIEW = "true"
pnpm build
pnpm preview
```

Normal development uses the API with fallback for failed public reads. Admin authentication and writes require the backend. The legacy `deploy:github` script publishes a branch manually; Actions does not use it or require `.env.github`.

When the backend is hosted, remove fallback code from `src/services/api.js`, delete `src/data/fallbackData.js` and copied `public/uploads/`, remove `VITE_STATIC_PREVIEW` from the workflow and local preview environment files, and configure `VITE_API_URL`. Keep the repository base and hash routing for GitHub Pages.
