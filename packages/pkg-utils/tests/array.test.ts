import { describe, expect, it } from "vitest";

import {
  chunk,
  compact,
  difference,
  first,
  flatten,
  groupBy,
  intersection,
  last,
  partition,
  range,
  rotate,
  shuffle,
  sortBy,
  take,
  takeLast,
  toArray,
  union,
  unique,
  uniqueBy,
  zip,
} from "../src";

describe("array: chunk / range / partition", () => {
  it("chunk memecah array", () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    expect(() => chunk([], 0)).toThrow(RangeError);
  });

  it("range membangun urutan", () => {
    expect(range(3)).toEqual([0, 1, 2]);
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
    expect(range(0, 10, 3)).toEqual([0, 3, 6, 9]);
  });

  it("partition memisah berdasarkan predikat", () => {
    const [even, odd] = partition([1, 2, 3, 4], (n) => n % 2 === 0);
    expect(even).toEqual([2, 4]);
    expect(odd).toEqual([1, 3]);
  });
});

describe("array: unique / compact / difference", () => {
  it("unique menghapus duplikat", () => {
    expect(unique([1, 2, 2, 3])).toEqual([1, 2, 3]);
  });

  it("uniqueBy berdasarkan kunci", () => {
    expect(uniqueBy([{ id: 1 }, { id: 1 }, { id: 2 }], (item) => item.id)).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it("compact membuang falsy", () => {
    expect(compact([0, 1, "", "a", false, null, undefined])).toEqual([1, "a"]);
  });

  it("difference / intersection / union", () => {
    expect(difference([1, 2, 3], [2, 4])).toEqual([1, 3]);
    expect(intersection([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
    expect(union([1, 2], [2, 3])).toEqual([1, 2, 3]);
  });
});

describe("array: sort / group / transform", () => {
  it("sortBy asc/desc dengan beberapa selector", () => {
    const users = [
      { name: "b", age: 2 },
      { name: "a", age: 5 },
      { name: "a", age: 1 },
    ];
    // asc: nama naik, lalu umur naik -> a/1, a/5, b/2
    expect(sortBy(users, [(u) => u.name, (u) => u.age]).map((u) => u.age)).toEqual([1, 5, 2]);
    // desc: nama turun, lalu umur turun -> b/2, a/5, a/1
    expect(sortBy(users, [(u) => u.name, (u) => u.age], "desc").map((u) => u.age)).toEqual([
      2, 5, 1,
    ]);
  });

  it("groupBy", () => {
    expect(groupBy(["a", "bb", "c"], (s) => String(s.length))).toEqual({
      "1": ["a", "c"],
      "2": ["bb"],
    });
  });

  it("flatten / zip / toArray", () => {
    expect(flatten([1, [2, 3], [4]])).toEqual([1, 2, 3, 4]);
    expect(zip([1, 2], ["a", "b"])).toEqual([
      [1, "a"],
      [2, "b"],
    ]);
    expect(toArray("x")).toEqual(["x"]);
    expect(toArray([1])).toEqual([1]);
  });

  it("first / last / take / takeLast", () => {
    expect(first([1, 2])).toBe(1);
    expect(last([1, 2])).toBe(2);
    expect(first([])).toBeUndefined();
    expect(take([1, 2, 3], 2)).toEqual([1, 2]);
    expect(takeLast([1, 2, 3], 2)).toEqual([2, 3]);
  });

  it("rotate", () => {
    expect(rotate([1, 2, 3, 4], 1)).toEqual([2, 3, 4, 1]);
    expect(rotate([1, 2, 3, 4], -1)).toEqual([4, 1, 2, 3]);
  });

  it("shuffle menjaga elemen", () => {
    const source = [1, 2, 3, 4, 5];
    const result = shuffle(source);
    expect([...result].sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
