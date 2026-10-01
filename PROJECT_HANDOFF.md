# READ THIS FIRST: Edu4Migration CMS Technical Handoff

Review date: 1 October 2026

## Purpose of this document

**Please read this document before reviewing, running, securing, or deploying the project.**

This is the primary handoff document for the Edu4Migration website and CMS. It is written for a developer, system administrator, hosting provider, or cybersecurity reviewer who has never seen the project before.

It explains:

- what the application is and how its parts communicate;
- what public visitors and administrators can do;
- how administrators, passwords, roles, tokens, content, and uploaded files are stored;
- which security controls are already implemented;
- how to run the project locally;
- what configuration is required for production;
- what was verified during the source review;
- what work still requires a hosting or security decision.

This document describes the actual implementation as of the review date, not an intended future architecture. Reviewers should compare later code changes against this document and update it when behavior changes.

## Recommended review order

A new recipient should review the project in this order:

1. Read sections 1–3 to understand the system and architecture.
2. Read sections 4–6 to understand public users, administrators, authentication, and account storage.
3. Read sections 7–11 to understand the API, database, uploads, and audit trail.
4. Read section 13 before configuring any production server.
5. Treat the remaining P0 items in section 14 as release blockers.
6. Use sections 15–17 as the verification, acceptance-test, and operational-ownership checklists.

Important: the existing GitHub Pages deployment is a static public preview. It is not the complete production system and does not provide a working backend, database, upload service, or CMS.

## 1. Executive summary

Edu4Migration is a bilingual public website with a small custom content management system (CMS).

- The public website is a React single-page application (SPA).
- The CMS is part of the same React application under `/admin`.
- The backend is an ASP.NET Core 8 Web API.
- Data is stored in Microsoft SQL Server through Entity Framework Core.
- Uploaded images and PDF documents are stored on the backend filesystem under `backend/Uploads` in development.
- Administrators authenticate with a username/account identifier and password and receive a 30-minute JWT bearer token. The backend uses the legacy property and database-column name `Email` for this identifier, but it does not require email-address formatting.
- English and Albanian content are stored side by side.

The repository builds successfully and now includes a baseline production-hardening layer. It still should **not be considered production-ready until hosting, database migration, storage, and backup decisions are completed**. The remaining work is listed in section 14.

The existing GitHub Pages workflow is only a static public preview. It does not deploy the API, database, uploads, or a working CMS.

## 2. Repository layout

```text
edu4migration/
|-- .github/workflows/       GitHub Pages preview deployment
|-- backend/                 ASP.NET Core API
|   |-- Controllers/         HTTP endpoints
|   |-- Data/                EF Core database context
|   |-- DTOs/                API request/response contracts
|   |-- Migrations/          SQL Server migration
|   |-- Models/              Database entities
|   |-- Services/            Passwords, JWTs, audit log, seed data
|   |-- Uploads/             Runtime media in the current design
|   `-- Program.cs           Service registration and startup logic
|-- frontend/                React/Vite website and CMS
|   |-- public/              Static images and static preview media
|   |-- scripts/             GitHub preview publishing helper
|   `-- src/
|       |-- components/      Shared UI components
|       |-- context/         Language selection
|       |-- data/            Navigation and offline fallback content
|       |-- pages/           Public pages, login, and CMS
|       |-- services/api.js  All browser/API communication
|       `-- styles/          Application CSS
`-- PROJECT_HANDOFF.md       This document
```

## 3. High-level architecture

```text
Public visitor or administrator
              |
              v
React/Vite SPA (frontend)
  |-- public routes
  |-- /admin/login
  `-- /admin CMS
              |
              | JSON API + JWT bearer token for protected calls
              v
ASP.NET Core 8 API (backend)
  |-- controllers and role checks
  |-- PBKDF2 password verification
  |-- audit logging
  |-- static /uploads hosting
  |
  +--> SQL Server (content, users, metadata, audit logs)
  `--> persistent filesystem/object storage (uploaded files)
```

In production, the SPA and API can be hosted under one domain or separate domains. If separate origins are used, the production frontend origin must be explicitly allowed by the backend CORS policy.

## 4. Public website behavior

Public routes include the homepage, news list/detail, partners, contact information, and project content pages such as overview, management, objectives, outcomes, documents, work packages, deliverables, milestones, events, downloads, and case studies.

Public users do not have accounts and no personal user data is stored for them by this application. Their only persistent browser setting is the selected language in `localStorage`.

