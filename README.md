# Qashio Frontend

Next.js frontend for the Qashio expense tracker. Talks to the NestJS API for transactions, categories, and budgets.

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | MUI v7 (DataGrid, Dialogs, Date Pickers) |
| Server state | TanStack React Query |
| Client UI state | Zustand |
| Forms | React Hook Form + Zod + FormProvider / Controller |
| HTTP | Axios (shared client: timeout + AbortSignal cancellation) |
| Quality | ESLint, Prettier, Husky, lint-staged |

---

## Project structure

Feature-module layout (similar to Angular feature modules):

```text
app/
  (features)/
    transactions/          # feature module
      components/          # feature-specific UI (table, filters, …)
      forms/               # Zod schema + TransactionForm
      hooks/               # React Query + filter hooks
      services/            # API calls for this feature
      stores/              # Zustand (filters, etc.)
      types.ts
      page.tsx             # list view
      new/page.tsx         # create view
      layout.tsx
  components/
    ui/                    # shared Input, Select, Form, Button, …
    PageLayout.tsx
    NavBar.tsx
  forms/
    useZodForm.ts          # shared RHF + Zod helper
    fields/                # FormInput / FormSelectField / FormDatePickerField
  providers.tsx
lib/
  api/http-client.ts       # shared Axios client
```

**Rule of thumb:** feature owns schema, types, services, and views. `components/ui` and `lib/api` stay shared.

---

## Setup

### Prerequisites

- Node.js 18+
- npm
- Running backend API (default `http://localhost:3000`)

### Environment

Create `.env.local` in this folder to override defaults:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000

# Sentry (off by default; enabling requires the DSN)
NEXT_PUBLIC_SENTRY_ENABLED=false
# NEXT_PUBLIC_SENTRY_DSN=https://<key>@<org>.ingest.sentry.io/<project>
# NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
# NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE=0
```

Variables are validated with zod in `lib/env.ts` (http(s) URLs, Sentry DSN required when enabled); an invalid value fails `next build` / the dev server with a list of every problem. `NEXT_PUBLIC_*` values are inlined at build time, so rebuild after changing them. Sentry (`@sentry/nextjs`) reports browser errors, server request errors (`instrumentation.ts`) and root render crashes (`app/global-error.tsx`).

### Local (recommended for UI work)

```bash
cd qashio-frontend-assignment
npm install
npm run dev
```

App: [http://localhost:3000](http://localhost:3000)

### Docker (from repo root)

```bash
docker compose up -d --build qashio-frontend
```

Frontend is mapped to [http://localhost:4000](http://localhost:4000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check |

Pre-commit (Husky + lint-staged) runs ESLint and Prettier on staged files when hooks are installed via `npm install` / `npm run prepare`.

---

## Architecture notes

### Forms

- Shared UI: `Input`, `Select`, `DatePickerField`, `Form`, `FormActions`
- RHF bindings: `FormInput`, `FormSelectField`, `FormDatePickerField` (use `useFormContext` + `Controller`)
- Feature form: compose fields in `TransactionForm` with a Zod schema

### API

- Shared Axios instance in `lib/api/http-client.ts`
  - Base URL from `NEXT_PUBLIC_API_URL`
  - Default timeout: 15s
  - Cancellation via `AbortSignal` (pass React Query’s `signal`)
  - Errors normalized as `ApiError`
- Feature services call `api.get/post/put/delete` only

### Data fetching

- React Query for server state (`useTransactions`, `useCreateTransaction`)
- Zustand for UI-only state (e.g. list filters)

---

## Starter plan

What is already in place vs what to build next.

### Done (foundation)

- [x] Next.js App Router + MUI providers
- [x] Feature folder for transactions
- [x] Shared UI + form field bindings
- [x] Zod-validated create form (`/transactions/new`)
- [x] Shared Axios HTTP client
- [x] Transaction service + React Query hooks
- [x] Husky / lint-staged / Prettier

### Next — transactions list (`/transactions`)

- [ ] Fetch list with `useTransactions` (pagination: 10 per page)
- [ ] MUI DataGrid: sortable columns + filters (date range, search)
- [ ] Row click → detail modal / drawer
- [ ] Loading skeletons, empty state, error alerts
- [ ] Align with `Transactions.fig` where practical

### Next — wire create flow fully

- [ ] Ensure Nest `POST /transactions` matches form payload
- [ ] Invalidate query cache on success (already started in `useCreateTransaction`)
- [ ] Replace temporary category options with `GET /categories` when API is ready

### Later — categories & budgets (when API modules exist)

- [ ] Categories feature module (list + create)
- [ ] Budgets feature module (limit vs spending)
- [ ] Optional: show budget warning after transaction create (event-driven on API)

### Polish (bonus)

- [ ] Unit tests for form schema / key components
- [ ] Stronger empty / error / loading UX
- [ ] Remove unused `lowdb` mock once API is the only data source

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Redirects to `/transactions` |
| `/transactions` | List (in progress) |
| `/transactions/new` | Create transaction form |

---

## Related

- Backend: `../qashio-api`
- Repo root: `docker-compose.yml` for full stack (API + Postgres + Redis + frontend)
