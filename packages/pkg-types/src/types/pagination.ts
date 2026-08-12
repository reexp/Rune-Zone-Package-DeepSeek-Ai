/**
 * Kontrak pagination — dipakai oleh repository, REST API, dan SDK client.
 * Mendukung dua model: page-based (offset) dan cursor-based (keyset).
 */

/** Arah sorting. */
export type OrderDirection = "asc" | "desc";

/** Definisi sorting berdasarkan field dari tipe `T`. */
export interface OrderBy<T> {
  readonly field: keyof T & string;
  readonly direction: OrderDirection;
}

/** Parameter pagination berbasis page/offset. */
export interface PageParams {
  readonly page: number;
  readonly pageSize: number;
}

/** Metadata hasil pagination berbasis page. */
export interface PageMeta {
  readonly page: number;
  readonly pageSize: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

/** Hasil pagination berbasis page. */
export interface Page<T> {
  readonly items: T[];
  readonly meta: PageMeta;
}

/** Parameter pagination berbasis cursor. */
export interface CursorPageParams {
  /** Opaque cursor. `null`/tidak ada = halaman pertama. */
  readonly cursor?: string | null;
  readonly limit: number;
}

/** Metadata hasil pagination berbasis cursor. */
export interface CursorPageMeta {
  /** Cursor untuk halaman berikutnya, `null` jika sudah habis. */
  readonly nextCursor: string | null;
  readonly hasMore: boolean;
  readonly totalItems?: number;
}

/** Hasil pagination berbasis cursor. */
export interface CursorPage<T> {
  readonly items: T[];
  readonly meta: CursorPageMeta;
}
