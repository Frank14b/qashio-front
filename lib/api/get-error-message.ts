import { isApiError } from '@/lib/api/http-client';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (isApiError(error) && error.message.trim()) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
