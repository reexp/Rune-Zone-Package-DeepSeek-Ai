import { describe, expect, it } from "vitest";

import {
  average,
  clamp,
  formatNumber,
  isBetween,
  isNonNegative,
  max,
  min,
  parseNumber,
  percentage,
  randomInt,
  round,
  sum,
  toNumber,
} from "../src";

describe("number: math basics", () => {
  it("clamp", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("round dengan presisi", () => {
    expect(round(1.23456, 2)).toBe(1.23);
    expect(round(1.5)).toBe(2);
  });

  it("isBetween", () => {
    expect(isBetween(5, 1, 10)).toBe(true);
    expect(isBetween(1, 1, 10, false)).toBe(false);
  });
});

describe("number: aggregate", () => {
  it("sum / average / min / max", () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(average([2, 4])).toBe(3);
    expect(average([])).toBe(0);
    expect(min([3, 1, 2])).toBe(1);
    expect(max([3, 1, 2])).toBe(3);
    expect(min([])).toBeUndefined();
  });
});

describe("number: conversion & format", () => {
  it("toNumber dengan fallback", () => {
    expect(toNumber("42")).toBe(42);
    expect(toNumber("abc", -1)).toBe(-1);
    expect(toNumber(null, 5)).toBe(5);
    expect(toNumber(7)).toBe(7);
  });

  it("parseNumber dengan koma desimal", () => {
    expect(parseNumber("1.234,56")).toBe(1234.56);
    expect(parseNumber("abc", 9)).toBe(9);
  });

  it("formatNumber memakai locale", () => {
    expect(formatNumber(1234.5, "id-ID")).toBe("1.234,5");
  });

  it("percentage", () => {
    expect(percentage(50, 200)).toBe(25);
    expect(percentage(1, 0)).toBe(0);
  });

  it("isNonNegative", () => {
    expect(isNonNegative(0)).toBe(true);
    expect(isNonNegative(-1)).toBe(false);
    expect(isNonNegative(NaN)).toBe(false);
  });

  it("randomInt berada dalam rentang", () => {
    for (let i = 0; i < 100; i += 1) {
      const value = randomInt(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
    }
  });
});
