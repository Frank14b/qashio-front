import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { getRefreshTokenFromCookie } from '@/lib/auth/session-cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const DEFAULT_TIMEOUT_MS = 15_000;
const REQUEST_ID_HEADER = 'x-request-id';

type AuthInterceptorConfig = {
  getAccessToken: () => string | null;
  onTokensRefreshed: (tokens: {
    accessToken: string;
    refreshToken: string;
  }) => void;
  onAuthFailure: () => void;
};

let authConfig: AuthInterceptorConfig | null = null;
let interceptorsAttached = false;
let refreshPromise: Promise<string | null> | null = null;

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly isCanceled: boolean;
  readonly isTimeout: boolean;
  /** Server request id (X-Request-Id) to find this failure in the API logs. */
  readonly requestId?: string;

  constructor(params: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
    isCanceled?: boolean;
    isTimeout?: boolean;
    requestId?: string;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.isCanceled = params.isCanceled ?? false;
    this.isTimeout = params.isTimeout ?? false;
    this.requestId = params.requestId;
  }
}

export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (error instanceof ApiError) {
    if (error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isCancel(error)) {
    return new ApiError({
      message: 'Request canceled',
      code: AxiosError.ERR_CANCELED,
      isCanceled: true,
    });
  }

  if (error instanceof AxiosError) {
    const isTimeout = error.code === AxiosError.ETIMEDOUT || error.code === 'ECONNABORTED';
    const isCanceled = error.code === AxiosError.ERR_CANCELED;
    const responseData = error.response?.data;
    let message = error.message || 'Request failed';

    if (typeof responseData === 'object' && responseData && 'message' in responseData) {
      const apiMessage = (responseData as { message: unknown }).message;
      if (typeof apiMessage === 'string') {
        message = apiMessage;
      } else if (Array.isArray(apiMessage)) {
        message = apiMessage.map(String).join('. ');
      }
    }

    const requestIdHeader: unknown = error.response?.headers?.[REQUEST_ID_HEADER];
    return new ApiError({
      message,
      status: error.response?.status,
      code: error.code,
      details: responseData,
      isCanceled,
      isTimeout,
      requestId: typeof requestIdHeader === 'string' ? requestIdHeader : undefined,
    });
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message });
  }

  return new ApiError({ message: 'Unknown API error' });
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// One id per user action: the API logs every operation of the request under it.
// Kept when the same config is retried after a token refresh, so the retry
// shares the original id. randomUUID needs a secure context (https/localhost);
// without it the API generates the id.
apiClient.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
  if (!requestConfig.headers.has(REQUEST_ID_HEADER) && globalThis.crypto?.randomUUID) {
    requestConfig.headers.set(REQUEST_ID_HEADER, globalThis.crypto.randomUUID());
  }
  return requestConfig;
});

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshTokenFromCookie();
  if (!refreshToken || !authConfig) {
    authConfig?.onAuthFailure();
    return null;
  }

  try {
    const { data } = await axios.post<{
      accessToken: string;
      refreshToken: string;
      user: { id: string; email: string; displayName: string };
    }>(`${API_BASE_URL}/auth/refresh`, { refreshToken }, { timeout: DEFAULT_TIMEOUT_MS });

    authConfig.onTokensRefreshed({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });
    return data.accessToken;
  } catch {
    authConfig.onAuthFailure();
    return null;
  }
}

export function configureAuthInterceptors(config: AuthInterceptorConfig): void {
  authConfig = config;

  if (interceptorsAttached) {
    return;
  }

  apiClient.interceptors.request.use((requestConfig: InternalAxiosRequestConfig) => {
    const token = authConfig?.getAccessToken();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!(error instanceof AxiosError) || !error.config) {
        return Promise.reject(toApiError(error));
      }

      const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      const status = error.response?.status;
      const url = original.url ?? '';
      const isAuthEndpoint =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/refresh') ||
        url.includes('/auth/verify-email') ||
        url.includes('/auth/forgot-password') ||
        url.includes('/auth/reset-password');

      if (status === 401 && !original._retry && !isAuthEndpoint) {
        original._retry = true;

        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }

        const accessToken = await refreshPromise;
        if (accessToken) {
          original.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient.request(original);
        }
      }

      return Promise.reject(toApiError(error));
    },
  );

  interceptorsAttached = true;
}

export type ApiRequestConfig = AxiosRequestConfig & {
  /** AbortSignal from React Query / caller for cancellation */
  signal?: AbortSignal;
};

async function unwrap<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  const response = await promise;
  return response.data;
}

export const api = {
  get: <T>(url: string, config?: ApiRequestConfig) => unwrap<T>(apiClient.get<T>(url, config)),

  post: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    unwrap<T>(apiClient.post<T>(url, data, config)),

  put: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    unwrap<T>(apiClient.put<T>(url, data, config)),

  patch: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    unwrap<T>(apiClient.patch<T>(url, data, config)),

  delete: <T>(url: string, config?: ApiRequestConfig) =>
    unwrap<T>(apiClient.delete<T>(url, config)),
};

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
