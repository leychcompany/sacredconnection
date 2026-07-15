const DEFAULT_STORE_URL = "https://sacred-snuff.com";

export function getStoreUrl(): string {
  return (
    process.env.NEXT_PUBLIC_WC_STORE_URL?.replace(/\/$/, "") || DEFAULT_STORE_URL
  );
}

export function getStoreApiBase(): string {
  return `${getStoreUrl()}/wp-json/wc/store/v1`;
}

export function getRestApiBase(): string {
  return `${getStoreUrl()}/wp-json/wc/v3`;
}

export type StoreFetchResult<T> = {
  data: T;
  cartToken: string | null;
  nonce: string | null;
};

export type StoreFetchOptions = {
  method?: string;
  body?: unknown;
  cartToken?: string | null;
  nonce?: string | null;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  headers?: HeadersInit;
};

export async function storeFetch<T>(
  path: string,
  options: StoreFetchOptions = {}
): Promise<StoreFetchResult<T>> {
  const {
    method = "GET",
    body,
    cartToken,
    nonce,
    cache,
    next,
    headers: extraHeaders,
  } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(extraHeaders as Record<string, string>),
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }
  if (nonce) {
    headers["Nonce"] = nonce;
  }

  const res = await fetch(`${getStoreApiBase()}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache,
    next,
  });

  const newCartToken =
    res.headers.get("Cart-Token") ||
    res.headers.get("cart-token") ||
    cartToken ||
    null;
  const newNonce =
    res.headers.get("Nonce") || res.headers.get("nonce") || nonce || null;

  if (!res.ok) {
    let message = `Store API ${res.status}`;
    try {
      const err = await res.json();
      message =
        err?.message ||
        err?.data?.message ||
        (Array.isArray(err) ? err.map((e) => e.message).join(", ") : message);
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return { data: null as T, cartToken: newCartToken, nonce: newNonce };
  }

  const data = (await res.json()) as T;
  return { data, cartToken: newCartToken, nonce: newNonce };
}

export async function restFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; next?: NextFetchRequestConfig } = {}
): Promise<T> {
  const key = process.env.WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET;
  if (!key || !secret) {
    throw new Error("WC_CONSUMER_KEY and WC_CONSUMER_SECRET are required");
  }

  const auth = Buffer.from(`${key}:${secret}`).toString("base64");
  const res = await fetch(`${getRestApiBase()}${path}`, {
    method: options.method || "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${auth}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    next: options.next,
  });

  if (!res.ok) {
    throw new Error(`Woo REST API ${res.status}`);
  }
  return res.json() as Promise<T>;
}
