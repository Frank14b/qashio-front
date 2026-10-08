import { parseEnv } from './env';

describe('frontend env schema', () => {
  it('defaults to a local API with Sentry off, treating empty values as unset', () => {
    expect(parseEnv({ NEXT_PUBLIC_SENTRY_ENABLED: '', NEXT_PUBLIC_API_URL: '' })).toEqual({
      NEXT_PUBLIC_API_URL: 'http://localhost:3000',
      NEXT_PUBLIC_SENTRY_ENABLED: false,
      NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: 0,
    });
  });

  it('requires a DSN when Sentry is enabled', () => {
    expect(() => parseEnv({ NEXT_PUBLIC_SENTRY_ENABLED: 'true' })).toThrow('NEXT_PUBLIC_SENTRY_DSN');
  });

  it('rejects a malformed API URL and an out-of-range sample rate together', () => {
    expect(() =>
      parseEnv({ NEXT_PUBLIC_API_URL: 'localhost:3000', NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: '2' }),
    ).toThrow(/NEXT_PUBLIC_API_URL[\s\S]*NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE/);
  });
});
