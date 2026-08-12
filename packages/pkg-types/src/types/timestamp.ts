import type { Brand } from "./base";

/** Waktu dalam detik sejak Unix epoch. */
export type UnixSeconds = Brand<number, "UnixSeconds">;

/** Waktu dalam milidetik sejak Unix epoch (nilai `Date.now()`). */
export type UnixMillis = Brand<number, "UnixMillis">;

/** Durasi dalam milidetik. */
export type DurationMillis = Brand<number, "DurationMillis">;
