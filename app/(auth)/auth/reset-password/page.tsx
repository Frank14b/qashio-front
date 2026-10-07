import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { ResetPasswordPageClient } from './ResetPasswordPageClient';

function Fallback() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <CircularProgress size={28} />
    </Box>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <ResetPasswordPageClient />
    </Suspense>
  );
}
