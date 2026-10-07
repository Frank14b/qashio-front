import type { ReactNode } from 'react';

/** Public auth routes — no app chrome; each page uses AuthShell. */
export default function AuthGroupLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
