'use client';

import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
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

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={{ display: 'block' }}
    >
      {children}
    </svg>
  );
}

const DashboardIcon = () => (
  <NavIcon>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </NavIcon>
);

const AccountsIcon = () => (
  <NavIcon>
    <rect x="2" y="5" width="20" height="14" rx="1.5" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
  </NavIcon>
);

const TransactionsIcon = () => (
  <NavIcon>
    <path d="M8 7h11" />
    <path d="M16 4l3 3-3 3" />
    <path d="M16 17H5" />
    <path d="M8 20l-3-3 3-3" />
  </NavIcon>
);

const PasswordIcon = () => (
  <NavIcon>
    <rect x="5" y="11" width="14" height="10" rx="1.5" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </NavIcon>
);

const MenuIcon = () => (
  <NavIcon>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </NavIcon>
);

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { href: '/accounts', label: 'Accounts', icon: AccountsIcon },
  { href: '/transactions', label: 'Transactions', icon: TransactionsIcon },
  { href: '/change-password', label: 'Change password', icon: PasswordIcon },
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
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={selected}
              onClick={() => setMobileOpen(false)}
              sx={{
                mb: 0.5,
                borderRadius: 1,
                color: 'rgba(255,255,255,0.82)',
                '&.Mui-selected': {
                  bgcolor: 'rgba(15, 118, 110, 0.35)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.45)' },
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                <Icon />
              </ListItemIcon>
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
            <MenuIcon />
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
