/** Tidur selama `ms` milidetik. */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/** Tipe timeout global (Node atau browser). */
type Timer = ReturnType<typeof setTimeout>;

/**
 * Batasi sebuah Promise dengan batas waktu.
 *
 * @example
 * await timeout(fetch("/api"), 5000, "Request timeout")
 */
export async function timeout<T>(
  promise: Promise<T> | (() => Promise<T>),
  ms: number,
  message = "Operation timed out",
): Promise<T> {
  const target = typeof promise === "function" ? promise() : promise;
  let timer: Timer | undefined;
  try {
    return await Promise.race([
      target,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), ms);
      }),
    ]);
  } finally {
    if (timer !== undefined) clearTimeout(timer);
  }
}

/** Opsi untuk {@link retry}. */
export interface RetryOptions {
  /** Jumlah maksimum percobaan (termasuk percobaan pertama). Default 3. */
  attempts?: number;
  /**
   * Delay antar percobaan dalam ms.
   * Bisa angka tetap atau fungsi `(attempt) => ms` (attempt dimulai dari 0).
   */
  delay?: number | ((attempt: number) => number);
  /** Strategi backoff. Default `fixed`. */
  backoff?: "fixed" | "exponential";
  /** Batas maksimum delay backoff. Default 30000. */
  maxDelay?: number;
  /** Callback ketika percobaan gagal (`attempt` dimulai dari 1). */
  onRetry?: (error: unknown, attempt: number) => void;
}

/**
 * Jalankan fungsi asinkron dengan mekanisme retry.
 */
export async function retry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const totalAttempts = Math.max(1, options.attempts ?? 3);
  const { backoff = "fixed", maxDelay = 30000, onRetry } = options;

  const resolveDelay = (attempt: number): number => {
    if (typeof options.delay === "function") return options.delay(attempt);
    if (typeof options.delay === "number") return options.delay;
    if (backoff === "exponential") {
      return Math.min(2 ** attempt * 100, maxDelay);
    }
    return 100;
  };

  let lastError: unknown;
  for (let attempt = 0; attempt < totalAttempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt === totalAttempts - 1) break;
      onRetry?.(error, attempt + 1);
      await sleep(resolveDelay(attempt));
    }
  }
  throw lastError;
}

/** Hasil {@link debounce} — fungsi plus kontrol. */
export interface DebouncedFunction<T extends (...args: never[]) => unknown> {
  (...args: Parameters<T>): void;
  /** Batalkan eksekusi yang tertunda. */
  cancel(): void;
  /** Eksekusi segera argumen terakhir yang tertunda. */
  flush(): void;
}

/**
 * Debounce: eksekusi fungsi ditunda sampai jeda `wait` ms
 * tanpa pemanggilan baru.
 */
export function debounce<T extends (...args: never[]) => unknown>(
  fn: T,
  wait = 0,
): DebouncedFunction<T> {
  let timer: Timer | undefined;
  let pendingArgs: Parameters<T> | undefined;

  const cancel = (): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    pendingArgs = undefined;
  };

  const flush = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (pendingArgs !== undefined) {
      const args = pendingArgs;
      pendingArgs = undefined;
      fn(...args);
    }
  };

  const debounced = ((...args: Parameters<T>) => {
    pendingArgs = args;
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      const argsToRun = pendingArgs;
      pendingArgs = undefined;
      if (argsToRun !== undefined) fn(...argsToRun);
    }, wait);
  }) as DebouncedFunction<T>;

  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/** Opsi untuk {@link throttle}. */
export interface ThrottleOptions {
  /** Eksekusi pada panggilan pertama. Default `true`. */
  leading?: boolean;
  /** Eksekusi trailing setelah jeda. Default `true`. */
  trailing?: boolean;
}

/** Hasil {@link throttle} — fungsi plus kontrol. */
export interface ThrottledFunction<T extends (...args: never[]) => unknown> {
  (...args: Parameters<T>): void;
  /** Batalkan eksekusi trailing yang tertunda. */
  cancel(): void;
}

/**
 * Throttle: fungsi dieksekusi paling banyak satu kali per `wait` ms.
 */
export function throttle<T extends (...args: never[]) => unknown>(
  fn: T,
  wait = 0,
  options: ThrottleOptions = {},
): ThrottledFunction<T> {
  const { leading = true, trailing = true } = options;
  let lastRun = 0;
  let timer: Timer | undefined;
  let pendingArgs: Parameters<T> | undefined;

  const invoke = (args: Parameters<T>): void => {
    fn(...args);
    lastRun = Date.now();
  };

  const throttled = ((...args: Parameters<T>) => {
    pendingArgs = args;
    const now = Date.now();
    const remaining = wait - (now - lastRun);

    if (remaining <= 0) {
      if (timer !== undefined) {
        clearTimeout(timer);
        timer = undefined;
      }
      const argsToRun = pendingArgs;
      pendingArgs = undefined;
      if (argsToRun !== undefined) invoke(argsToRun);
      return;
    }

    if (leading && lastRun === 0) {
      const argsToRun = pendingArgs;
      pendingArgs = undefined;
      if (argsToRun !== undefined) invoke(argsToRun);
      return;
    }

    if (trailing && timer === undefined) {
      timer = setTimeout(() => {
        timer = undefined;
        const argsToRun = pendingArgs;
        pendingArgs = undefined;
        if (argsToRun !== undefined) invoke(argsToRun);
      }, remaining);
    }
  }) as ThrottledFunction<T>;

  throttled.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    pendingArgs = undefined;
  };
  return throttled;
}

/**
 * Batasi konkurensi: fungsi yang dikembalikan menjalankan `fn`
 * dengan maksimal `concurrency` Promise aktif.
 */
export function pLimit(concurrency: number): <T>(fn: () => Promise<T>) => Promise<T> {
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError("concurrency must be a positive integer");
  }
  let active = 0;
  const queue: Array<() => void> = [];

  const next = (): void => {
    active -= 1;
    queue.shift()?.();
  };

  const run = async <T>(fn: () => Promise<T>): Promise<T> => {
    if (active >= concurrency) {
      await new Promise<void>((resolve) => {
        queue.push(resolve);
      });
    }
    active += 1;
    try {
      return await fn();
    } finally {
      next();
    }
  };

  return run;
}

/**
 * Jalankan mapper pada seluruh item dengan konkurensi terbatas.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  mapper: (item: T, index: number) => Promise<R> | R,
  concurrency = items.length,
): Promise<R[]> {
  const limit = pLimit(Math.max(1, concurrency));
  return Promise.all(items.map((item, index) => limit(async () => mapper(item, index))));
}

/** `true` jika argumen adalah PromiseLike. */
export const isPromiseLike = (value: unknown): value is PromiseLike<unknown> =>
  value !== null &&
  (typeof value === "object" || typeof value === "function") &&
  typeof (value as { then?: unknown }).then === "function";

/**
 * Normalisasi nilai menjadi Promise.
 */
export const toPromise = <T>(value: T | PromiseLike<T>): Promise<T> => Promise.resolve(value);
