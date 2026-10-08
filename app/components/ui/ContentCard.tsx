'use client';

import { Paper, type PaperProps } from '@mui/material';

/** Background card for tables and lists; children control their own padding. */
export function ContentCard({ sx, children, ...props }: PaperProps) {
  return (
    <Paper
      elevation={0}
      {...props}
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: '0 12px 32px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
