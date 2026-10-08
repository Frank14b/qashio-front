'use client';

import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/hooks/useAuthMutations';
import { useAuthStore } from '@/stores/authStore';

export default function NavBar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: '#0f172a',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          component={Link}
          href="/transactions"
          sx={{
            flexGrow: 1,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1.35rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Qashio
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <Typography
              variant="body2"
              sx={{ opacity: 0.85, mr: 1, display: { xs: 'none', sm: 'block' } }}
            >
              {user.displayName}
            </Typography>
          ) : null}
          <Button
            color="inherit"
            component={Link}
            href="/transactions/new"
            sx={{
              fontWeight: pathname === '/transactions/new' ? 700 : 500,
              textDecoration: pathname === '/transactions/new' ? 'underline' : 'none',
            }}
          >
            New Transaction
          </Button>
          <Button color="inherit" component={Link} href="/change-password">
            Password
          </Button>
          <Button color="inherit" onClick={() => logout.mutate()} disabled={logout.isPending}>
            {logout.isPending ? 'Signing out…' : 'Sign out'}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
