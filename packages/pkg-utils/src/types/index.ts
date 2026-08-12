/**
 * Tipe utilitas milik @runezone/rune-utils.
 *
 * Tipe dasar yang sudah tersedia di @runezone/rune-types di-re-export
 * agar konsumen `rune-utils` cukup meng-import satu package. Seluruh
 * import di sini *type-only*, sehingga tidak menambah runtime payload
 * dan tetap tree-shaking friendly.
 */
import type { MaybePromise, AsyncFn, UnknownRecord, JSONValue, JSONPrimitive } from "@runezone/rune-types";

export type { MaybePromise, AsyncFn, UnknownRecord, JSONValue, JSONPrimitive };

/** Fungsi asinkron generik (alias dari `AsyncFn`). */
export type AsyncFunction<Args extends unknown[] = unknown[], R = unknown> = AsyncFn<Args, R>;

/** Predikat: menerima nilai dan mengembalikan boolean. */
export type Predicate<T> = (value: T) => boolean;

/** Comparator standar untuk `Array.prototype.sort`. */
export type Comparator<T> = (a: T, b: T) => number;

/** Objek dengan kunci string dan nilai unknown (alias `UnknownRecord`). */
export type AnyRecord = UnknownRecord;

/** Nilai primitif yang aman untuk JSON (alias `JSONPrimitive`). */
export type JsonPrimitive = JSONPrimitive;

/** Nilai JSON rekursif (alias `JSONValue`). */
export type JsonValue = JSONValue;

/** Kunci path untuk utilitas get/set (dot notation atau array). */
export type PathLike = string | ReadonlyArray<string | number>;

/** Arah urutan sortir. */
export type SortOrder = "asc" | "desc";
