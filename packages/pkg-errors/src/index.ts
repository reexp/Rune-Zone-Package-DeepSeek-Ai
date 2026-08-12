/**
 * @runezone/rune-errors — Typed error layer untuk seluruh ekosistem RuneZone.
 *
 * Layer 1 — bergantung pada `@runezone/rune-types` saja.
 *
 * Menyediakan:
 * - Kelas dasar `RuneError` + 14 kelas error bertipe (404, 401, 429, dll.)
 * - Kode error standar & pemetaan ke status HTTP
 * - Serialisasi/deserialisasi untuk API, worker, dan logging
 * - Normalisasi error (catch apa pun → RuneError)
 */

// Types
export type {
  ErrorCode,
  FieldErrors,
  RuneErrorOptions,
  SerializedError,
  SerializeErrorOptions,
  StandardErrorCode,
} from "./types";

// Constants
export { ERROR_CODES, STANDARD_ERROR_CODES } from "./constants/error-codes";
export { DEFAULT_STATUS_BY_CODE } from "./constants/http-status";

// Errors
export { RuneError } from "./errors/rune-error";
export {
  AuthenticationError,
  AuthorizationError,
  CancelledError,
  ConfigurationError,
  ConflictError,
  DatabaseError,
  ERROR_CLASS_BY_NAME,
  ERROR_CODE_BY_CLASS,
  InternalError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  StorageError,
  TimeoutError,
  UnsupportedError,
  ValidationError,
} from "./errors/typed-errors";
export type { ErrorClass, RuneErrorBaseOptions, ValidationErrorOptions, RateLimitErrorOptions } from "./errors/typed-errors";

// Helpers
export { getErrorMessage, normalizeError } from "./helpers/normalize";
export { deserializeError, serializeError } from "./helpers/serialize";
export { codeToHttpStatus, toHttpStatus } from "./helpers/http-status";
export {
  isError,
  isErrorCode,
  isFieldErrors,
  isRuneError,
  isSerializedError,
  isStandardErrorCode,
} from "./helpers/guards";
