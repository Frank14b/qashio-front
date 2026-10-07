'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthSession } from '@/hooks/useAuthSession';
import { PROTECTED_PATH_PREFIXES } from '@/lib/auth/routes';
import { useAuthStore } from '@/stores/authStore';

function AuthGate({ children }: Readonly<{ children: React.ReactNode }>) {
  const bootstrapped = useAuthStore((state) => state.bootstrapped);
  const accessToken = useAuthStore((state) => state.accessToken);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!bootstrapped) {
      return;
    }

    const isProtected = PROTECTED_PATH_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );

    if (isProtected && !accessToken) {
      router.replace('/auth/login');
    }
  }, [bootstrapped, accessToken, pathname, router]);

  if (!bootstrapped) {
    return null;
  }

  return children;
}

export function AuthSessionProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  useAuthSession();

  return <AuthGate>{children}</AuthGate>;
}
