'use client';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { ContentCard } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { useCategories } from './hooks/useCategories';
import type { CategoryKind } from './types';

const KIND_CHIP: Record<CategoryKind, { label: string; color: 'error' | 'success' | 'default' }> = {
  expense: { label: 'Expense', color: 'error' },
  income: { label: 'Income', color: 'success' },
  both: { label: 'Both', color: 'default' },
};

export default function CategoriesPage() {
  const categories = useCategories();

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              m: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '2.25rem' },
            }}
          >
            Categories
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Group transactions and set budgets per category.
          </Typography>
        </Box>
        <Button component={Link} href="/categories/new" variant="contained">
          Add category
        </Button>
      </Box>

      {categories.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : categories.isError ? (
        <Alert severity="error">
          {getErrorMessage(categories.error, 'Unable to load categories')}
        </Alert>
      ) : (
        <ContentCard>
          {!categories.data?.length ? (
            <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
              No categories yet.
            </Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Used for</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categories.data.map((category) => (
                    <TableRow key={category.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{category.name}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={KIND_CHIP[category.kind].label}
                          color={KIND_CHIP[category.kind].color}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </ContentCard>
      )}
    </Stack>
  );
}
