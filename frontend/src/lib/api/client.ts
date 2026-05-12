import { env } from '@/config/env';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly payload: unknown,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions<T> = Omit<RequestInit, 'body'> & {
  body?: unknown;
  parse: (data: unknown) => T;
};

export async function apiFetch<T>(path: string, options: RequestOptions<T>): Promise<T> {
  const { body, parse, headers, ...rest } = options;
  const init: RequestInit = {
    ...rest,
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
      ...(headers ?? {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  };

  let res: Response;
  try {
    res = await fetch(`${env.NEXT_PUBLIC_BACKEND_URL}${path}`, init);
  } catch (err) {
    throw new ApiError(
      0,
      null,
      err instanceof Error ? err.message : 'Network error',
    );
  }

  const text = await res.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!res.ok) {
    const detail =
      (payload && typeof payload === 'object' && 'detail' in payload
        ? (payload as { detail: unknown }).detail
        : undefined) ?? `HTTP ${res.status}`;
    throw new ApiError(
      res.status,
      payload,
      typeof detail === 'string' ? detail : JSON.stringify(detail),
    );
  }

  return parse(payload);
}
