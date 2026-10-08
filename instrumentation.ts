import * as Sentry from '@sentry/nextjs';
import { SENTRY_ENABLED, sentryOptions } from '@/lib/sentry/config';

// Server (Node) and edge (middleware) runtimes.
export function register() {
  if (SENTRY_ENABLED) {
    Sentry.init(sentryOptions);
  }
}

// Reports errors thrown while rendering/handling server requests; a no-op when disabled.
export const onRequestError = Sentry.captureRequestError;