The frontend reads public data from these API groups:

- `GET /api/content/homepage`
- `GET /api/content/pages/{slug}`
- `GET /api/news`
- `GET /api/news/{id}`
- `/uploads/...` for media and PDFs

Only published news is visible publicly. Drafts require an authenticated request, and scheduled news remains private until `PublishedAt <= DateTime.UtcNow`.

### Public fallback behavior

`frontend/src/services/api.js` contains built-in fallback data. Static preview builds always use it, and local development may use it when the API is unavailable. Normal production builds no longer silently replace API failures with stale fallback content; the request fails so the outage can be detected and handled visibly.

The GitHub Pages workflow sets `VITE_STATIC_PREVIEW=true`, so the deployed GitHub Pages site always uses bundled fallback content. It is not connected to the CMS database.

## 5. Administrator behavior

The CMS is available at `/admin/login` and `/admin`.

All authenticated administrators can:

- edit homepage text, statistics, focus areas, hero image, and partners;
- edit the English and Albanian versions of content pages;
- add, reorder, edit, and delete page sections;
- attach and remove PDF documents;
- create, edit, publish/unpublish, and delete news;
- upload news thumbnails and galleries;
- choose a thumbnail and reorder images;
- change their own password;
- view their current account details.

`MainAdmin` accounts can additionally:

- list administrator accounts;
- create administrators;
- change an administrator's email, password, or role;
- delete other administrators;
- see recent and paginated audit-log entries.

The backend prevents a main administrator from deleting their own account or removing their own `MainAdmin` role. It also attempts to ensure at least one `MainAdmin` remains.

The role checks are enforced by ASP.NET `[Authorize]` attributes. Hiding a menu item in React is not the security control; the API authorization is.

## 6. Authentication and account storage

Administrator records are stored in SQL Server table `AdminUsers`:

- `Id`: integer primary key;
- `Email`: the legacy database-column name for the login username/account identifier; normalized to lowercase and unique, but not validated as an email address;
- `PasswordHash`: PBKDF2 encoded value;
- `Role`: `Admin` or `MainAdmin`;
- `CreatedAt`: UTC creation time.

Passwords are salted and hashed with PBKDF2-HMAC-SHA256 using a random 16-byte salt, a 32-byte key, and 100,000 iterations. Passwords are not returned by the API.

There is legacy code that accepts a password when it exactly equals `PasswordHash`, then upgrades it to PBKDF2 after login. This exists for old development records. Production deployment should migrate any legacy plaintext records in a controlled process and then remove this compatibility path.

New passwords must contain at least eight characters, uppercase, lowercase, a number, and a special character. The server enforces this for account creation and password changes.

On successful login, the API creates a signed HMAC-SHA256 JWT containing:

- user ID (`sub` and name identifier);
- login identifier in email-named JWT claims for compatibility;
- role;
- issuer and audience;
- a 30-minute expiration.

The frontend stores the JWT and basic account display data in `localStorage`, and sends the JWT as `Authorization: Bearer <token>` on protected requests. Logout removes these browser values. There is no refresh token, server-side session, token revocation list, or forced revocation after password/role changes.

Because a token in `localStorage` is readable by JavaScript, any successful same-origin XSS could steal it. A hardened production design should prefer a `Secure`, `HttpOnly`, `SameSite` cookie with suitable CSRF protection, or explicitly document and accept the bearer-token risk while enforcing a strong Content Security Policy.

### Initial administrator

### Initial administrator provisioning

A fresh database can securely provision its first `MainAdmin` from the one-time environment variables `BootstrapAdmin__Email` and `BootstrapAdmin__Password`. `BootstrapAdmin__Email` is the existing configuration name, but its value may be a username rather than an email address. Provisioning occurs only while `AdminUsers` is empty. The bootstrap password must be at least 12 characters and include uppercase, lowercase, a number, and a special character.

After the first successful startup, remove `BootstrapAdmin__Password` from the environment/secret injection configuration. Never commit a bootstrap password. Later accounts are created by a `MainAdmin` through the CMS.

### Built-in authentication protections

- Login responses do not disclose whether a username/account identifier exists.
- Login attempts are limited per source IP to five requests per minute.
- JWT signature, issuer, audience, and expiration are validated.
- Role authorization is enforced by the backend.
- Password comparison uses fixed-time comparison for PBKDF2 hashes.

## 7. Backend request flow

For a typical protected request:

