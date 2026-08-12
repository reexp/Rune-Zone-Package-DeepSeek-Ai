import { ERROR_CODES } from "../constants/error-codes";
import type { ErrorCode, RuneErrorOptions, SerializedError } from "../types";

/**
 * Kelas dasar seluruh error RuneZone.
 *
 * Semua error di ekosistem (CMS, API SDK, Worker, CLI, UI) mewarisi
 * kelas ini sehingga selalu membawa:
 *
 * - `code` — kode error terstandar (untuk mesin/klien).
 * - `status` — kode status HTTP yang disarankan.
 * - `details` — metadata tambahan yang aman diekspos.
 * - `cause` — penyebab asli via `Error.cause` (ES2022).
 *
 * @example
 * ```ts
 * throw new RuneError("Gagal memuat data", {
 *   code: "NOT_FOUND",
 *   status: 404,
 *   details: { resource: "post", id: "abc" },
 * });
 * ```
 */
export class RuneError extends Error {
  /** Brand runtime agar `isRuneError` tetap akurat walau ada dua salinan lib. */
  readonly isRuneError = true as const;

  /** Kode error standar/kustom. */
  readonly code: ErrorCode;

  /** Kode status HTTP yang disarankan (jika ada). */
  readonly status?: number;

  /** Metadata tambahan yang aman diekspos. */
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(message: string, options: RuneErrorOptions = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = options.name ?? "RuneError";
    this.code = options.code ?? ERROR_CODES.UNKNOWN;
    this.status = options.status;
    this.details = options.details;
  }

  /**
   * Bentuk aman untuk `JSON.stringify` / body respons API.
   *
   * Catatan: `stack` dan `cause` sengaja tidak disertakan di sini agar
   * tidak membocorkan detail internal. Gunakan `serializeError()` bila
   * membutuhkan stack + cause (untuk logging).
   */
  toJSON(): SerializedError {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      ...(this.status !== undefined ? { status: this.status } : {}),
      ...(this.details !== undefined ? { details: this.details } : {}),
    };
  }
}
