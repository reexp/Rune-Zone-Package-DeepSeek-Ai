/**
 * Tipe dasar yang dipakai oleh seluruh package RuneZone.
 *
 * Modul ini murni *type-only*: tidak ada runtime value sehingga aman
 * untuk di-tree-shake dan tidak memiliki dependency sama sekali.
 */

/** Branded type: menandai primitif dengan "brand" unik agar tidak tertukar di type system. */
export type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

/** Tipe primitif JavaScript. */
export type Primitive = string | number | boolean | bigint | symbol | null | undefined;

/** Dictionary sederhana dengan value bertipe `T`. */
export type Dict<T = unknown> = Record<string, T>;

/** Record dengan value `unknown` — aman untuk data dari luar (API, DB, env). */
export type UnknownRecord = Record<string, unknown>;

/** `T | null | undefined` — value opsional secara eksplisit. */
export type Maybe<T> = T | null | undefined;

/** `T | null`. */
export type Nullable<T> = T | null;

/** `T | undefined`. */
export type Undefinable<T> = T | undefined;

/** Value atau Promise — untuk fungsi yang bisa sinkron maupun asinkron. */
export type MaybePromise<T> = T | Promise<T>;

/** Alias untuk `MaybePromise`. */
export type Awaitable<T> = MaybePromise<T>;

/** Fungsi asinkron generik. */
export type AsyncFn<TArgs extends unknown[] = unknown[], TReturn = unknown> = (
  ...args: TArgs
) => Promise<TReturn>;

/** Fungsi sinkron generik. */
export type Fn<TArgs extends unknown[] = unknown[], TReturn = unknown> = (...args: TArgs) => TReturn;

/** Union dari seluruh value pada object `T`. */
export type ValueOf<T> = T[keyof T];

/** Object `T` dengan sebagian key `K` dijadikan opsional. */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Object `T` dengan sebagian key `K` dijadikan wajib. */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Rekursif menjadikan seluruh property opsional (array tetap berbentuk array). */
export type DeepPartial<T> = T extends readonly unknown[]
  ? T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : T
  : T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

/** Rekursif menjadikan seluruh property readonly (array tetap berbentuk array). */
export type DeepReadonly<T> = T extends readonly unknown[]
  ? T extends readonly (infer U)[]
    ? readonly DeepReadonly<U>[]
    : T
  : T extends object
    ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
    : T;

/** Array dengan minimal satu elemen. */
export type NonEmptyArray<T> = [T, ...T[]];

/** Key object yang dipersempit menjadi `string`. */
export type KeyOf<T> = keyof T & string;

/** Elemen dari array/tuple. */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/** Membuka `Promise<T>` menjadi `T`. */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

/** Tipe kelas (constructor). */
export type Class<T = object, TArgs extends unknown[] = unknown[]> = new (...args: TArgs) => T;

/** Alias untuk `Class`. */
export type Constructor<T = object, TArgs extends unknown[] = unknown[]> = Class<T, TArgs>;

/** JSON primitive. */
export type JSONPrimitive = string | number | boolean | null;

/** Nilai yang dapat di-serialize menjadi JSON. */
export type JSONValue = JSONPrimitive | JSONValue[] | { [key: string]: JSONValue };

/** String tanggal ISO 8601 yang di-brand agar tidak tertukar dengan string biasa. */
export type ISO8601String = Brand<string, "ISO8601">;

/** String UUID yang di-brand. */
export type UUID = Brand<string, "UUID">;

/** String yang tidak boleh kosong. */
export type NonEmptyString = Brand<string, "NonEmptyString">;
