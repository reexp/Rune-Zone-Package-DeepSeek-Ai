import { ERROR_CODES } from "../constants/error-codes";
import { isFieldErrors } from "../helpers/guards";
import { RuneError } from "./rune-error";
import type { ErrorCode, FieldErrors, RuneErrorOptions } from "../types";

/** Opsi bersama untuk kelas error turunan (tanpa `code`/`name`). */
export type RuneErrorBaseOptions = Omit<RuneErrorOptions, "code" | "name">;

/**
 * Error untuk kegagalan internal yang tidak terduga.
 *
 * Biasanya dihasilkan oleh `normalizeError()` saat nilai yang dilempar
 * bukan `RuneError` dan tidak diketahui asalnya.
 */
export class InternalError extends RuneError {
  constructor(message = "Internal error", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.INTERNAL,
      name: "InternalError",
      status: options.status ?? 500,
    });
  }
}

/** Error untuk masalah konfigurasi (env salah, schema tidak valid, dll.). */
export class ConfigurationError extends RuneError {
  constructor(message = "Configuration error", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.CONFIGURATION,
      name: "ConfigurationError",
      status: options.status ?? 500,
    });
  }
}

/** Opsi tambahan untuk `ValidationError`. */
export interface ValidationErrorOptions extends RuneErrorBaseOptions {
  /** Field error per-kolom — disimpan ke `details.fieldErrors`. */
  fieldErrors?: FieldErrors;
}

/**
 * Error untuk input yang gagal validasi.
 *
 * Menyimpan `fieldErrors` (map field → daftar pesan) agar klien dapat
 * menampilkan pesan per input tanpa parsing teks bebas.
 *
 * @example
 * ```ts
 * throw new ValidationError("Data tidak valid", {
 *   fieldErrors: { email: ["Format email salah"], password: ["Minimal 8 karakter"] },
 * });
 * ```
 */
export class ValidationError extends RuneError {
  constructor(message = "Validation failed", options: ValidationErrorOptions = {}) {
    const { fieldErrors, ...rest } = options;
    const details: Record<string, unknown> = { ...rest.details };
    if (fieldErrors !== undefined) {
      details.fieldErrors = fieldErrors;
    }
    super(message, {
      ...rest,
      code: ERROR_CODES.VALIDATION,
      name: "ValidationError",
      status: rest.status ?? 400,
      details,
    });
  }

  /** Field error per-kolom (dibaca dari `details.fieldErrors`). */
  get fieldErrors(): FieldErrors | undefined {
    const value = this.details?.fieldErrors;
    return isFieldErrors(value) ? value : undefined;
  }
}

/** Error untuk autentikasi gagal (token invalid, kredensial salah). */
export class AuthenticationError extends RuneError {
  constructor(message = "Authentication failed", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.AUTHENTICATION,
      name: "AuthenticationError",
      status: options.status ?? 401,
    });
  }
}

/** Error untuk otorisasi ditolak (403). */
export class AuthorizationError extends RuneError {
  constructor(message = "Access denied", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.AUTHORIZATION,
      name: "AuthorizationError",
      status: options.status ?? 403,
    });
  }
}

/** Error untuk resource yang tidak ditemukan (404). */
export class NotFoundError extends RuneError {
  constructor(message = "Resource not found", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.NOT_FOUND,
      name: "NotFoundError",
      status: options.status ?? 404,
    });
  }
}

/** Error untuk konflik data (mis. unique constraint, 409). */
export class ConflictError extends RuneError {
  constructor(message = "Resource conflict", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.CONFLICT,
      name: "ConflictError",
      status: options.status ?? 409,
    });
  }
}

/** Opsi tambahan untuk `RateLimitError`. */
export interface RateLimitErrorOptions extends RuneErrorBaseOptions {
  /** Waktu tunggu yang disarankan dalam detik (semenanti `Retry-After`). */
  retryAfter?: number;
}

