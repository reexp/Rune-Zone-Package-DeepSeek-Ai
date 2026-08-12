import { ERROR_CODES } from "../constants/error-codes";
import { RuneError } from "../errors/rune-error";
import { isError, isRuneError } from "./guards";
import type { RuneErrorOptions } from "../types";

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function objectMessage(value: Record<string, unknown>, fallback: string): string {
  const message = value.message;
  return typeof message === "string" && message.length > 0 ? message : fallback;
}

/**
 * Mengubah nilai apa pun yang dilempar menjadi `RuneError`.
 *
 * - Sudah `RuneError` → dikembalikan apa adanya.
 * - `Error` native → dibungkus dengan `cause` aslinya.
 * - String/number/object lain → dibungkus dengan pesan yang aman.
 *
 * Dipakai di blok `catch` agar seluruh alur error tetap konsisten.
 *
 * @example
 * ```ts
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   throw normalizeError(error, "Gagal memproses permintaan");
 * }
 * ```
 */
export function normalizeError(
  error: unknown,
  fallbackMessage = "Unknown error",
  options: RuneErrorOptions = {},
): RuneError {
  if (isRuneError(error)) return error;

  const baseOptions: RuneErrorOptions = {
    code: options.code ?? ERROR_CODES.INTERNAL,
    ...options,
  };

  if (isError(error)) {
    return new RuneError(error.message || fallbackMessage, {
      ...baseOptions,
      cause: options.cause ?? error,
    });
  }

  if (typeof error === "string") {
    return new RuneError(error, baseOptions);
  }

  if (isObjectLike(error)) {
    return new RuneError(objectMessage(error, fallbackMessage), {
      ...baseOptions,
      cause: options.cause ?? error,
    });
  }

  if (error === undefined || error === null) {
    return new RuneError(fallbackMessage, baseOptions);
  }

  return new RuneError(String(error), baseOptions);
}

/**
 * Mengekstrak pesan error yang aman dari nilai apa pun.
 *
 * Berguna untuk logging dan menampilkan pesan ke pengguna tanpa
 * bergantung pada bentuk konkret error.
 */
export function getErrorMessage(error: unknown, fallback = "Unknown error"): string {
  if (typeof error === "string" && error.length > 0) return error;

  if (isRuneError(error) || isError(error)) {
    return error.message.length > 0 ? error.message : fallback;
  }

  if (isObjectLike(error)) {
    const message = objectMessage(error, fallback);
    if (message !== fallback) return message;
    try {
      const json = JSON.stringify(error);
      if (json !== undefined && json.length > 0 && json !== "{}") return json;
    } catch {
      // circular reference — abaikan, gunakan fallback.
    }
  }

  if (error === undefined || error === null) return fallback;

  return String(error);
}
