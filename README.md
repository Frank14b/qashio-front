# Qashio Frontend

Next.js web app for the Qashio expense tracker. It covers wallets, income and expenses, categories, budgets and notifications, on top of the NestJS API in `../qashio-api`.

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 15 (App Router), React, TypeScript |
| UI | MUI 7 (DataGrid in server mode, Date Pickers, Dialogs) |
| Server state | TanStack React Query |
| Client state | Zustand (auth session, list filters) |
| Forms | React Hook Form + Zod |
| HTTP | Axios client with timeout, cancellation, `X-Request-Id`, token refresh |
| Money / dates | `Intl.NumberFormat` (currency minor units), `Intl.RelativeTimeFormat` |
| Monitoring | `@sentry/nextjs` (off by default) |
| Quality | Jest, ESLint, Prettier, Husky + lint-staged |

---

## Project structure

```text
app/
  (auth)/auth/               # login, register, verify-email, forgot / reset password
  (dashboard)/               # authenticated area (AppShell + nav + notifications bell)
    dashboard/  accounts/  transactions/  budgets/  categories/  notifications/  change-password/
      components/  forms/  hooks/  services/  stores/  types.ts   # each feature owns its parts
  components/
    ui/                      # shared Input, Select, Button, FormPage (centered card), ContentCard
    forms/                   # RHF field bindings + useZodForm
    AppShell.tsx  NavBar.tsx
  hooks/  stores/            # auth session + mutations
  global-error.tsx           # root error boundary (reports to Sentry)
lib/
  api/http-client.ts         # Axios instance, ApiError, refresh + retry
  auth/                      # cookie session helpers, protected route list
  env.ts                     # zod-validated NEXT_PUBLIC_* variables
  format/money.ts            # Intl currency formatting
  sentry/config.ts
middleware.ts                # redirects between auth pages and the dashboard
instrumentation*.ts          # Sentry (browser + server)
```

**Rule of thumb:** each feature owns its schema, types, services, hooks and views. Only `app/components/ui`, `app/components/forms` and `lib/` are shared.

---

## Setup

### Prerequisites

- Node.js 22
- The API running (default `http://localhost:3000`)

### Environment

Copy `.env.example` to `.env.local` (`cp .env.example .env.local`); the defaults work for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

# Sentry (off by default; enabling requires the DSN)
NEXT_PUBLIC_SENTRY_ENABLED=false
# NEXT_PUBLIC_SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project>
# NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
# NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0
```

`lib/env.ts` validates these with zod: http(s) URLs, and the DSN is required when Sentry is on. An invalid value fails `next build` or the dev server and lists every problem. `NEXT_PUBLIC_*` values are inlined at build time, so rebuild after changing them.

### Local

```bash
npm install
npm run dev
```

App: [http://localhost:3001](http://localhost:3001)

### Docker (from the repo root)

```bash
docker compose up -d --build qashio-frontend
```

App: [http://localhost:4000](http://localhost:4000)

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3001 |
| `npm run build` / `npm start` | Production build / serve it |
| `npm test` | Jest unit tests |
| `npm run lint` | ESLint |
| `npm run format` / `format:check` | Prettier |

Pre-commit (Husky + lint-staged) runs ESLint and Prettier on staged files.

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Redirects to the dashboard (or to login) |
| `/auth/login`, `/auth/register`, `/auth/verify-email` | Sign in, sign up, confirm the email OTP |
| `/auth/forgot-password`, `/auth/reset-password` | Reset via OTP. The `otpToken` from the request step is kept in `sessionStorage` and sent with the reset |
| `/dashboard` | Overview |
| `/accounts`, `/accounts/new`, `/accounts/:id/edit` | Wallets with derived balances; opening balance, default and archive |
| `/transactions` | Server-side DataGrid: paging, sorting, type / wallet / category / date filters, debounced search, month summary, details drawer |
| `/transactions/new?type=income\|expense`, `/transactions/:id/edit` | Add or edit income / expense |
| `/categories`, `/categories/new` | List and create categories |
| `/budgets`, `/budgets/new`, `/budgets/:id/edit` | Budgets per wallet with usage bars. Several categories can be picked at once (one budget each) |
| `/change-password` | Change password via OTP |

`middleware.ts` keeps signed-out users out of the dashboard and signed-in users off the auth pages. The API remains the real authorization check.

---

## How it works

### API client (`lib/api/http-client.ts`)

- Base URL from `NEXT_PUBLIC_API_URL`, 15 s timeout, and cancellation through React Query's `AbortSignal`.
- Every request carries a fresh `X-Request-Id`, reused if the request is retried after a token refresh. Errors become `ApiError` with `status`, the response body in `details`, and `requestId`, so a failure can be found in the API logs.
- On `401` the client refreshes once and retries. Concurrent requests share a single refresh call.

### Session

The access token lives in memory (Zustand). The refresh token is in a cookie, alongside a flag cookie the middleware reads.

### Adding a transaction (no double saves)

- The form sends an `Idempotency-Key` header (`useIdempotencyKey`). Submitting the same payload again reuses the key: a double click, a retry after a timeout, or "Save anyway". The API then returns the original instead of saving twice. Changing the form starts a new key.
- If the API answers `409 POSSIBLE_DUPLICATE` (a matching entry was saved in the last 2 minutes), a dialog shows that entry. "Save anyway" resends with `confirmDuplicate: true` and the same key.

### Forms and layout

Forms use React Hook Form with Zod schemas owned by each feature. Every form page uses `FormPage` (a card centred on both axes), and every table or list sits in a `ContentCard`. Amounts are entered and displayed as decimal strings and formatted with `Intl`, which knows each currency's decimals (USD has 2, XAF has 0).

### Server state

React Query hooks per feature. Saving or deleting a transaction invalidates transactions, summaries, wallet balances, budgets and notifications, because budget usage and alerts depend on transactions. The notifications bell polls every 30 s.

---

## Testing

Tests cover critical logic only: env validation, money formatting, and the transaction and budget form schemas and payload mapping.

```bash
npm test
```

---

## Related

- Backend: `../qashio-api` ([schema & diagrams v2](../qashio-api/docs/database-v2.md))
- Repo root: `docker-compose.yml` (API, Postgres, Redis, frontend)
