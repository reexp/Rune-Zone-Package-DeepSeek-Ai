import { DEFAULT_STATUS_BY_CODE } from "../constants/http-status";
import { isRuneError, isStandardErrorCode } from "./guards";
import type { ErrorCode } from "../types";

/**
 * Menentukan kode status HTTP untuk sebuah error.
 *
 * Prioritas:
 * 1. `status` eksplisit pada `RuneError`.
 * 2. Pemetaan `code` standar → status (`DEFAULT_STATUS_BY_CODE`).
 * 3. `fallback` (default 500).
 *
 * @example
 * ```ts
 * const status = toHttpStatus(err); // 404 untuk NotFoundError
 * return NextResponse.json({ error: serializeError(err) }, { status });
 * ```
 */
export function toHttpStatus(error: unknown, fallback = 500): number {
  if (isRuneError(error)) {
    if (error.status !== undefined) return error.status;
    return codeToHttpStatus(error.code, fallback);
  }
  return fallback;
}

/**
 * Menentukan kode status HTTP untuk sebuah `ErrorCode`.
 */
export function codeToHttpStatus(code: ErrorCode, fallback = 500): number {
  if (!isStandardErrorCode(code)) return fallback;
  return DEFAULT_STATUS_BY_CODE[code] ?? fallback;
}
