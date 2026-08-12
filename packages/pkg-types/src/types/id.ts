import type { Brand } from "./base";

/**
 * Tipe ID entity. Di-brand agar tidak bisa dipertukarkan dengan string biasa
 * atau ID entity lain secara tidak sengaja.
 */
export type EntityId = Brand<string, "EntityId">;

/**
 * Prefix untuk ID yang di-generate, contoh `usr_`, `post_`, `file_`.
 * Dipakai oleh generator ID dan repository layer.
 */
export type IdPrefix = Brand<string, "IdPrefix">;

/**
 * Nama generator ID yang didukung, misalnya `nanoid` atau `cuid`.
 */
export type IdGeneratorName = "nanoid" | "cuid" | "ulid" | "uuid";
