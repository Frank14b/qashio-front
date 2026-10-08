'use client';

import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface FormPageProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  /** Card width; forms inside should use `maxWidth="100%"`. */
  maxWidth?: number;
}

/**
 * Form screen layout: a background card centered horizontally and vertically
 * in the app content area (the shell's main area has 32px vertical padding on md+).
 */
export function FormPage({ title, subtitle, children, maxWidth = 560 }: Readonly<FormPageProps>) {
  return (
    <Box
      sx={{
        minHeight: { md: 'calc(100vh - 64px)' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth,
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 24px 64px rgba(15, 23, 42, 0.08)',
        }}
      >
        <Typography
          component="h1"
          sx={{
            m: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: { xs: '1.75rem', md: '2rem' },
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
        <Stack spacing={3} sx={{ mt: 3 }}>
          {children}
        </Stack>
      </Paper>
    </Box>
  );
}
