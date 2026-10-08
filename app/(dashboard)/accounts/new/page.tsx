'use client';

import { Alert, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormPage } from '@/app/components/ui';
import { getErrorMessage } from '@/lib/api/get-error-message';
import { AccountForm } from '../forms/AccountForm';
import { useCreateAccount } from '../hooks/useCreateAccount';
import type { AccountFormValues } from '../forms/account.schema';

export default function NewAccountPage() {
  const router = useRouter();
  const createAccount = useCreateAccount();

  const handleSubmit = async (values: AccountFormValues) => {
    await createAccount.mutateAsync({
      name: values.name,
      currencyCode: values.currencyCode.toUpperCase(),
      isDefault: values.isDefault,
      openingBalance: values.openingBalance,
    });
    router.push('/accounts');
  };

  return (
    <FormPage
      title="Add wallet"
      subtitle="Choose a name and currency. You can mark one wallet as default."
    >
      {createAccount.isError ? (
        <Alert severity="error">
          {getErrorMessage(createAccount.error, 'Unable to create wallet')}
        </Alert>
      ) : null}

      <AccountForm
        onSubmit={(values) => void handleSubmit(values)}
        isSubmitting={createAccount.isPending}
      />

      <Button component={Link} href="/accounts" variant="text" sx={{ alignSelf: 'flex-start' }}>
        Back to accounts
      </Button>
    </FormPage>
  );
}
