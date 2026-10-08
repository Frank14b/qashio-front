import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { VerifyEmailPageClient } from './VerifyEmailPageClient';

function Fallback() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <CircularProgress size={28} />
    </Box>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <VerifyEmailPageClient />
    </Suspense>
  );
}
