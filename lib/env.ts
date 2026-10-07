import { z } from 'zod';

// z.url() alone accepts `localhost:3000` (scheme "localhost:"); require http(s).
const httpUrl = z.url({ protocol: /^https?$/, error: 'must be an http(s):// URL' });

export const envSchema = z
  .object({
    NEXT_PUBLIC_API_URL: httpUrl.default('http://localhost:3000'),
    NEXT_PUBLIC_SENTRY_ENABLED: z.stringbool().default(false),
    NEXT_PUBLIC_SENTRY_DSN: httpUrl.optional(),
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: z.string().optional(),
    NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: z.coerce.number().min(0).max(1).default(0),
  })
  .superRefine((env, ctx) => {
    if (env.NEXT_PUBLIC_SENTRY_ENABLED && !env.NEXT_PUBLIC_SENTRY_DSN) {
      ctx.addIssue({
        code: 'custom',
        path: ['NEXT_PUBLIC_SENTRY_DSN'],
        message: 'is required when NEXT_PUBLIC_SENTRY_ENABLED=true',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

/** Validates raw variables; empty values count as unset. Throws one error listing every problem. */
export function parseEnv(raw: Record<string, string | undefined>): Env {
  const present = Object.fromEntries(Object.entries(raw).filter(([, value]) => value !== ''));
  const result = envSchema.safeParse(present);
  if (!result.success) {
    throw new Error(`Invalid environment configuration:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}

/**
 * Next.js inlines NEXT_PUBLIC_* values at build time only when they are read
 * literally, so each one is listed explicitly (no `process.env` spread).
 * Invalid values fail `next build` (pages import this) or the dev server.
 */
export const env = parseEnv({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SENTRY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_SENTRY_ENVIRONMENT: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE,
});
