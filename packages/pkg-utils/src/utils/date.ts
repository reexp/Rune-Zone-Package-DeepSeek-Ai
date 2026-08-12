import { isDate } from "../helpers/guards";

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const MS_PER_MONTH = 30 * MS_PER_DAY;
const MS_PER_YEAR = 365 * MS_PER_DAY;

/** `true` jika nilai adalah `Date` yang valid. */
export function isValidDate(value: unknown): value is Date {
  return isDate(value);
}

/** Konversi string/number/Date ke `Date`. */
export function toDate(value: string | number | Date): Date {
  if (value instanceof Date) return new Date(value.getTime());
  return new Date(value);
}

/** Salin Date. */
export function copyDate(date: Date): Date {
  return new Date(date.getTime());
}

/** Awal hari (00:00:00.000). */
export function startOfDay(date: Date): Date {
  const d = copyDate(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Akhir hari (23:59:59.999). */
export function endOfDay(date: Date): Date {
  const d = copyDate(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/** Awal bulan (tanggal 1, 00:00:00.000). */
export function startOfMonth(date: Date): Date {
  const d = startOfDay(date);
  d.setDate(1);
  return d;
}

/** Akhir bulan. */
export function endOfMonth(date: Date): Date {
  const d = endOfDay(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return d;
}

/** Tambah hari. */
export function addDays(date: Date, amount: number): Date {
  const d = copyDate(date);
  d.setDate(d.getDate() + amount);
  return d;
}

/** Tambah bulan. */
export function addMonths(date: Date, amount: number): Date {
  const d = copyDate(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

/** Tambah tahun. */
export function addYears(date: Date, amount: number): Date {
  const d = copyDate(date);
  d.setFullYear(d.getFullYear() + amount);
  return d;
}

/** Tambah jam. */
export function addHours(date: Date, amount: number): Date {
  const d = copyDate(date);
  d.setHours(d.getHours() + amount);
  return d;
}

/** Tambah menit. */
export function addMinutes(date: Date, amount: number): Date {
  const d = copyDate(date);
  d.setMinutes(d.getMinutes() + amount);
  return d;
}

/** Tambah detik. */
export function addSeconds(date: Date, amount: number): Date {
  const d = copyDate(date);
  d.setSeconds(d.getSeconds() + amount);
  return d;
}

/** Selisih dalam milidetik (`a - b`). */
export function differenceInMilliseconds(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

/** Selisih dalam detik. */
export function differenceInSeconds(a: Date, b: Date): number {
  return Math.trunc(differenceInMilliseconds(a, b) / MS_PER_SECOND);
}

/** Selisih dalam menit. */
export function differenceInMinutes(a: Date, b: Date): number {
  return Math.trunc(differenceInMilliseconds(a, b) / MS_PER_MINUTE);
}

/** Selisih dalam jam. */
export function differenceInHours(a: Date, b: Date): number {
  return Math.trunc(differenceInMilliseconds(a, b) / MS_PER_HOUR);
}

/** Selisih dalam hari kalender (berbasis awal hari). */
export function differenceInDays(a: Date, b: Date): number {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / MS_PER_DAY);
}

/** `true` jika tanggal sama (hari/bulan/tahun). */
export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

/** `true` jika bulan dan tahun sama. */
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/** `true` jika `a` sebelum `b`. */
export const isBefore = (a: Date, b: Date): boolean => a.getTime() < b.getTime();

/** `true` jika `a` setelah `b`. */
export const isAfter = (a: Date, b: Date): boolean => a.getTime() > b.getTime();

/** `true` jika tanggal berada dalam rentang `[start, end]`. */
export function isBetweenDates(date: Date, start: Date, end: Date, inclusive = true): boolean {
  const t = date.getTime();
  const s = start.getTime();
  const e = end.getTime();
  return inclusive ? t >= s && t <= e : t > s && t < e;
}

/**
 * Format tanggal memakai `Intl.DateTimeFormat`.
 */
export function formatDate(
  value: Date | string | number,
  locale = "id-ID",
  options: Intl.DateTimeFormatOptions = {},
): string {
  const date = toDate(value);
  if (!isValidDate(date)) throw new TypeError("Invalid date value");
  const hasComponents = [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "weekday",
    "era",
    "dayPeriod",
    "timeZoneName",
  ].some((key) => key in options);
  const resolved: Intl.DateTimeFormatOptions = hasComponents
    ? options
    : { dateStyle: "medium", ...options };
  return new Intl.DateTimeFormat(locale, resolved).format(date);
}

/**
 * Format selisih waktu relatif terhadap `base`.
 *
 * @example
 * formatRelativeTime(Date.now() - 2 * 60000) // "2 menit yang lalu"
 */
export function formatRelativeTime(
  value: Date | string | number,
  base: Date = new Date(),
  locale = "id-ID",
): string {
  const date = toDate(value);
  if (!isValidDate(date)) throw new TypeError("Invalid date value");
  const diff = date.getTime() - base.getTime();
  const absolute = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (absolute < MS_PER_MINUTE) {
    return rtf.format(Math.round(diff / MS_PER_SECOND), "second");
  }
  if (absolute < MS_PER_HOUR) {
    return rtf.format(Math.round(diff / MS_PER_MINUTE), "minute");
  }
  if (absolute < MS_PER_DAY) {
    return rtf.format(Math.round(diff / MS_PER_HOUR), "hour");
  }
  if (absolute < MS_PER_MONTH) {
    return rtf.format(Math.round(diff / MS_PER_DAY), "day");
  }
  if (absolute < MS_PER_YEAR) {
    return rtf.format(Math.round(diff / MS_PER_MONTH), "month");
  }
  return rtf.format(Math.round(diff / MS_PER_YEAR), "year");
}

/** `true` jika tahun kabisat. */
export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

/** Jumlah hari dalam bulan (`month` 1–12). */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}
