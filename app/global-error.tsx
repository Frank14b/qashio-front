'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

/**
 * Last-resort boundary for errors in the root layout. It replaces the whole
 * document, so it renders its own <html>/<body> and avoids app providers.
 * Reports the error to Sentry (no-op when disabled).
 */
export default function GlobalError({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#eef3f5',
          color: '#0f172a',
        }}
      >
        <main style={{ textAlign: 'center', padding: 24 }}>
          <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Something went wrong</h1>
          <p style={{ color: '#475569', margin: '0 0 16px' }}>
            The error has been reported. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '10px 18px',
              border: 0,
              borderRadius: 6,
              background: '#0f766e',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
