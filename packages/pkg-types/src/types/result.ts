/**
 * Kontrak `Result` — cara eksplisit menangani sukses/gagal tanpa exception.
 *
 * Implementasi runtime-nya (Ok/Err constructor, map, flatMap, dll.) ada di
 * `@runezone/rune-utils` (Layer 1). Modul ini hanya mendefinisikan kontrak
 * tipenya agar bisa dipakai di seluruh package tanpa dependency.
 */

/** Side sukses dari sebuah `Result`. */
export interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}

/** Side gagal dari sebuah `Result`. */
export interface Err<E> {
  readonly ok: false;
  readonly error: E;
}

/**
 * Discriminated union `Ok<T> | Err<E>`.
 *
 * - `E` default ke `unknown` agar hasil dari blok `catch` tetap type-safe.
 */
export type Result<T, E = unknown> = Ok<T> | Err<E>;
