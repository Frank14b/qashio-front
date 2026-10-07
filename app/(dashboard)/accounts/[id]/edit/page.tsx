'use client';

import { Alert, Box, Button, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FormPage } from '@/app/components/ui';
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

  const account = accountQuery.data;

  return (
    <FormPage
      title="Edit wallet"
      subtitle="Update the name, opening balance or default flag. Currency stays fixed after creation."
    >
      {accountQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : !account ? (
        <Alert severity="error">
          {getErrorMessage(accountQuery.error, 'Unable to load wallet')}
        </Alert>
      ) : (
        <>
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
        </>
      )}

      <Button component={Link} href="/accounts" variant="text" sx={{ alignSelf: 'flex-start' }}>
        Back to accounts
      </Button>
    </FormPage>
  );
}
