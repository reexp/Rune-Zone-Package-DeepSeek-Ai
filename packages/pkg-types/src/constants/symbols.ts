/**
 * Injection tokens untuk Dependency Injection.
 *
 * Menggunakan `Symbol.for` (global symbol registry) agar token tetap unik
 * meskipun package di-install beberapa kali (hoisting/dedup issues).
 */

/** Prefix global untuk seluruh token DI RuneZone. */
export const DI_SYMBOL_PREFIX = "runezone:di:";

/** Token DI yang membawa tipe value yang akan di-inject. */
export type InjectionToken<T = unknown> = symbol & { readonly __runezoneToken?: T };

/**
 * Membuat injection token bertipe.
 *
 * @example
 * ```ts
 * const DB = createToken<Database>("database");
 * container.register(DB, () => new Database());
 * ```
 */
export function createToken<T = unknown>(name: string): InjectionToken<T> {
  return Symbol.for(`${DI_SYMBOL_PREFIX}${name}`) as unknown as InjectionToken<T>;
}

/**
 * Registry token inti yang dipakai bersama oleh package RuneZone.
 * Package lain boleh menambah token mereka sendiri via `createToken`.
 */
export const TOKENS = {
  Config: createToken<unknown>("config"),
  Logger: createToken<unknown>("logger"),
  Database: createToken<unknown>("database"),
  Cache: createToken<unknown>("cache"),
  Storage: createToken<unknown>("storage"),
  Queue: createToken<unknown>("queue"),
  EventBus: createToken<unknown>("event-bus"),
  AuthService: createToken<unknown>("auth-service"),
  SessionStore: createToken<unknown>("session-store"),
} as const;
