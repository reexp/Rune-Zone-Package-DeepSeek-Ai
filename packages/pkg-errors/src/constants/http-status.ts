import { ERROR_CODES } from "./error-codes";
import type { StandardErrorCode } from "../types";

/**
 * Pemetaan error code standar → kode status HTTP yang disarankan.
 *
 * Digunakan oleh `toHttpStatus`/`codeToHttpStatus` ketika sebuah error
 * tidak menyimpan `status` eksplisit.
 */
export const DEFAULT_STATUS_BY_CODE: Readonly<Record<StandardErrorCode, number>> = {
  [ERROR_CODES.UNKNOWN]: 500,
  [ERROR_CODES.INTERNAL]: 500,
  [ERROR_CODES.CONFIGURATION]: 500,
  [ERROR_CODES.VALIDATION]: 400,
  [ERROR_CODES.AUTHENTICATION]: 401,
  [ERROR_CODES.AUTHORIZATION]: 403,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.CONFLICT]: 409,
  [ERROR_CODES.RATE_LIMIT]: 429,
  [ERROR_CODES.TIMEOUT]: 504,
  [ERROR_CODES.NETWORK]: 502,
  [ERROR_CODES.STORAGE]: 500,
  [ERROR_CODES.DATABASE]: 500,
  [ERROR_CODES.UNSUPPORTED]: 501,
  [ERROR_CODES.CANCELLED]: 499,
};
