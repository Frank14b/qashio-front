'use client';

import { useRef } from 'react';

/**
 * Idempotency-Key for one user action. Submitting the same payload again (double click,
 * retry after a timeout, "Save anyway") reuses the key so the API replays instead of saving
 * twice; changing the form makes it a new action with a new key.
 */
export function useIdempotencyKey<T>(): (payload: T) => string {
  const last = useRef<{ fingerprint: string; key: string } | null>(null);

  return (payload) => {
    const fingerprint = JSON.stringify(payload);
    if (last.current?.fingerprint !== fingerprint) {
      last.current = { fingerprint, key: crypto.randomUUID() };
    }
    return last.current.key;
  };
}
