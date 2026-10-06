'use client';

import { Stack, type StackProps } from '@mui/material';
import type { ReactNode } from 'react';

export interface FormActionsProps extends StackProps {
  children: ReactNode;
}

export function FormActions({ children, ...props }: FormActionsProps) {
  return (
    <Stack direction="row" spacing={1.5} justifyContent="flex-end" pt={1} {...props}>
      {children}
    </Stack>
  );
}
