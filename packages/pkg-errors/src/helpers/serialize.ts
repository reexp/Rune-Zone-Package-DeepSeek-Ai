import { ERROR_CODES } from "../constants/error-codes";
import { RuneError } from "../errors/rune-error";
import { ERROR_CLASS_BY_NAME } from "../errors/typed-errors";
import { isError, isRuneError, isSerializedError } from "./guards";
import type { RuneErrorOptions, SerializedError, SerializeErrorOptions } from "../types";

const DEFAULT_MAX_DEPTH = 5;

type InternalOptions = { includeStack: boolean; maxDepth: number };

/**
 * Men-serialize error menjadi plain object yang aman untuk JSON,
 * logging terstruktur, dan body respons API.
 *
 * Mendukung `RuneError`, `Error` native, dan nilai primitif. `cause`
 * di-serialize secara rekursif dengan batas kedalaman (default 5)
 * untuk mencegah siklus tak berujung.
 *
 * @example
 * ```ts
 * const serialized = serializeError(err, { includeStack: false });
 * logger.error(serialized);
 * ```
 */
export function serializeError(error: unknown, options: SerializeErrorOptions = {}): SerializedError {
  const opts: InternalOptions = {
    includeStack: options.includeStack ?? true,
    maxDepth: options.maxDepth ?? DEFAULT_MAX_DEPTH,
  };
  return serializeInternal(error, opts, 0);
}

function serializeInternal(error: unknown, opts: InternalOptions, depth: number): SerializedError {
  if (depth > opts.maxDepth) {
    return { name: "Error", message: "[maxDepth exceeded]", code: ERROR_CODES.UNKNOWN };
  }

  if (isRuneError(error)) {
    const serialized: SerializedError = {
      name: error.name,
      message: error.message,
      code: error.code,
    };
    if (error.status !== undefined) serialized.status = error.status;
    if (error.details !== undefined) serialized.details = error.details;
    if (opts.includeStack && error.stack !== undefined) serialized.stack = error.stack;
    if (error.cause !== undefined) {
      serialized.cause = serializeInternal(error.cause, opts, depth + 1);
    }
    return serialized;
  }

  if (isError(error)) {
    const serialized: SerializedError = {
      name: error.name,
      message: error.message,
      code: ERROR_CODES.UNKNOWN,
    };
    if (opts.includeStack && error.stack !== undefined) serialized.stack = error.stack;
    if (error.cause !== undefined) {
      serialized.cause = serializeInternal(error.cause, opts, depth + 1);
    }
    return serialized;
  }

  if (typeof error === "string") {
    return { name: "Error", message: error, code: ERROR_CODES.UNKNOWN };
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as Record<string, unknown>;
    const message =
      typeof candidate.message === "string" && candidate.message.length > 0
        ? candidate.message
        : describeUnknown(error);
    const serialized: SerializedError = {
      name: "Error",
      message,
      code: ERROR_CODES.UNKNOWN,
    };
    const details = toUnknownRecord(error);
    if (details !== undefined) serialized.details = details;
    return serialized;
  }

  return { name: "Error", message: stringifyPrimitive(error), code: ERROR_CODES.UNKNOWN };
}

/**
 * Membalik hasil `serializeError()` menjadi instance `RuneError`
 * (atau kelas turunannya, berdasarkan field `name`).
 *
 * @throws {TypeError} bila input bukan `SerializedError` yang valid.
 */
export function deserializeError(
  serialized: unknown,
  options: { maxDepth?: number } = {},
): RuneError {
  const maxDepth = options.maxDepth ?? DEFAULT_MAX_DEPTH;
  if (!isSerializedError(serialized)) {
    throw new TypeError("deserializeError: input bukan SerializedError yang valid");
  }
  return deserializeInternal(serialized, maxDepth, 0);
}

function deserializeInternal(
  serialized: SerializedError,
  maxDepth: number,
  depth: number,
): RuneError {
  const Class = ERROR_CLASS_BY_NAME[serialized.name] ?? RuneError;
  const options: RuneErrorOptions = {};

  if (serialized.status !== undefined) options.status = serialized.status;
  if (serialized.details !== undefined) options.details = serialized.details;

  if (serialized.cause !== undefined) {
    options.cause =
      depth >= maxDepth ? serialized.cause : deserializeCause(serialized.cause, maxDepth, depth);
  }

  return new Class(serialized.message, options);
}

function deserializeCause(cause: unknown, maxDepth: number, depth: number): unknown {
  if (isSerializedError(cause)) {
    return deserializeInternal(cause, maxDepth, depth + 1);
  }
  return cause;
}

/** Pesan "best-effort" untuk object arbitrer (tanpa property `message`). */
function describeUnknown(error: object): string {
  try {
    const json = JSON.stringify(error);
    if (json !== undefined && json.length > 0 && json !== "{}") return json;
  } catch {
    // circular reference — lanjut ke representasi default.
  }
  return String(error);
}

/** Mengubah object arbitrer menjadi `UnknownRecord` bila aman. */
function toUnknownRecord(
  error: object,
): Record<string, unknown> | undefined {
  if (
    Array.isArray(error) ||
    error instanceof Date ||
    error instanceof RegExp ||
    error instanceof Map ||
    error instanceof Set
  ) {
    return undefined;
  }
  return error as Record<string, unknown>;
}

function stringifyPrimitive(error: undefined | null | number | boolean | bigint | symbol): string {
  if (error === null) return "null";
  if (error === undefined) return "undefined";
  return String(error);
}
