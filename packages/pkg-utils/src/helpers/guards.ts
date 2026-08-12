/**
 * Type guards runtime. Semua fungsi adalah type predicate,
 * sehingga TypeScript otomatis mempersempit tipe setelah pemanggilan.
 */

/** `true` jika nilai adalah `string`. */
export const isString = (value: unknown): value is string => typeof value === "string";

/** `true` jika nilai adalah `number` (termasuk NaN). */
export const isNumber = (value: unknown): value is number => typeof value === "number";

/** `true` jika nilai adalah `number` dan bukan NaN/Infinity. */
export const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

/** `true` jika nilai adalah `boolean`. */
export const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

/** `true` jika nilai adalah `function`. */
export const isFunction = (value: unknown): value is (...args: never[]) => unknown =>
  typeof value === "function";

/** `true` jika nilai adalah `symbol`. */
export const isSymbol = (value: unknown): value is symbol => typeof value === "symbol";

/** `true` jika nilai adalah `bigint`. */
export const isBigInt = (value: unknown): value is bigint => typeof value === "bigint";

/** `true` jika nilai adalah `undefined`. */
export const isUndefined = (value: unknown): value is undefined => value === undefined;

/** `true` jika nilai adalah `null`. */
export const isNull = (value: unknown): value is null => value === null;

/** `true` jika nilai adalah `null` atau `undefined`. */
export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

/** `true` jika nilai adalah array. */
export const isArray = <T>(value: unknown): value is T[] => Array.isArray(value);

/** `true` jika nilai adalah `Date` yang valid. */
export const isDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

/** `true` jika nilai adalah `RegExp`. */
export const isRegExp = (value: unknown): value is RegExp => value instanceof RegExp;

/** `true` jika nilai adalah objek (bukan null, bukan array). */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** `true` jika nilai adalah plain object (prototype Object.prototype atau null). */
export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== "object" || value === null) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

/** `true` jika nilai adalah thenable (memiliki method `then`). */
export const isPromise = (value: unknown): value is PromiseLike<unknown> =>
  isObject(value) && typeof (value as { then?: unknown }).then === "function";

/** `true` jika nilai adalah `Map`. */
export const isMap = (value: unknown): value is Map<unknown, unknown> => value instanceof Map;

/** `true` jika nilai adalah `Set`. */
export const isSet = (value: unknown): value is Set<unknown> => value instanceof Set;

/** `true` jika nilai dianggap kosong (string kosong, array kosong, Map/Set kosong, objek tanpa properti). */
export const isEmpty = (value: unknown): boolean => {
  if (isNil(value)) return true;
  if (typeof value === "string" || isArray(value)) return value.length === 0;
  if (isMap(value) || isSet(value)) return value.size === 0;
  if (isPlainObject(value)) return Object.keys(value).length === 0;
  return false;
};

/** `true` jika `object` memiliki properti sendiri dengan kunci `key`. */
export const hasOwn = (object: object, key: PropertyKey): boolean =>
  Object.prototype.hasOwnProperty.call(object, key);
