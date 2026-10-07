'use client';

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { useLogout } from '@/hooks/useAuthMutations';
import { useAuthStore } from '@/stores/authStore';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/accounts', label: 'Accounts' },
  { href: '/transactions', label: 'Transactions' },
  { href: '/change-password', label: 'Change password' },
] as const;

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0f172a',
        color: '#fff',
      }}
    >
      <Toolbar sx={{ px: 2.5, minHeight: 72 }}>
        <Typography
          component={Link}
          href="/dashboard"
          sx={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: '1.5rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Qashio
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const selected =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                color: 'rgba(255,255,255,0.82)',
                '&.Mui-selected': {
                  bgcolor: 'rgba(15, 118, 110, 0.35)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.45)' },
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: selected ? 700 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
      <Box sx={{ p: 2 }}>
        {user ? (
          <Typography variant="body2" sx={{ opacity: 0.75, mb: 1.5, px: 0.5 }}>
            {user.displayName}
          </Typography>
        ) : null}
        <Button
          fullWidth
          variant="outlined"
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          sx={{
            color: '#fff',
            borderColor: 'rgba(255,255,255,0.24)',
            '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.06)' },
          }}
        >
          {logout.isPending ? 'Signing out…' : 'Sign out'}
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {!isDesktop ? (
        <Toolbar
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: (t) => t.zIndex.appBar,
            bgcolor: '#0f172a',
            color: '#fff',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            sx={{ mr: 1 }}
          >
            <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 700 }}>
              ☰
            </Box>
          </IconButton>
          <Typography sx={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.25rem' }}>
            Qashio
          </Typography>
        </Toolbar>
      ) : null}

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {isDesktop ? (
          <Drawer
            variant="permanent"
            open
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                borderRight: 'none',
                boxSizing: 'border-box',
              },
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: DRAWER_WIDTH,
                borderRight: 'none',
                boxSizing: 'border-box',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          pt: { xs: 10, md: 0 },
        }}
      >
        <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 4 }, maxWidth: 1100 }}>{children}</Box>
      </Box>
    </Box>
  );
}