1. React reads the JWT from browser storage.
2. It sends the request to the configured API base with a bearer token.
3. ASP.NET validates the signature, issuer, audience, and expiration.
4. The endpoint checks the required role.
5. The controller reads or changes data through `AppDbContext`.
6. A mutating content/user operation normally writes an audit record.
7. The controller returns a DTO as JSON.

The API base is determined at frontend build time:

```text
VITE_API_URL=https://api.example.org/api
```

If it is omitted, the compiled frontend uses `http://localhost:5088/api`, which is unsuitable for production.

## 8. API endpoint and authorization map

| Method and route | Access | Purpose |
|---|---|---|
| `POST /api/auth/login` | Public, rate limited | Verify username/account identifier and password, then issue JWT |
| `GET /api/adminusers/me` | Admin/MainAdmin | Get current account |
| `GET /api/adminusers` | MainAdmin | List administrators |
| `POST /api/adminusers` | MainAdmin | Create administrator |
| `PUT /api/adminusers/{id}` | MainAdmin | Update email, role, or password |
| `DELETE /api/adminusers/{id}` | MainAdmin | Delete another administrator |
| `POST /api/adminusers/change-password` | Admin/MainAdmin | Change own password |
| `GET /api/audit/recent` | MainAdmin | Read latest audit entries |
| `GET /api/audit` | MainAdmin | Search/paginate audit entries |
| `GET /api/content/homepage` | Public | Read homepage |
| `PUT /api/content/homepage` | Admin/MainAdmin | Replace homepage content |
| `GET /api/content/pages/{slug}` | Public | Read a content page |
| `PUT /api/content/pages/{slug}` | Admin/MainAdmin | Create/update page and replace its sections |
| `GET /api/news` | Public; auth needed for `includeDrafts=true` | List news |
| `GET /api/news/{id}` | Public for published; auth for draft/future | Read news item |
| `POST /api/news` | Admin/MainAdmin | Create news |
| `PUT /api/news/{id}` | Admin/MainAdmin | Update news |
| `DELETE /api/news/{id}` | Admin/MainAdmin | Delete news record |
| `GET /api/media` | Admin/MainAdmin | List uploaded media metadata |
| `POST /api/media/upload` | Admin/MainAdmin | Upload image/PDF, maximum request 10 MB |
| `DELETE /api/media/{id}` | Admin/MainAdmin | Delete media record and file |
| `DELETE /api/media?url=...` | Admin/MainAdmin | Delete media by URL |
| `GET /health` | Public | Lightweight platform health probe |

## 9. Database model

The database contains:

- `AdminUsers`: administrator identity, role, and password hash;
- `AuditLogs`: administrator email, affected entity, action, name, and UTC timestamp;
- `HomepageContents`: hero fields plus JSON strings for stats, focus areas, and partners;
- `ContentPages`: one row per unique page slug;
- `ContentSections`: ordered child records, cascade-deleted with their page;
- `NewsItems`: bilingual news content, publication state/date, document URL, and gallery JSON;
- `MediaAssets`: original filename, public URL, alt text, and creation timestamp.

`ContentPage` to `ContentSection` is the principal relational content structure. Several variable lists are stored as JSON text rather than normalized related tables.

### Startup database behavior

At every backend startup, `Program.cs` currently:

1. calls `EnsureCreated()`;
2. executes custom SQL to create/add selected tables and columns;
3. backfills missing Albanian fields from English;
4. rewrites selected document URLs;
5. seeds default content if core tables are empty.

This is fragile in production. `EnsureCreated`, hand-written schema alteration, and EF migrations should not be mixed. Use reviewed EF migrations in a controlled deployment step, with a database backup and a database identity that does not need permanent schema-owner permissions.

## 10. Upload and file lifecycle

The API accepts `.jpg`, `.jpeg`, `.png`, `.webp`, and `.pdf` extensions. It stores files under the backend content root's `Uploads` directory and serves that directory publicly at `/uploads`.

News uploads are grouped in folders based on publication date and title. Document filenames are slugged; other uploaded files receive generated names. Media metadata is separately written to `MediaAssets`.

Important operational consequences:

- the production upload directory must be persistent across deployments and container restarts;
- multiple API instances cannot safely use independent local disks;
- database backups alone do not back up uploaded media;
- database/media restore points should be coordinated;
- deleting a news item triggers subsequent media deletion calls from the browser rather than an atomic server transaction;
- orphan files or broken references are possible if part of that sequence fails.

