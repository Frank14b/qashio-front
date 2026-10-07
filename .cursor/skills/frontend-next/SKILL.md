---
name: frontend-next
description: >-
  Next.js App Router frontend conventions for qashio-frontend-assignment:
  (auth) vs (dashboard) route groups, feature modules, shared UI, Axios +
  React Query, RHF+Zod forms, and middleware.ts route protection. Use when
  editing or generating code under qashio-frontend-assignment.
---

# Qashio Frontend — Next.js + Feature Modules

## Hard rules (token / workflow)

- **Do not run linting.** Never run `eslint`, `next lint`, `npm run lint`, or lint-fix loops. Husky + lint-staged handle ESLint on commit.
- **Do not run Prettier CLI** unless the user explicitly asks. Write code that matches `.prettierrc`.
- **Do not introduce Server Actions** for API calls unless the user explicitly asks. Use the shared Axios client + feature services + React Query.
- Prefer official Next.js App Router conventions over inventing patterns.

## Prettier (match `.prettierrc`)

- `singleQuote: true`
- `trailingComma: "all"`
- `semi: true`
- `printWidth: 100`
- `tabWidth: 2`
- `endOfLine: "lf"`

## Public vs protected routes (required)

```text
app/
  (auth)/                    # public — no app chrome
    layout.tsx
    auth/
      AuthShell.tsx
      login/ …               # /auth/login
      register/
      verify-email/
      forgot-password/
      reset-password/
      services/ types/

  (dashboard)/               # protected — shared AppShell layout
    layout.tsx               # sidebar + main (AppShell) once for all children
    dashboard/page.tsx       # /dashboard
    accounts/…               # /accounts, /accounts/new
    transactions/…           # /transactions, /transactions/new
    change-password/…        # /change-password
```

- Route groups `(auth)` / `(dashboard)` do **not** appear in the URL.
- Protect prefixes in root **`middleware.ts`** (`/dashboard`, `/accounts`, `/transactions`, `/change-password`).
- Guest auth paths redirect to `/dashboard` when a session cookie exists.

## Angular → this repo (onboarding map)

| Angular | This Next app |
|---------|----------------|
| Feature module | `app/(dashboard)/<feature>/` or `app/(auth)/auth/` |
| Shared module | `app/components/ui/` + `app/components/forms/` |
| Injectable service | `services/` + React Query hooks in `hooks/` |
| Smart / presentational | feature `components/` vs shared `components/ui/` |
| Reactive forms | RHF + Zod in feature `forms/` + shared form helpers |
| Route guard | root `middleware.ts` + `(dashboard)/layout.tsx` shell |
| HttpClient | `lib/api/http-client.ts` + feature `services/` |

For folder examples, see [feature-modules.md](feature-modules.md).

## Feature module layout (required)

```text
app/(dashboard)/<feature>/
  types.ts
  components/
  forms/
  hooks/
  services/
  stores/                 # optional UI state only
  layout.tsx              # thin; do NOT re-wrap AppShell
  page.tsx
  <segment>/page.tsx
```

**Ownership**

- Feature code stays inside that feature folder.
- Cross-feature reuse goes to `app/components/ui` or `app/components/forms`.
- Session store: `app/stores/authStore.ts`. Auth API helpers: under `(auth)/auth/`.

## Shared layer

- Presentational primitives: `app/components/ui/`
- RHF field bindings: `app/components/forms/fields/` + `useZodForm`
- HTTP: `lib/api/http-client.ts`
- App shell: `app/components/AppShell.tsx` used by `(dashboard)/layout.tsx`

## Checklist for a new protected screen

1. Add under `app/(dashboard)/<feature>/` (types, service, hooks, forms, page)
2. Do not add another AppShell wrapper — parent `(dashboard)/layout.tsx` owns chrome
3. Extend `middleware.ts` matcher / prefixes if the URL prefix is new
4. Use Axios + React Query; no Server Actions for API
5. No ESLint runs; match Prettier config
