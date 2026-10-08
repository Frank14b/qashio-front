'use client';

import { Chip, Typography, type TypographyProps } from '@mui/material';
import { formatMoney } from '@/lib/format/money';
import type { Transaction, TransactionStatus } from '../types';

type TransactionAmountProps = {
  transaction: Pick<Transaction, 'signedAmount' | 'currencyCode' | 'direction'>;
} & Omit<TypographyProps, 'children'>;

/** Signed, colored amount: green `+` for money in, red `−` for money out. */
export function TransactionAmount({ transaction, sx, ...props }: TransactionAmountProps) {
  return (
    <Typography
      component="span"
      {...props}
      sx={{
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        color: transaction.direction === 'in' ? 'success.main' : 'error.main',
        ...sx,
      }}
    >
      {formatMoney(transaction.signedAmount, transaction.currencyCode, {
        signDisplay: 'exceptZero',
      })}
    </Typography>
  );
}

const STATUS_STYLES: Record<TransactionStatus, { label: string; color: 'success' | 'warning' | 'default' }> = {
  completed: { label: 'Completed', color: 'success' },
  pending: { label: 'Pending', color: 'warning' },
  failed: { label: 'Failed', color: 'default' },
};

export function TransactionStatusChip({ status }: { status: TransactionStatus }) {
  const style = STATUS_STYLES[status];
  return <Chip size="small" variant="outlined" label={style.label} color={style.color} />;
}
