import type { UnknownRecord } from "@runezone/rune-types";

/**
 * Error codes standar RuneZone.
 *
 * Union tipe tertutup dari kode yang dikenal, diperluas dengan
 * `(string & {})` sehingga package lain boleh mendefinisikan kode
 * khusus (mis. `"STRIPE_WEBHOOK_SIGNATURE"`) tanpa kehilangan autocomplete.
 */
export type StandardErrorCode =
  | "UNKNOWN"
  | "INTERNAL"
  | "CONFIGURATION"
  | "VALIDATION"
  | "AUTHENTICATION"
  | "AUTHORIZATION"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMIT"
  | "TIMEOUT"
  | "NETWORK"
  | "STORAGE"
  | "DATABASE"
  | "UNSUPPORTED"
  | "CANCELLED";

/** Error code apapun: standar atau ekstensi kustom. */
export type ErrorCode = StandardErrorCode | (string & {});

/** Opsi konstruksi `RuneError`. */
export interface RuneErrorOptions {
  /** Error code. Default: `"UNKNOWN"`. */
  code?: ErrorCode;
  /** Penyebab asli — disimpan di `Error.cause` (ES2022). */
  cause?: unknown;
  /** Metadata tambahan yang aman untuk diekspos ke klien/API. */
  details?: UnknownRecord;
  /** Kode status HTTP yang disarankan (dipakai Route Handler / API). */
  status?: number;
  /** Nama error (menggantikan default nama kelas). */
  name?: string;
}

/** Opsi untuk `serializeError`. */
export interface SerializeErrorOptions {
  /** Sertakan `stack` pada hasil serialisasi. Default: `true`. */
  includeStack?: boolean;
  /** Batas kedalaman rekursi `cause`. Default: `5`. */
  maxDepth?: number;
}

/**
 * Bentuk error yang sudah di-serialize — aman untuk JSON,
 * logging terstruktur, dan body respons API.
 */
export interface SerializedError {
  /** Nama kelas error (mis. `"NotFoundError"`). */
  name: string;
  /** Pesan yang bisa dibaca manusia. */
  message: string;
  /** Error code standar/kustom. */
  code: ErrorCode;
  /** Kode status HTTP yang disarankan (jika tersedia). */
  status?: number;
  /** Metadata tambahan (jika ada). */
  details?: UnknownRecord;
  /** Stack trace (jika `includeStack: true`). */
  stack?: string;
  /** Cause yang di-serialize (jika ada). */
  cause?: unknown;
}

/**
 * Field error per-kolom untuk `ValidationError`.
 *
 * Key = nama field; value = daftar pesan kesalahan untuk field tersebut.
 */
export type FieldErrors = Readonly<Record<string, readonly string[] | undefined>>;
