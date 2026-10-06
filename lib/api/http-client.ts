import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';
const DEFAULT_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;
  readonly isCanceled: boolean;
  readonly isTimeout: boolean;

  constructor(params: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
    isCanceled?: boolean;
    isTimeout?: boolean;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.isCanceled = params.isCanceled ?? false;
    this.isTimeout = params.isTimeout ?? false;
  }
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

    return new ApiError({
      message:
        (typeof error.response?.data === 'object' &&
          error.response.data &&
          'message' in error.response.data &&
          String((error.response.data as { message: unknown }).message)) ||
        error.message ||
        'Request failed',
      status: error.response?.status,
      code: error.code,
      details: error.response?.data,
      isCanceled,
      isTimeout,
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

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(toApiError(error)),
);

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
