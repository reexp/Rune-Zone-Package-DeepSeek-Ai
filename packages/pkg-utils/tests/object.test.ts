import { describe, expect, it } from "vitest";

import {
  deepClone,
  deepFreeze,
  deepMerge,
  entries,
  fromEntries,
  get,
  isEqual,
  mapKeys,
  mapValues,
  omit,
  omitBy,
  pick,
  pickBy,
  set,
} from "../src";

describe("object: deepMerge", () => {
  it("menggabungkan objek bersarang tanpa mutasi", () => {
    const target = { a: 1, nested: { x: 1, y: 2 } };
    const source = { b: 2, nested: { y: 3, z: 4 } };
    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 2, nested: { x: 1, y: 3, z: 4 } });
    expect(target).toEqual({ a: 1, nested: { x: 1, y: 2 } });
    expect(source).toEqual({ b: 2, nested: { y: 3, z: 4 } });
  });

  it("array diganti, bukan digabung", () => {
    const result = deepMerge({ list: [1, 2] }, { list: [3] });
    expect(result).toEqual({ list: [3] });
  });

  it("mengabaikan source null/undefined", () => {
    expect(deepMerge({ a: 1 }, null, undefined, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it("memblokir prototype pollution", () => {
    const result = deepMerge({}, JSON.parse('{"__proto__": {"polluted": true}}'));
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    expect(result.polluted).toBeUndefined();
  });
});

describe("object: pick / omit", () => {
  it("pick hanya properti yang diminta", () => {
    const source = { a: 1, b: 2, c: 3 };
    expect(pick(source, ["a", "c"])).toEqual({ a: 1, c: 3 });
    expect(source).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("omit membuang properti", () => {
    const source = { a: 1, b: 2, c: 3 };
    expect(omit(source, ["b"])).toEqual({ a: 1, c: 3 });
  });

  it("pickBy / omitBy dengan predikat", () => {
    const source = { a: 1, b: "x", c: 2 };
    expect(pickBy(source, (value) => typeof value === "number")).toEqual({ a: 1, c: 2 });
    expect(omitBy(source, (value) => typeof value === "number")).toEqual({ b: "x" });
  });
});

describe("object: mapValues / mapKeys", () => {
  it("mapValues mengubah nilai", () => {
    expect(mapValues({ a: 1, b: 2 }, (value) => value * 2)).toEqual({ a: 2, b: 4 });
  });

  it("mapKeys mengubah kunci", () => {
    expect(mapKeys({ a: 1 }, (key) => `${key}_x`)).toEqual({ a_x: 1 });
  });
});

describe("object: deepClone", () => {
  it("menyalin secara mendalam", () => {
    const source = { a: { b: [1, 2, { c: 3 }] } };
    const clone = deepClone(source);
    expect(clone).toEqual(source);
    expect(clone).not.toBe(source);
    expect(clone.a).not.toBe(source.a);
  });
});

describe("object: get / set", () => {
  it("get membaca dot notation", () => {
    const source = { a: { b: { c: 42 } }, list: [{ id: 1 }] };
    expect(get(source, "a.b.c")).toBe(42);
    expect(get(source, ["a", "b", "c"])).toBe(42);
    expect(get(source, "list.0.id")).toBe(1);
    expect(get(source, "missing.path", "fallback")).toBe("fallback");
    expect(get(source, "missing.path")).toBeUndefined();
  });

  it("set immutable", () => {
    const source = { a: { b: 1 }, list: [1, 2, 3] };
    const updated = set(source, "a.b", 99);
    expect(updated).toEqual({ a: { b: 99 }, list: [1, 2, 3] });
    expect(source.a.b).toBe(1);
  });

  it("set membuat container baru jika belum ada", () => {
    const source = {};
    expect(set(source, "a.b.c", 1)).toEqual({ a: { b: { c: 1 } } });
  });
});

describe("object: isEqual", () => {
  it("membandingkan nilai primitif", () => {
    expect(isEqual(1, 1)).toBe(true);
    expect(isEqual(1, "1")).toBe(false);
    expect(isEqual(NaN, NaN)).toBe(true);
    expect(isEqual(null, null)).toBe(true);
  });

  it("membandingkan objek dan array", () => {
    expect(isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
  });
});

describe("object: entries / fromEntries", () => {
  it("entries dan fromEntries saling melengkapi", () => {
    const source = { a: 1, b: 2 };
    const pair = entries(source);
    expect(pair).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
    expect(fromEntries(pair)).toEqual(source);
  });
});

describe("object: deepFreeze", () => {
  it("membekukan objek bersarang", () => {
    const frozen = deepFreeze({ a: { b: [1] } });
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.a)).toBe(true);
  });
});