Uploads are checked against both an allowed extension list and the expected binary signature for JPEG, PNG, WebP, or PDF. Requests are limited to 10 MB, and deletion uses a separator-aware relative-path containment check to prevent escaping the upload root.

For a higher-risk deployment, add full image/PDF decoding, decompression-bomb controls, and malware scanning. Object storage is preferable for a scaled or containerized deployment.

## 11. Audit behavior

The application logs create/update/delete actions for news, page/homepage updates, administrator changes, password changes, and media uploads/deletions. Only `MainAdmin` can read the audit views. Successful and failed login attempts are also written to the structured application log without recording passwords or JWTs.

The database audit log is useful operational history, but it is not tamper-evident and is stored in the same database/control boundary as the application. For security monitoring, forward the structured authentication and administrative application logs to protected centralized storage and define retention rules.

## 12. Local development

Prerequisites:

- Node.js compatible with Vite 7;
- choose one package manager (the project declares pnpm 10.15.1 but also currently contains an npm lockfile);
- .NET 8 SDK;
- Microsoft SQL Server/SQL Express;
- a database connection string and JWT signing key.

Recommended backend secrets:

```powershell
cd backend
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=...;Database=edu4migration;..."
dotnet user-secrets set "Jwt:Key" "a-long-random-production-equivalent-development-key"
dotnet run
```

Frontend with npm:

```powershell
cd frontend
npm ci
npm run dev
```

The development frontend runs at `http://127.0.0.1:5173`; the API launch profile runs at `http://localhost:5088`.

The committed `backend/appsettings.json` contains a local SQL Express connection string. It does not contain the JWT key. Production secrets must be injected by the hosting platform and must never be committed.

## 13. Production deployment requirements

### Backend environment

Set at minimum:

```text
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=<encrypted production SQL Server connection>
Jwt__Key=<long cryptographically random secret from a secret manager>
Jwt__Issuer=Edu4Migration
Jwt__Audience=Edu4MigrationAdmin
```

Additional work is required to configure:

- the exact production CORS origin using `Cors__AllowedOrigins__0` (and subsequent indexes);
- the production hostname using `AllowedHosts`;
- the hosting platform's trusted proxy/network rules;
- persistent Data Protection key storage;
- persistent upload/object storage;
- database migration execution;
- structured logs, alerting, and retention;
- database and media backup/restore;
- production host filtering;
- server and request limits.

### Frontend environment

Build the frontend with:

```text
VITE_API_URL=https://api.example.org/api
VITE_STATIC_PREVIEW=false
```

Configure the web host/CDN to return `index.html` for SPA routes such as `/news/123` and `/admin`, while still serving actual assets normally.

### TLS and headers

