import type { ReactNode } from 'react';
import { AppShell } from '@/components/AppShell';

/**
 * Shared shell for all authenticated app routes (sidebar + main content).
 * Public auth screens live under the `(auth)` route group instead.
 */
export default function DashboardGroupLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AppShell>{children}</AppShell>;
}
