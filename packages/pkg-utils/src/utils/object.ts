import { isPlainObject } from "../helpers/guards";
import type { PathLike } from "../types";

/** Kunci yang dilarang untuk mencegah prototype pollution. */
const PROTECTED_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Gabungkan beberapa objek secara mendalam (deep merge) tanpa memutasi argumen.
 * - Objek plain digabung secara rekursif.
 * - Nilai lain (termasuk array) diganti oleh nilai dari source terakhir.
 * - Kunci berbahaya (`__proto__`, `constructor`, `prototype`) diabaikan.
 *
 * @param target Objek dasar.
 * @param sources Objek yang di-overlay ke `target`.
 */
export function deepMerge<T extends object, U extends object>(target: T, source: U): T & U;
export function deepMerge<T extends object>(
  target: T,
  ...sources: Array<object | null | undefined>
): T;
export function deepMerge<T extends object>(
  target: T,
  ...sources: Array<object | null | undefined>
): T {
  let result: unknown = { ...target };
  for (const source of sources) {
    if (source == null) continue;
    result = mergeValues(result, source);
  }
  return result as T;
}

/** Implementasi rekursif dua nilai. */
function mergeValues(base: unknown, override: unknown): unknown {
  if (isPlainObject(base) && isPlainObject(override)) {
    const out: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(override)) {
      if (PROTECTED_KEYS.has(key)) continue;
      out[key] = hasOwnSafe(base, key) ? mergeValues(base[key], value) : value;
    }
    return out;
  }
  return override;
}

/** `hasOwn` tanpa melempar untuk nilai non-objek. */
function hasOwnSafe(object: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(object, key);
}

/**
 * Salin objek dengan hanya properti yang ada di daftar `keys`.
 */
export function pick<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = object[key];
    }
  }
  return result;
}

/**
 * Salin objek tanpa properti yang ada di daftar `keys`.
 */
export function omit<T extends object, K extends keyof T>(
  object: T,
  keys: readonly K[],
): Omit<T, K> {
  const omitted = new Set<string>(keys as readonly string[]);
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(object)) {
    if (!omitted.has(key)) result[key] = value;
  }
  return result as Omit<T, K>;
}

/**
 * Pilih properti berdasarkan predikat.
 */
export function pickBy<T extends object>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(object)) {
    if (predicate(value as T[keyof T], key as keyof T)) {
      result[key] = value;
    }
  }
  return result as Partial<T>;
}

/**
 * Buang properti berdasarkan predikat (kebalikan `pickBy`).
 */
export function omitBy<T extends object>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): Partial<T> {
  return pickBy(object, (value, key) => !predicate(value, key));
}

/**
 * Terapkan `mapper` ke setiap nilai, pertahankan struktur kunci.
 */
export function mapValues<T extends object, R>(
  object: T,
  mapper: (value: T[keyof T], key: keyof T) => R,
): { [K in keyof T]: R } {
  const result = {} as { [K in keyof T]: R };
  for (const [key, value] of Object.entries(object)) {
    (result as Record<string, R>)[key] = mapper(value as T[keyof T], key as keyof T);
  }
  return result;
}

/**
 * Ubah kunci objek menggunakan `mapper` per kunci.
 */
export function mapKeys<T extends object>(
  object: T,
  mapper: (key: keyof T) => string,
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};
  for (const [key, value] of Object.entries(object)) {
    result[mapper(key as keyof T)] = value as T[keyof T];
  }
  return result;
}

/**
 * Salin nilai secara mendalam menggunakan `structuredClone`
 * (fallback JSON untuk runtime lama).
 */
export function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") return structuredClone(value);
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Pecah `PathLike` menjadi array kunci bertipe `string | number`. */
export function parsePath(path: PathLike): Array<string | number> {
  if (Array.isArray(path)) return [...path];
  return String(path)
    .split(".")
    .map((part) => {
      const numeric = Number(part);
      return /^\d+$/.test(part) ? numeric : part;
    });
}

/**
 * Baca nilai pada path. Mengembalikan `fallback` jika tidak ditemukan.
 *
 * @example
 * get({ a: { b: 1 } }, "a.b") // 1
 */
export function get<T = unknown>(object: unknown, path: PathLike, fallback?: T): T | undefined {
  let current: unknown = object;
  for (const key of parsePath(path)) {
    if (current == null) return fallback;
    current = (current as Record<string | number, unknown>)[key];
  }
  return (current === undefined ? fallback : current) as T | undefined;
}

/**
 * Buat objek baru dengan nilai pada `path` diubah (immutable).
 * Objek asli tidak dimutasi.
 *
 * @example
 * set({ a: { b: 1 } }, "a.b", 2) // { a: { b: 2 } }
 */
export function set<T extends object>(object: T, path: PathLike, value: unknown): T {
  const keys = parsePath(path);
  const firstKey = keys[0];
  if (firstKey === undefined) return object;

  const clone = (Array.isArray(object) ? [...(object as unknown[])] : { ...object }) as T;

  if (keys.length === 1) {
    (clone as Record<string | number, unknown>)[firstKey] = value;
    return clone;
  }

  const rest = keys.slice(1);
  const current = (clone as Record<string | number, unknown>)[firstKey];
  const nextContainer: object =
    isPlainObject(current) || Array.isArray(current)
      ? (current as object)
      : typeof rest[0] === "number"
        ? []
        : {};

  (clone as Record<string | number, unknown>)[firstKey] = set(nextContainer, rest, value);
  return clone;
}

/** Perbandingan dalam (deep equality) untuk nilai apa pun. */
export function isEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((key) =>
      isEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]),
    );
  }

  return false;
}

/**
 * Bungkus objek ke `Object.entries` bertipe aman.
 */
export function entries<T extends object>(object: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(object) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Bangun objek dari daftar `[kunci, nilai]` bertipe aman.
 */
export function fromEntries<T>(
  entriesInput: ReadonlyArray<readonly [string, T]>,
): Record<string, T> {
  return Object.fromEntries(entriesInput) as Record<string, T>;
}

/** Bekukan objek secara dalam (deep freeze). */
export function deepFreeze<T>(object: T): Readonly<T> {
  if (object !== null && typeof object === "object" && !Object.isFrozen(object)) {
    Object.freeze(object);
    for (const value of Object.values(object as Record<string, unknown>)) {
      if (value !== null && typeof value === "object") deepFreeze(value);
    }
  }
  return object as Readonly<T>;
}
