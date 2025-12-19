const API_BASE = "/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

async function request<T>(
  path: string,
  method: HttpMethod,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    method,
    signal: options.signal,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const message = await safeErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    // No content
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function safeErrorMessage(response: Response) {
  try {
    const json = await response.json();
    if (json?.message) return json.message as string;
  } catch {
    // ignore
  }
  return `API error ${response.status}`;
}

/**
 * Wrapper that falls back to a provided value when the backend is offline.
 * This keeps the front navegável mesmo sem API pronta.
 */
export async function apiCall<T>(
  path: string,
  method: HttpMethod,
  fallback: T,
  options: RequestOptions = {},
): Promise<T> {
  try {
    return await request<T>(path, method, options);
  } catch (error) {
    console.warn(`[api stub] ${method} ${path} falhou, usando fallback`, error);
    return fallback;
  }
}

export const http = {
  get: <T>(path: string, fallback: T, options?: RequestOptions) =>
    apiCall<T>(path, "GET", fallback, options),
  post: <T>(path: string, body: unknown, fallback: T, options?: RequestOptions) =>
    apiCall<T>(path, "POST", fallback, { ...options, body }),
  put: <T>(path: string, body: unknown, fallback: T, options?: RequestOptions) =>
    apiCall<T>(path, "PUT", fallback, { ...options, body }),
  patch: <T>(path: string, body: unknown, fallback: T, options?: RequestOptions) =>
    apiCall<T>(path, "PATCH", fallback, { ...options, body }),
  delete: <T>(path: string, fallback: T, options?: RequestOptions) =>
    apiCall<T>(path, "DELETE", fallback, options),
};
