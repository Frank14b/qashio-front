# Feature modules + route groups

## Public vs protected

| Group | Purpose | Layout |
|-------|---------|--------|
| `app/(auth)/` | Login, register, OTP, forgot/reset | `AuthShell` per page |
| `app/(dashboard)/` | Authenticated app | Single `AppShell` in group `layout.tsx` |

## Example: accounts (protected)

```text
app/(dashboard)/
  layout.tsx                 # AppShell (sidebar)
  accounts/
    types.ts
    forms/
      account.schema.ts
      AccountForm.tsx
    hooks/
      useAccounts.ts
      useCreateAccount.ts
    services/
      accounts.service.ts
    components/
      AccountsList.tsx
    layout.tsx               # passthrough only
    page.tsx                 # /accounts
    new/page.tsx             # /accounts/new
```

## Service pattern

```ts
import { api, type ApiRequestConfig } from '@/lib/api/http-client';

export const accountsService = {
  list: (includeArchived = false, config?: ApiRequestConfig) =>
    api.get<Account[]>('/accounts', { ...config, params: { includeArchived } }),
  create: (payload: CreateAccountPayload, config?: ApiRequestConfig) =>
    api.post<Account>('/accounts', payload, config),
};
```

## Shared vs feature component

| Put in `components/ui` or `components/forms` | Put in feature `components/` |
|---------------------------------------------|------------------------------|
| Input, Select, Button, Form layout | Accounts table |
| FormPasswordField, FormDatePickerField | Feature filters / drawers |

If removing the feature would delete the component, it belongs in the feature.

## middleware.ts

- Protect `/dashboard`, `/accounts`, `/transactions`, `/change-password`
- Redirect guests on those paths to `/auth/login`
- Redirect authenticated users away from guest auth paths to `/dashboard`
