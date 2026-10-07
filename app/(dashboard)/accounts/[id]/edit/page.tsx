'use client';

import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { AccountForm } from '../../forms/AccountForm';
import type { AccountFormValues } from '../../forms/account.schema';
import { useAccount } from '../../hooks/useAccount';
import { useUpdateAccount } from '../../hooks/useUpdateAccount';

export default function EditAccountPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const accountQuery = useAccount(id);
  const updateAccount = useUpdateAccount();

  const handleSubmit = async (values: AccountFormValues) => {
    await updateAccount.mutateAsync({
      id,
      payload: {
        name: values.name,
        isDefault: values.isDefault,
        openingBalance: values.openingBalance,
      },
    });
    router.push('/accounts');
  };

  if (accountQuery.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (accountQuery.isError || !accountQuery.data) {
    return (
      <Stack spacing={2} maxWidth={560}>
        <Alert severity="error">
          {getErrorMessage(accountQuery.error, 'Unable to load wallet')}
        </Alert>
        <Button component={Link} href="/accounts" variant="text" sx={{ alignSelf: 'flex-start' }}>
          Back to accounts
        </Button>
      </Stack>
    );
  }

  const account = accountQuery.data;

  return (
    <Stack spacing={3} maxWidth={560}>
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
          Edit wallet
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Update the name, opening balance or default flag. Currency stays fixed after creation.
        </Typography>
      </Box>

      {updateAccount.isError ? (
        <Alert severity="error">
          {getErrorMessage(updateAccount.error, 'Unable to update wallet')}
        </Alert>
      ) : null}

      <AccountForm
        mode="edit"
        defaultValues={{
          name: account.name,
          currencyCode: account.currencyCode,
          isDefault: account.isDefault,
          openingBalance: account.openingBalance,
        }}
        onSubmit={(values) => void handleSubmit(values)}
        isSubmitting={updateAccount.isPending}
      />

      <Button component={Link} href="/accounts" variant="text" sx={{ alignSelf: 'flex-start' }}>
        Back to accounts
      </Button>
    </Stack>
  );
}
