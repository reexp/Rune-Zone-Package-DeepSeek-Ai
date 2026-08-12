/**
 * Utilitas *type-level*: membantu menulis conditional types yang benar
 * dan memvalidasi bentuk tipe saat development (dipakai oleh test juga).
 *
 * Seluruh helper di sini murni tipe — tidak ada runtime value.
 */

/** `true` jika `T` adalah `any`. */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/** `true` jika `T` adalah `never`. */
export type IsNever<T> = [T] extends [never] ? true : false;

/** `true` jika `T` adalah `unknown` (dan bukan `any`). */
export type IsUnknown<T> = IsAny<T> extends true ? false : unknown extends T ? true : false;

/** Perbandingan tipe yang benar-benar identik (termasuk union/intersection). */
export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false;

/** Negasi boolean di level tipe. */
export type Not<T extends boolean> = T extends true ? false : true;

/** AND logika di level tipe. */
export type And<A extends boolean, B extends boolean> = A extends true ? B : false;

/** OR logika di level tipe. */
export type Or<A extends boolean, B extends boolean> = A extends true ? true : B;

/** XOR logika di level tipe. */
export type Xor<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? false
    : true
  : B extends true
    ? true
    : false;

/** Conditional di level tipe: `If<true, T, F>` → `T`. */
export type If<C extends boolean, T, F> = C extends true ? T : F;

/** Union dari key seluruh member sebuah union tipe. */
export type KeysOfUnion<T> = T extends unknown ? keyof T : never;

/** Mengubah union menjadi intersection. */
export type UnionToIntersection<U> = (
  U extends unknown ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never;

/** Entri `[key, value]` dari object `T`. */
export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][];

/** Key object `T`. */
export type Keys<T> = keyof T;

/** Value object `T`. */
export type Values<T> = T[keyof T];

/** Hapus key `K` dari `T`. */
export type ExcludeKeys<T, K extends keyof T> = Omit<T, K>;

/** Pilih hanya property yang value-nya assignable ke `V`. */
export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

/** Buang property yang value-nya assignable ke `V`. */
export type OmitByValue<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

/**
 * Membutuhkan minimal satu dari key `Keys` (sisanya opsional).
 * Berguna untuk payload yang harus berisi setidaknya satu field tertentu.
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> & {
  [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
}[Keys];

/**
 * Membutuhkan tepat satu dari key `Keys` — key lain di grup yang sama
 * harus absen (dijadikan `never`).
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> & {
  [K in Keys]: Required<Pick<T, K>> & { [M in Exclude<Keys, K>]?: never };
}[Keys];

/** Key yang value-nya bersifat function (method). */
export type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: never[]) => unknown ? K : never;
}[keyof T];

/** Key yang value-nya bukan function (data murni). */
export type DataKeys<T> = Exclude<keyof T, FunctionKeys<T>>;
