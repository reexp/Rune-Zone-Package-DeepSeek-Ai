/** Fungsi identitas: mengembalikan argumen apa adanya. */
export const identity = <T>(value: T): T => value;

/** Fungsi kosong yang tidak melakukan apa pun. */
export const noop = (): void => {};

/** Fungsi yang selalu mengembalikan nilai tetap. */
export const constant =
  <T>(value: T): (() => T) =>
  () =>
    value;

/** Opsi untuk {@link memoize}. */
export interface MemoizeOptions<T extends (...args: never[]) => unknown> {
  /** Ukuran cache maksimum (LRU sederhana). Default 1000. */
  maxSize?: number;
  /** Fungsi penentu kunci cache dari argumen. Default `JSON.stringify`. */
  resolver?: (args: Parameters<T>) => string;
}

/** Hasil {@link memoize} — fungsi plus kontrol cache. */
export interface MemoizedFunction<T extends (...args: never[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T>;
  /** Kosongkan cache. */
  clear(): void;
}

/**
 * Memoize hasil fungsi berdasarkan argumen.
 *
 * @example
 * const fib = memoize((n: number) => n < 2 ? n : fib(n - 1) + fib(n - 2));
 */
export function memoize<T extends (...args: never[]) => unknown>(
  fn: T,
  options: MemoizeOptions<T> = {},
): MemoizedFunction<T> {
  const { maxSize = 1000, resolver } = options;
  const cache = new Map<string, ReturnType<T>>();
  const getKey = resolver ?? ((args: unknown[]) => JSON.stringify(args));

  const memoized = ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey(args);
    const cached = cache.get(key);
    if (cached !== undefined) return cached;

    const result = fn(...args) as ReturnType<T>;
    if (cache.size >= maxSize) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    cache.set(key, result);
    return result;
  }) as MemoizedFunction<T>;

  memoized.clear = () => {
    cache.clear();
  };
  return memoized;
}

/**
 * Jalankan fungsi hanya sekali; pemanggilan berikutnya
 * mengembalikan hasil pemanggilan pertama.
 */
export function once<T extends (...args: never[]) => unknown>(
  fn: T,
): (...args: Parameters<T>) => ReturnType<T> {
  let called = false;
  let result: ReturnType<T> | undefined;
  return (...args: Parameters<T>): ReturnType<T> => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<T>;
    }
    return result as ReturnType<T>;
  };
}

/**
 * Pipelining kiri-ke-kanan: `pipe(x, f, g)` = `g(f(x))`.
 */
export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, fn1: (value: A) => B): B;
export function pipe<A, B, C>(value: A, fn1: (value: A) => B, fn2: (value: B) => C): C;
export function pipe<A, B, C, D>(
  value: A,
  fn1: (value: A) => B,
  fn2: (value: B) => C,
  fn3: (value: C) => D,
): D;
export function pipe(value: unknown, ...fns: Array<(value: unknown) => unknown>): unknown {
  return fns.reduce((acc, fn) => fn(acc), value);
}

/**
 * Komposisi kanan-ke-kiri: `compose(f, g)(x)` = `f(g(x))`.
 */
export function compose<A, B>(fn: (value: A) => B): (value: A) => B;
export function compose<A, B, C>(fn2: (value: B) => C, fn1: (value: A) => B): (value: A) => C;
export function compose<A, B, C, D>(
  fn3: (value: C) => D,
  fn2: (value: B) => C,
  fn1: (value: A) => B,
): (value: A) => D;
export function compose(...fns: Array<(value: unknown) => unknown>): (value: unknown) => unknown {
  return (value: unknown) => fns.reduceRight((acc, fn) => fn(acc), value);
}
