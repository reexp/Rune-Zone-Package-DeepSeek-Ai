import { STANDARD_ERROR_CODES } from "../constants/error-codes";
import { RuneError } from "../errors/rune-error";
import type { ErrorCode, FieldErrors, SerializedError, StandardErrorCode } from "../types";

const STANDARD_ERROR_CODE_SET = new Set<string>(STANDARD_ERROR_CODES);

/**
 * True jika `value` adalah `RuneError` (termasuk turunannya).
 *
 * Mengecek `instanceof` terlebih dahulu, lalu fallback ke brand runtime
 * `isRuneError === true` agar tetap akurat saat ada dua salinan library.
 */
export function isRuneError(value: unknown): value is RuneError {
  if (value instanceof RuneError) return true;
  if (typeof value !== "object" || value === null) return false;
  return (value as { readonly isRuneError?: unknown }).isRuneError === true;
}

/**
 * True jika `value` menyerupai `Error` native (punya `name` + `message`).
 */
export function isError(value: unknown): value is Error {
  if (value instanceof Error) return true;
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.name === "string" && typeof candidate.message === "string";
}

/**
 * True jika `value` adalah `ErrorCode` — praktisnya string non-kosong.
 */
export function isErrorCode(value: unknown): value is ErrorCode {
  return typeof value === "string" && value.length > 0;
}

/**
 * True jika `value` adalah salah satu kode error standar RuneZone.
 */
export function isStandardErrorCode(value: unknown): value is StandardErrorCode {
  return typeof value === "string" && STANDARD_ERROR_CODE_SET.has(value);
}

/**
 * True jika `value` berbentuk `SerializedError` yang valid
 * (memiliki `name`, `message`, dan `code` string non-kosong).
 */
export function isSerializedError(value: unknown): value is SerializedError {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.name === "string" &&
    typeof candidate.message === "string" &&
    typeof candidate.code === "string" &&
    candidate.code.length > 0
  );
}

/**
 * True jika `value` berbentuk `FieldErrors`:
 * record dengan nilai `undefined` atau array berisi string.
 */
export function isFieldErrors(value: unknown): value is FieldErrors {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  return Object.values(value).every((item) => {
    if (item === undefined) return true;
    return Array.isArray(item) && item.every((entry) => typeof entry === "string");
  });
}
