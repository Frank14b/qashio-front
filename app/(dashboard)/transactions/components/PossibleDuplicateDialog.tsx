'use client';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { isApiError } from '@/lib/api/http-client';
import { formatMoney } from '@/lib/format/money';
import type { PossibleDuplicate } from '../types';

/** The matched entry when the API answered 409 `POSSIBLE_DUPLICATE`, otherwise null. */
export function getPossibleDuplicate(error: unknown): PossibleDuplicate | null {
  if (!isApiError(error) || error.status !== 409) {
    return null;
  }
  const body = error.details as
    | { code?: string; details?: { duplicateOf?: PossibleDuplicate } }
    | undefined;
  return body?.code === 'POSSIBLE_DUPLICATE' ? (body.details?.duplicateOf ?? null) : null;
}

const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

function recordedAgo(createdAt: string): string {
  const seconds = Math.round((new Date(createdAt).getTime() - Date.now()) / 1000);
  return Math.abs(seconds) < 60
    ? relativeTime.format(seconds, 'second')
    : relativeTime.format(Math.round(seconds / 60), 'minute');
}

type PossibleDuplicateDialogProps = {
  duplicate: PossibleDuplicate | null;
  isSaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function PossibleDuplicateDialog({
  duplicate,
  isSaving,
  onCancel,
  onConfirm,
}: Readonly<PossibleDuplicateDialogProps>) {
  return (
    <Dialog open={duplicate !== null} onClose={isSaving ? undefined : onCancel} maxWidth="xs">
      <DialogTitle>Possible duplicate</DialogTitle>
      {duplicate ? (
        <DialogContent>
          <DialogContentText>
            A matching {duplicate.type} of{' '}
            <strong>{formatMoney(duplicate.amount, duplicate.currencyCode)}</strong>
            {duplicate.counterparty ? ` at ${duplicate.counterparty}` : ''} was recorded{' '}
            {recordedAgo(duplicate.createdAt)} ({duplicate.reference}). Save this one as well?
          </DialogContentText>
        </DialogContent>
      ) : null}
      <DialogActions>
        <Button onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onConfirm} disabled={isSaving}>
          Save anyway
        </Button>
      </DialogActions>
    </Dialog>
  );
}
