import * as Sentry from '@sentry/nextjs';
import { env } from '@/lib/env';
import { SENTRY_ENABLED, sentryOptions } from '@/lib/sentry/config';

// Browser runtime (Next.js loads this file before the app starts).
if (SENTRY_ENABLED) {
  Sentry.init({
    ...sentryOptions,
    // When tracing is on, link browser traces to the API's (sentry-trace header).
    tracePropagationTargets: [env.NEXT_PUBLIC_API_URL],
  });
}

// Navigation spans for tracing; a no-op when Sentry is not initialised.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
