'use client';

import { Alert, Box, Link as MuiLink, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthShellProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  notice?: string | null;
  error?: string | null;
};

export function AuthShell({
  children,
  title,
  subtitle,
  footer,
  notice,
  error,
}: Readonly<AuthShellProps>) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: { xs: 1.5, md: 2 },
        background: `
          radial-gradient(ellipse 80% 60% at 10% 20%, rgba(15, 118, 110, 0.12), transparent 55%),
          radial-gradient(ellipse 70% 50% at 90% 80%, rgba(15, 23, 42, 0.08), transparent 50%),
          linear-gradient(165deg, #e8eef2 0%, #f4f7f8 45%, #dfe8ec 100%)
        `,
      }}
    >
      <Box
        sx={{
          width: 'min(1040px, 100%)',
          minHeight: { xs: 'auto', md: 'min(680px, calc(100vh - 32px))' },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(280px, 2fr) 3fr' },
          overflow: 'hidden',
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'rgba(15, 23, 42, 0.12)',
          bgcolor: 'background.paper',
          boxShadow: '0 24px 64px rgba(15, 23, 42, 0.1)',
          animation: 'authShellIn 520ms cubic-bezier(0.22, 1, 0.36, 1)',
          '@keyframes authShellIn': {
            from: { opacity: 0, transform: 'translateY(12px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Box
          component="aside"
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 1.5,
            px: 6,
            py: 6,
            color: '#fff',
            background: 'linear-gradient(160deg, #0f172a 0%, #134e4a 72%, #0f766e 140%)',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12), transparent 45%)',
              pointerEvents: 'none',
              animation: 'brandGlow 8s ease-in-out infinite alternate',
            },
            '@keyframes brandGlow': {
              from: { opacity: 0.55 },
              to: { opacity: 1 },
            },
          }}
        >
          <Typography
            component="p"
            sx={{
              m: 0,
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              opacity: 0.85,
              position: 'relative',
            }}
          >
            Expense tracker
          </Typography>
          <Typography
            component="h1"
            sx={{
              m: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 'clamp(2.4rem, 4vw, 3.25rem)',
              lineHeight: 1.05,
              position: 'relative',
            }}
          >
            Qashio
          </Typography>
          <Typography
            sx={{
              m: 0,
              mt: 1,
              maxWidth: 280,
              fontSize: '1.05rem',
              lineHeight: 1.5,
              opacity: 0.9,
              position: 'relative',
            }}
          >
            Track spending with clarity. Sign in to manage accounts, categories, and cash flow.
          </Typography>
        </Box>

        <Box
          component="main"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2.5, sm: 4 },
            py: { xs: 4, md: 5 },
          }}
        >
          <Stack spacing={2.5} sx={{ width: 'min(420px, 100%)' }}>
            <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1 }}>
              <Typography
                component="p"
                sx={{
                  m: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'primary.main',
                }}
              >
                Qashio
              </Typography>
            </Box>

            <Box>
              <Typography
                component="h2"
                sx={{
                  m: 0,
                  mb: subtitle ? 1 : 3,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '1.75rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {title}
              </Typography>
              {subtitle ? (
                <Typography color="text.secondary" sx={{ m: 0, mb: 3, lineHeight: 1.5 }}>
                  {subtitle}
                </Typography>
              ) : null}
            </Box>

            {notice ? (
              <Alert severity="success" variant="outlined">
                {notice}
              </Alert>
            ) : null}
            {error ? (
              <Alert severity="error" variant="outlined">
                {error}
              </Alert>
            ) : null}

            {children}
            {footer}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

type AuthSwitchProps = {
  prompt: string;
  href: string;
  label: string;
};

export function AuthSwitch({ prompt, href, label }: Readonly<AuthSwitchProps>) {
  return (
    <Typography color="text.secondary" sx={{ mt: 1, textAlign: 'center', fontSize: '0.95rem' }}>
      {prompt}{' '}
      <MuiLink
        component={Link}
        href={href}
        underline="hover"
        sx={{ fontWeight: 600, color: 'primary.main' }}
      >
        {label}
      </MuiLink>
    </Typography>
  );
}
