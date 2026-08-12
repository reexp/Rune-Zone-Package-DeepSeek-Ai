import { describe, expect, it, vi } from "vitest";

import { compose, constant, identity, memoize, noop, once, pipe } from "../src";

describe("function: identity / constant / noop", () => {
  it("identity", () => {
    expect(identity(42)).toBe(42);
  });

  it("constant", () => {
    const getValue = constant("x");
    expect(getValue()).toBe("x");
  });

  it("noop tidak melempar", () => {
    expect(() => noop()).not.toThrow();
  });
});

describe("function: memoize", () => {
  it("memoize menghitung sekali per argumen", () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    expect(memoized(1, 2)).toBe(3);
    expect(memoized(1, 2)).toBe(3);
    expect(fn).toHaveBeenCalledTimes(1);

    expect(memoized(2, 2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("memoize.clear mengosongkan cache", () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);
    memoized(5);
    memoized.clear();
    memoized(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("function: once", () => {
  it("hanya mengeksekusi sekali", () => {
    const fn = vi.fn((x: number) => x * 2);
    const runOnce = once(fn);
    expect(runOnce(2)).toBe(4);
    expect(runOnce(2)).toBe(4);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe("function: pipe / compose", () => {
  it("pipe kiri ke kanan", () => {
    const double = (x: number): number => x * 2;
    const inc = (x: number): number => x + 1;
    expect(pipe(3, double, inc)).toBe(7);
  });

  it("compose kanan ke kiri", () => {
    const double = (x: number): number => x * 2;
    const inc = (x: number): number => x + 1;
    expect(compose(double, inc)(3)).toBe(8);
  });
});
