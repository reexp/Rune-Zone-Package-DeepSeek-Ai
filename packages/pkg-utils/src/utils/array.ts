import type { SortOrder } from "../types";

/**
 * Pecah array menjadi potongan-potongan berukuran `size`.
 */
export function chunk<T>(array: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError("size must be a positive integer");
  }
  const out: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    out.push(array.slice(i, i + size));
  }
  return out;
}

/** Hapus duplikat berdasarkan identitas. */
export function unique<T>(array: readonly T[]): T[] {
  return [...new Set(array)];
}

/** Hapus duplikat berdasarkan kunci yang dihasilkan `keyFn`. */
export function uniqueBy<T>(array: readonly T[], keyFn: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  const out: T[] = [];
  for (const item of array) {
    const key = keyFn(item);
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

/** Buang semua nilai falsy. */
export function compact<T>(array: readonly T[]): NonNullable<T>[] {
  return array.filter((item): item is NonNullable<T> => Boolean(item));
}

/** Item di `a` yang tidak ada di `b` (berdasarkan identitas). */
export function difference<T>(a: readonly T[], b: readonly T[]): T[] {
  const set = new Set(b);
  return a.filter((item) => !set.has(item));
}

/** Item yang ada di `a` sekaligus di `b`. */
export function intersection<T>(a: readonly T[], b: readonly T[]): T[] {
  const set = new Set(b);
  return a.filter((item) => set.has(item));
}

/** Gabungan dua array tanpa duplikat. */
export function union<T>(a: readonly T[], b: readonly T[]): T[] {
  return unique([...a, ...b]);
}

/** Salin array dengan urutan acak (Fisher–Yates). */
export function shuffle<T>(array: readonly T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j] as T, copy[i] as T];
  }
  return copy;
}

/**
 * Urutkan array secara stabil berdasarkan satu atau lebih selector.
 *
 * @example
 * sortBy(users, [(u) => u.name, (u) => u.age], "desc")
 */
export function sortBy<T>(
  array: readonly T[],
  selectors: ((item: T) => unknown) | ReadonlyArray<(item: T) => unknown>,
  order: SortOrder = "asc",
): T[] {
  const keys = Array.isArray(selectors) ? selectors : [selectors];
  return [...array].sort((a, b) => {
    for (const selector of keys) {
      const av = selector(a);
      const bv = selector(b);
      if (av === bv) continue;
      const comparison = av < bv ? -1 : av > bv ? 1 : 0;
      return order === "asc" ? comparison : -comparison;
    }
    return 0;
  });
}

/**
 * Kelompokkan array ke `Record<string, T[]>` berdasarkan kunci dari `keyFn`.
 */
export function groupBy<T>(array: readonly T[], keyFn: (item: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of array) {
    const key = keyFn(item);
    (out[key] ??= []).push(item);
  }
  return out;
}

/** Ratakan satu level array. */
export function flatten<T>(array: ReadonlyArray<T | readonly T[]>): T[] {
  const out: T[] = [];
  for (const item of array) {
    if (Array.isArray(item)) {
      out.push(...(item as readonly T[]));
    } else {
      out.push(item as T);
    }
  }
  return out;
}

/** Elemen pertama atau `undefined`. */
export const first = <T>(array: readonly T[]): T | undefined => array[0];

/** Elemen terakhir atau `undefined`. */
export const last = <T>(array: readonly T[]): T | undefined => array[array.length - 1];

/**
 * Bangun urutan angka `[from, to)`.
 *
 * @example
 * range(3) // [0, 1, 2]
 * range(1, 5) // [1, 2, 3, 4]
 */
export function range(start: number, end?: number, step = 1): number[] {
  const from = end === undefined ? 0 : start;
  const to = end === undefined ? start : end;
  if (step === 0) throw new RangeError("step must not be zero");
  const out: number[] = [];
  if (step > 0) {
    for (let i = from; i < to; i += step) out.push(i);
  } else {
    for (let i = from; i > to; i += step) out.push(i);
  }
  return out;
}

/** Bungkus nilai tunggal menjadi array satu elemen. */
export function toArray<T>(value: T | readonly T[]): T[] {
  return Array.isArray(value) ? [...(value as readonly T[])] : [value as T];
}

/** Pisahkan array menjadi `[yang lulus, yang gagal]` predikat. */
export function partition<T>(array: readonly T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  for (const item of array) {
    (predicate(item) ? pass : fail).push(item);
  }
  return [pass, fail];
}

/** Gabungkan dua array menjadi array pasangan. */
export function zip<A, B>(a: readonly A[], b: readonly B[]): Array<[A, B]> {
  const length = Math.min(a.length, b.length);
  const out: Array<[A, B]> = [];
  for (let i = 0; i < length; i += 1) {
    out.push([a[i] as A, b[i] as B]);
  }
  return out;
}

/** Rotasi array ke kiri sebanyak `count` posisi. */
export function rotate<T>(array: readonly T[], count: number): T[] {
  if (array.length === 0) return [];
  const shift = ((count % array.length) + array.length) % array.length;
  return [...array.slice(shift), ...array.slice(0, shift)];
}

/** Ambil `count` elemen pertama. */
export function take<T>(array: readonly T[], count: number): T[] {
  return array.slice(0, Math.max(0, count));
}

/** Ambil `count` elemen terakhir. */
export function takeLast<T>(array: readonly T[], count: number): T[] {
  if (count <= 0) return [];
  return array.slice(-count);
}