/** Error untuk rate limit terlampaui (429). */
export class RateLimitError extends RuneError {
  constructor(message = "Rate limit exceeded", options: RateLimitErrorOptions = {}) {
    const { retryAfter, ...rest } = options;
    const details: Record<string, unknown> = { ...rest.details };
    if (retryAfter !== undefined) {
      details.retryAfter = retryAfter;
    }
    super(message, {
      ...rest,
      code: ERROR_CODES.RATE_LIMIT,
      name: "RateLimitError",
      status: rest.status ?? 429,
      details,
    });
  }

  /** Waktu tunggu yang disarankan dalam detik (dibaca dari `details.retryAfter`). */
  get retryAfter(): number | undefined {
    const value = this.details?.retryAfter;
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
  }
}

/** Error untuk operasi yang melewati batas waktu (504). */
export class TimeoutError extends RuneError {
  constructor(message = "Operation timed out", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.TIMEOUT,
      name: "TimeoutError",
      status: options.status ?? 504,
    });
  }
}

/** Error untuk kegagalan jaringan (502). */
export class NetworkError extends RuneError {
  constructor(message = "Network error", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.NETWORK,
      name: "NetworkError",
      status: options.status ?? 502,
    });
  }
}

/** Error untuk kegagalan storage (Supabase, R2, disk, dll.). */
export class StorageError extends RuneError {
  constructor(message = "Storage error", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.STORAGE,
      name: "StorageError",
      status: options.status ?? 500,
    });
  }
}

/** Error untuk kegagalan database (Drizzle/Prisma/Supabase). */
export class DatabaseError extends RuneError {
  constructor(message = "Database error", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.DATABASE,
      name: "DatabaseError",
      status: options.status ?? 500,
    });
  }
}

/** Error untuk fitur yang belum didukung/diimplementasikan (501). */
export class UnsupportedError extends RuneError {
  constructor(message = "Unsupported operation", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.UNSUPPORTED,
      name: "UnsupportedError",
      status: options.status ?? 501,
    });
  }
}

/** Error untuk operasi yang dibatalkan (client/worker). */
export class CancelledError extends RuneError {
  constructor(message = "Operation cancelled", options: RuneErrorBaseOptions = {}) {
    super(message, {
      ...options,
      code: ERROR_CODES.CANCELLED,
      name: "CancelledError",
      status: options.status ?? 499,
    });
  }
}

/** Konstruktor error generik untuk registry deserialisasi. */
export type ErrorClass = new (message?: string, options?: RuneErrorOptions) => RuneError;

/**
 * Registry nama kelas → kelas error.
 *
 * Dipakai `deserializeError()` untuk merekonstruksi kelas error asli
 * dari bentuk hasil serialisasi.
 */
export const ERROR_CLASS_BY_NAME: Readonly<Record<string, ErrorClass>> = {
  RuneError,
  InternalError,
  ConfigurationError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  TimeoutError,
  NetworkError,
  StorageError,
  DatabaseError,
  UnsupportedError,
  CancelledError,
};

/** Kode error default per kelas — berguna untuk dokumentasi/introspeksi. */
export const ERROR_CODE_BY_CLASS: Readonly<Record<string, ErrorCode>> = {
  RuneError: ERROR_CODES.UNKNOWN,
  InternalError: ERROR_CODES.INTERNAL,
  ConfigurationError: ERROR_CODES.CONFIGURATION,
  ValidationError: ERROR_CODES.VALIDATION,
  AuthenticationError: ERROR_CODES.AUTHENTICATION,
  AuthorizationError: ERROR_CODES.AUTHORIZATION,
  NotFoundError: ERROR_CODES.NOT_FOUND,
  ConflictError: ERROR_CODES.CONFLICT,
  RateLimitError: ERROR_CODES.RATE_LIMIT,
  TimeoutError: ERROR_CODES.TIMEOUT,
  NetworkError: ERROR_CODES.NETWORK,
  StorageError: ERROR_CODES.STORAGE,
  DatabaseError: ERROR_CODES.DATABASE,
  UnsupportedError: ERROR_CODES.UNSUPPORTED,
  CancelledError: ERROR_CODES.CANCELLED,
};
