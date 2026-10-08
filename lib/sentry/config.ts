import { env } from '@/lib/env';

/**
 * Sentry is off unless NEXT_PUBLIC_SENTRY_ENABLED=true (the env schema then
 * requires a DSN). NEXT_PUBLIC_* values are inlined at build time, so the same
 * flag works in the browser, Node and edge runtimes (change it → rebuild / restart dev).
 */
export const SENTRY_ENABLED = env.NEXT_PUBLIC_SENTRY_ENABLED;

export const sentryOptions = {
  dsn: env.NEXT_PUBLIC_SENTRY_DSN,
  environment: env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  // Performance tracing is opt-in (0 = errors only).
  tracesSampleRate: env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
};
