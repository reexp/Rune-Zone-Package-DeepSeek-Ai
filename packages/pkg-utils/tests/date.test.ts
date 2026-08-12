import { describe, expect, it } from "vitest";

import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addYears,
  copyDate,
  daysInMonth,
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInSeconds,
  endOfDay,
  endOfMonth,
  formatDate,
  formatRelativeTime,
  isAfter,
  isBefore,
  isBetweenDates,
  isLeapYear,
  isSameDay,
  isSameMonth,
  isValidDate,
  startOfDay,
  startOfMonth,
  toDate,
} from "../src";

const BASE = new Date(2024, 0, 15, 10, 30, 0, 0); // 15 Jan 2024 10:30:00

describe("date: conversion & boundary", () => {
  it("toDate / copyDate / isValidDate", () => {
    expect(toDate("2024-01-15T00:00:00.000Z") instanceof Date).toBe(true);
    const copy = copyDate(BASE);
    expect(copy.getTime()).toBe(BASE.getTime());
    copy.setDate(1);
    expect(BASE.getDate()).toBe(15);
    expect(isValidDate(BASE)).toBe(true);
    expect(isValidDate(new Date("invalid"))).toBe(false);
  });

  it("startOfDay / endOfDay", () => {
    expect(startOfDay(BASE).getHours()).toBe(0);
    expect(endOfDay(BASE).getHours()).toBe(23);
    expect(endOfDay(BASE).getMilliseconds()).toBe(999);
  });

  it("startOfMonth / endOfMonth", () => {
    expect(startOfMonth(BASE).getDate()).toBe(1);
    expect(endOfMonth(BASE).getDate()).toBe(31);
    expect(endOfMonth(new Date(2024, 1, 10)).getDate()).toBe(29);
  });
});

describe("date: arithmetic", () => {
  it("addDays / addMonths / addYears", () => {
    expect(addDays(BASE, 1).getDate()).toBe(16);
    expect(addDays(BASE, -1).getDate()).toBe(14);
    expect(addMonths(BASE, 1).getMonth()).toBe(1);
    expect(addYears(BASE, 1).getFullYear()).toBe(2025);
  });

  it("addHours / addMinutes / addSeconds", () => {
    expect(addHours(BASE, 1).getHours()).toBe(11);
    expect(addMinutes(BASE, 30).getMinutes()).toBe(0);
    expect(addSeconds(BASE, 30).getSeconds()).toBe(30);
  });
});

describe("date: comparison", () => {
  it("isBefore / isAfter", () => {
    expect(isBefore(BASE, addDays(BASE, 1))).toBe(true);
    expect(isAfter(BASE, addDays(BASE, -1))).toBe(true);
    expect(isBefore(BASE, BASE)).toBe(false);
  });

  it("isSameDay / isSameMonth", () => {
    expect(isSameDay(BASE, new Date(2024, 0, 15, 23, 0))).toBe(true);
    expect(isSameDay(BASE, addDays(BASE, 1))).toBe(false);
    expect(isSameMonth(BASE, new Date(2024, 0, 1))).toBe(true);
  });

  it("isBetweenDates", () => {
    const start = addDays(BASE, -1);
    const end = addDays(BASE, 1);
    expect(isBetweenDates(BASE, start, end)).toBe(true);
    expect(isBetweenDates(addDays(BASE, 5), start, end)).toBe(false);
  });

  it("differenceIn*", () => {
    const later = addHours(BASE, 2);
    expect(differenceInMilliseconds(later, BASE)).toBe(2 * 60 * 60 * 1000);
    expect(differenceInSeconds(later, BASE)).toBe(7200);
    expect(differenceInMinutes(later, BASE)).toBe(120);
    expect(differenceInHours(later, BASE)).toBe(2);
    expect(differenceInDays(addDays(BASE, 3), BASE)).toBe(3);
  });
});

describe("date: calendar & format", () => {
  it("isLeapYear / daysInMonth", () => {
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(2023)).toBe(false);
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
  });

  it("formatDate", () => {
    const date = new Date(2024, 0, 15, 10, 30);
    expect(formatDate(date, "en-US", { dateStyle: "medium" })).toBe("Jan 15, 2024");
    expect(formatDate(date, "en-US", { year: "numeric", month: "2-digit", day: "2-digit" })).toBe(
      "01/15/2024",
    );
    expect(() => formatDate("invalid", "en-US")).toThrow(TypeError);
  });

  it("formatRelativeTime", () => {
    const now = new Date();
    expect(formatRelativeTime(new Date(now.getTime() - 2 * 60000), now, "id-ID")).toContain(
      "menit",
    );
    expect(formatRelativeTime(new Date(now.getTime() + 3 * 60000), now, "en-US")).toContain(
      "in 3 minutes",
    );
  });
});
