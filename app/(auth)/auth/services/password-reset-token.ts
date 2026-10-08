/**
 * Holds the otpToken returned by forgot-password until the reset page uses it.
 * sessionStorage is per tab, so only the tab that requested the code can confirm
 * it, and the token never appears in the URL or history. Storage can be blocked
 * (private mode), so every access is guarded.
 */
const KEY = 'qashio:password-reset';

type StoredToken = { email: string; otpToken: string };

export function savePasswordResetToken(email: string, otpToken: string): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ email: email.trim().toLowerCase(), otpToken }));
  } catch {
    // Without storage the reset page asks the user to request a new code.
  }
}

export function readPasswordResetToken(email: string): string | null {
  try {
    const stored = JSON.parse(sessionStorage.getItem(KEY) ?? 'null') as StoredToken | null;
    return stored && stored.email === email.trim().toLowerCase() ? stored.otpToken : null;
  } catch {
    return null;
  }
}

export function clearPasswordResetToken(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
