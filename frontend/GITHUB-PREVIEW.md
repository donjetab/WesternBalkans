# Temporary GitHub Pages preview

The public content snapshot is in `src/data/fallbackData.js`: 13 content pages, 10 published news articles, both languages, and the homepage/partners. Referenced media is copied into `public/uploads/` (47 files, about 10.8 MB). No admin accounts, tokens, or credentials are exported.

Build with `npm run build:github`. This uses `.env.github` to read the snapshot without contacting localhost, `/WesternBalkans/` as the base path, and hash routing so shared article links work on GitHub Pages.

After publication is approved, run `npm run deploy:github`. The repository must have GitHub Pages enabled for the `gh-pages` branch, root directory. Expected URL: https://donjetab.github.io/WesternBalkans/

The normal development build uses the API and falls back to the snapshot when public reads fail. Admin authentication and writes still require the backend.

When a hosted backend is ready, remove the fallback import/functions from `src/services/api.js`, delete `src/data/fallbackData.js` and the copied `public/uploads/` directory, and stop building in github mode. Configure `VITE_API_URL` with the hosted API address and choose routing appropriate for the hosting provider.
