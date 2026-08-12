import { isFiniteNumber } from "../helpers/guards";

/** Batasi nilai ke rentang `[min, max]`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Bulatkan ke presisi desimal tertentu. */
export function round(value: number, precision = 0): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/** Konversi nilai ke number dengan fallback. */
export function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number") return Number.isNaN(value) ? fallback : value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.trim());
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

/** Bilangan bulat acak inklusif `[min, max]`. */
export function randomInt(min: number, max: number): number {
  if (min > max) throw new RangeError("min must not exceed max");
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Bilangan pecahan acak `[min, max)`. */
export function randomFloat(min: number, max: number): number {
  if (min > max) throw new RangeError("min must not exceed max");
  return Math.random() * (max - min) + min;
}

/** `true` jika nilai berada di dalam rentang. */
export function isBetween(value: number, min: number, max: number, inclusive = true): boolean {
  return inclusive ? value >= min && value <= max : value > min && value < max;
}

/** Jumlah seluruh angka. */
export function sum(numbers: readonly number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

/** Rata-rata seluruh angka (0 untuk array kosong). */
export function average(numbers: readonly number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

/** Nilai minimum (undefined untuk array kosong). */
export function min(numbers: readonly number[]): number | undefined {
  if (numbers.length === 0) return undefined;
  return Math.min(...numbers);
}

/** Nilai maksimum (undefined untuk array kosong). */
export function max(numbers: readonly number[]): number | undefined {
  if (numbers.length === 0) return undefined;
  return Math.max(...numbers);
}

/**
 * Format angka memakai `Intl.NumberFormat`.
 *
 * @example
 * formatNumber(1234567.89, "id-ID", { style: "currency", currency: "IDR" })
 */
export function formatNumber(
  value: number,
  locale = "id-ID",
  options: Intl.NumberFormatOptions = {},
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Parse string desimal dengan dukungan koma desimal.
 *
 * @example
 * parseNumber("1.234,56") // 1234.56
 */
export function parseNumber(value: string, fallback = 0): number {
  const cleaned = value.trim().replace(/\s+/g, "").replace(/\./g, "").replace(",", ".");
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/** Persentase `part / total`, dibulatkan ke `precision`. */
export function percentage(part: number, total: number, precision = 2): number {
  if (total === 0) return 0;
  return round((part / total) * 100, precision);
}

/** `true` jika nilai adalah angka aman non-negatif. */
export function isNonNegative(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0;
}
