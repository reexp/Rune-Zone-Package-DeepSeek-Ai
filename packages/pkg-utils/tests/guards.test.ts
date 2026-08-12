import { describe, expect, it } from "vitest";

import {
  hasOwn,
  isArray,
  isBigInt,
  isBoolean,
  isDate,
  isEmpty,
  isFiniteNumber,
  isFunction,
  isMap,
  isNil,
  isNull,
  isNumber,
  isObject,
  isPlainObject,
  isPromise,
  isRegExp,
  isSet,
  isString,
  isSymbol,
  isUndefined,
} from "../src";

describe("guards: primitives", () => {
  it("isString", () => {
    expect(isString("a")).toBe(true);
    expect(isString(1)).toBe(false);
    expect(isString(null)).toBe(false);
  });

  it("isNumber / isFiniteNumber", () => {
    expect(isNumber(1)).toBe(true);
    expect(isNumber(NaN)).toBe(true);
    expect(isFiniteNumber(1)).toBe(true);
    expect(isFiniteNumber(NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isNumber("1")).toBe(false);
  });

  it("isBoolean", () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
    expect(isBoolean(0)).toBe(false);
  });

  it("isFunction", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(async () => {})).toBe(true);
    expect(isFunction({})).toBe(false);
  });

  it("isSymbol / isBigInt", () => {
    expect(isSymbol(Symbol("x"))).toBe(true);
    expect(isSymbol("x")).toBe(false);
    expect(isBigInt(10n)).toBe(true);
    expect(isBigInt(10)).toBe(false);
  });

  it("isUndefined / isNull / isNil", () => {
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
    expect(isNil(0)).toBe(false);
  });
});

describe("guards: structures", () => {
  it("isArray", () => {
    expect(isArray([])).toBe(true);
    expect(isArray("[]")).toBe(false);
  });

  it("isDate", () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date("invalid"))).toBe(false);
    expect(isDate("2024-01-01")).toBe(false);
  });

  it("isRegExp", () => {
    expect(isRegExp(/a/)).toBe(true);
    expect(isRegExp("a")).toBe(false);
  });

  it("isObject vs isPlainObject", () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
  });

  it("isMap / isSet", () => {
    expect(isMap(new Map())).toBe(true);
    expect(isMap({})).toBe(false);
    expect(isSet(new Set())).toBe(true);
    expect(isSet([])).toBe(false);
  });

  it("isPromise", () => {
    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise({ then: () => {} })).toBe(true);
    expect(isPromise({})).toBe(false);
  });

  it("isEmpty", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty("a")).toBe(false);
    expect(isEmpty([1])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
  });

  it("hasOwn", () => {
    const obj = { a: 1 };
    expect(hasOwn(obj, "a")).toBe(true);
    expect(hasOwn(obj, "b")).toBe(false);
    expect(hasOwn(obj, "toString")).toBe(false);
  });
});
