import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { LoginPageClient } from './LoginPageClient';

function Fallback() {
  return (
    <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <CircularProgress size={28} />
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <LoginPageClient />
    </Suspense>
  );
}