The API enables forwarded-header processing, HTTPS redirection and HSTS outside development. It also emits `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a restrictive `Permissions-Policy`.

Expose the site and API only over HTTPS. The frontend host/reverse proxy must also send the relevant headers and a tested Content Security Policy, because the API cannot protect HTML served by a separate frontend host.

## 14. Deployment readiness findings

### Completed hardening in this revision

1. Added configurable CORS origins and restrictive local `AllowedHosts` defaults.
2. Added production HTTPS redirection, HSTS, forwarded-header handling, and baseline response security headers.
3. Added per-IP login rate limiting (five attempts per minute).
4. Added secure, one-time first-`MainAdmin` provisioning through environment secrets.
5. Added `/health` for hosting health probes.
6. Added upload binary-signature validation and hardened upload-root path containment.
7. Corrected future-news visibility to compare against the exact current UTC time.
8. Disabled silent fallback content when a normal production API request fails.
9. Updated npm and pnpm dependency resolutions; both advisory scans now report no known vulnerabilities.
10. Added audit records for media changes and structured success/failure logging for administrator login attempts.
11. Added `.pnpm-store/` to the repository ignore rules.

### P0: remaining release blockers

1. **No real production deployment exists.** GitHub Pages builds a static fallback snapshot only. Choose and configure hosting for the ASP.NET API, SQL Server, persistent uploads, and the production SPA.
2. **Production values must be supplied.** Set the real API URL, CORS origins, hostnames, SQL connection, JWT key, and persistent key/upload paths in the hosting environment.
3. **Database deployment is unsafe/ambiguous.** Replace startup `EnsureCreated` plus custom `ALTER TABLE` SQL with reviewed migrations and a controlled migration job. This cannot be changed safely without first inspecting and backing up the real target database.
4. **No production backup/restore plan exists.** SQL data and uploaded files must both be backed up and restore-tested.

### P1: remaining security decisions

1. Remove plaintext-password compatibility after explicitly migrating any legacy account records. Removing it blindly could lock out an existing legacy administrator.
2. Decide whether to replace `localStorage` JWTs with secure HttpOnly cookie authentication. At minimum deploy a strict frontend CSP and document the accepted model.
3. Revoke/invalidate existing sessions after password, email, or role changes. Current JWTs remain valid until their 30-minute expiration.
4. Add complete media decoding and malware scanning if required by the hosting risk profile; binary signature checks are now present.
5. Validate and limit DTO field lengths, page slugs, URLs, JSON list sizes, dates, and content size on the server.
6. Add explicit HTML sanitization on write or server-side sanitization. The public news page has a client sanitizer, but the API stores arbitrary HTML and should not rely only on one renderer.
7. Add centralized authentication/audit logging without recording passwords or JWTs.
8. Configure known proxies/networks according to the selected host so client IP rate limiting and HTTPS scheme detection trust only the correct proxy.

### P2: reliability and maintainability

1. Choose pnpm or npm and retain only the matching lockfile. Both lockfiles are currently synchronized and clean, but maintaining two creates drift risk.
2. Remove already tracked `bin/` and `obj/` files from Git's index; `.gitignore` only prevents new untracked artifacts.
3. Avoid storing the same upload collection under both backend runtime storage and frontend public preview without a documented synchronization process.
4. Add automated backend tests, frontend tests, authorization tests, upload-security tests, and end-to-end CMS tests. No test project/suite is present.
5. Add CI jobs for frontend/backend builds, tests, formatting/linting, dependency review, secret scanning, and code/security analysis. The current workflow only builds the static frontend preview.
6. Add API exception handling with consistent non-sensitive error responses and correlation IDs.
7. Add pagination to public/admin news if the collection will grow.
8. Document data retention, privacy contact, cookie/storage behavior, and accessibility testing.

## 15. Verification performed during this review

- `dotnet build backend/Edu4Migration.Api.csproj --no-restore`: passed with 0 warnings and 0 errors.
- `npm run build` in `frontend`: passed.
- NuGet vulnerable-package query: no known vulnerable packages reported by the configured NuGet source on the review date.
- npm production dependency audit after updates: 0 known vulnerabilities.
- pnpm production dependency audit after updates: no known vulnerabilities.
- Manual review covered API controllers, authorization attributes, password/JWT services, database startup, models/DTOs, upload/deletion logic, frontend authentication storage, public HTML sanitization, fallback behavior, and the GitHub deployment workflow.

This was a source review and build verification, not a penetration test. No live production infrastructure, production secrets, production database, TLS configuration, firewall, reverse proxy, cloud permissions, or backup system was available to test.

## 16. Recommended release acceptance tests

Before approval, test at least:

- anonymous users cannot call any write, media-list, user-management, or audit endpoint;
- `Admin` cannot manage users or read audit logs;
- `MainAdmin` protections cannot be bypassed with modified frontend requests;
- expired, malformed, wrong-issuer, wrong-audience, and wrong-signature JWTs are rejected;
- login throttling works and does not reveal whether a username/account identifier exists;
- password changes invalidate old sessions according to the chosen policy;
- drafts and future news cannot be retrieved anonymously;
- malicious HTML, URLs, filenames, MIME mismatches, polyglot files, and oversized uploads are rejected or safely rendered;
- upload deletion cannot escape the configured storage root;
- a failed content save does not delete still-referenced media;
- database and upload backups can be restored together;
- the SPA loads correctly on a direct deep-link refresh;
- the production frontend never calls localhost or silently uses preview content;
- English/Albanian switching and all CMS editing workflows work after dependency upgrades;
- accessibility, mobile layout, keyboard navigation, and supported browsers pass acceptance testing.

## 17. Operational ownership checklist

The receiving team should record:

- production frontend and API URLs;
- cloud/server owner and emergency contact;
- SQL Server owner and least-privilege database identity;
- secret manager location and rotation process;
- initial `MainAdmin` owner and recovery process;
- upload storage location and quota;
- backup schedule, retention, encryption, and last restore-test date;
- log/alert destinations and incident response process;
- dependency/security scanning owner;
- patching and release approval process;
- domain, TLS certificate, and renewal ownership.

Until the remaining P0 items are complete and P1 decisions are resolved or formally risk-accepted, treat the project as a hardened pre-production CMS rather than a production-ready public service.
