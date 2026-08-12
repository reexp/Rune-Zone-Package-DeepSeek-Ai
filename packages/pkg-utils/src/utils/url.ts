/** Nilai yang boleh dipakai sebagai parameter query. */
export type QueryValue = string | number | boolean | null | undefined;

/** Peta parameter query. */
export type QueryParams = Record<string, QueryValue | ReadonlyArray<QueryValue>>;

/**
 * Bangun query string dari parameter (diawali `?`).
 * Nilai `null`/`undefined` dilewati; array menjadi parameter berulang.
 *
 * @example
 * buildQuery({ page: 1, tags: ["a", "b"] }) // "?page=1&tags=a&tags=b"
 */
export function buildQuery(params: QueryParams): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) {
      if (item === undefined || item === null) continue;
      search.append(key, String(item));
    }
  }
  const result = search.toString();
  return result ? `?${result}` : "";
}

/**
 * Parse query string menjadi objek.
 * Parameter yang muncul lebih dari sekali menjadi array.
 */
export function parseQuery(search: string | URLSearchParams): Record<string, string | string[]> {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const out: Record<string, string | string[]> = {};
  for (const [key, value] of params.entries()) {
    const existing = out[key];
    if (Array.isArray(existing)) {
      existing.push(value);
    } else if (existing !== undefined) {
      out[key] = [existing, value];
    } else {
      out[key] = value;
    }
  }
  return out;
}

/**
 * Tambahkan parameter query ke URL, pertahankan query dan hash yang ada.
 */
export function withQuery(url: string, params: QueryParams): string {
  const hashIndex = url.indexOf("#");
  const hash = hashIndex === -1 ? "" : url.slice(hashIndex);
  const withoutHash = hashIndex === -1 ? url : url.slice(0, hashIndex);

  const queryIndex = withoutHash.indexOf("?");
  const base = queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex);
  const existing = queryIndex === -1 ? "" : withoutHash.slice(queryIndex + 1);

  const merged = new URLSearchParams(existing);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const values = Array.isArray(value) ? value : [value];
    merged.delete(key);
    for (const item of values) {
      if (item === undefined || item === null) continue;
      merged.append(key, String(item));
    }
  }
  const queryString = merged.toString();
  return `${base}${queryString ? `?${queryString}` : ""}${hash}`;
}

/** `true` jika URL absolut (memiliki protokol). */
export function isAbsoluteUrl(value: string): boolean {
  try {
    return new URL(value).protocol.length > 1;
  } catch {
    return false;
  }
}

/** `true` jika URL valid dengan protokol http/https. */
export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Gabungkan beberapa segmen path menjadi satu URL/string aman.
 *
 * @example
 * joinUrl("https://api.example.com", "/v1/", "users") // "https://api.example.com/v1/users"
 */
export function joinUrl(...parts: string[]): string {
  return parts
    .map((part, index) => (index === 0 ? part.replace(/\/+$/, "") : part.replace(/^\/+|\/+$/g, "")))
    .filter(Boolean)
    .join("/");
}

/** Parse URL; mengembalikan `null` jika tidak valid. */
export function parseUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

/** Ambil pathname dari URL (tanpa query/hash). */
export function getPathname(value: string): string | null {
  const url = parseUrl(value);
  return url?.pathname ?? null;
}

/** Ambil origin (protocol + host). */
export function getOrigin(value: string): string | null {
  const url = parseUrl(value);
  return url?.origin ?? null;
}
