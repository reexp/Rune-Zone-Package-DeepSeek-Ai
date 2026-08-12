import { describe, expect, it } from "vitest";

import {
  DEFAULT_LOCALE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_TIMEZONE,
  DI_SYMBOL_PREFIX,
  MAX_BATCH_SIZE,
  MAX_ID_LENGTH,
  MAX_PAGE_SIZE,
  PACKAGE_PLATFORMS,
  RUNTIME_NAMES,
  TOKENS,
  createToken,
} from "../src/index";

describe("limit constants", () => {
  it("memiliki nilai default yang benar", () => {
    expect(DEFAULT_PAGE_SIZE).toBe(20);
    expect(MAX_PAGE_SIZE).toBe(100);
    expect(MAX_BATCH_SIZE).toBe(500);
    expect(MAX_ID_LENGTH).toBe(64);
  });

  it("maksimum selalu lebih besar dari default", () => {
    expect(MAX_PAGE_SIZE).toBeGreaterThan(DEFAULT_PAGE_SIZE);
  });
});

describe("runtime constants", () => {
  it("memuat seluruh nama runtime yang didukung", () => {
    expect(RUNTIME_NAMES).toEqual([
      "node",
      "edge",
      "browser",
      "worker",
      "unknown",
    ]);
    expect(RUNTIME_NAMES).toContain("node");
    expect(RUNTIME_NAMES).toContain("edge");
  });

  it("memuat seluruh platform package", () => {
    expect(PACKAGE_PLATFORMS).toEqual(["node", "edge", "browser", "universal"]);
    expect(PACKAGE_PLATFORMS).toContain("universal");
  });

  it("menyediakan default locale & timezone", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    expect(DEFAULT_TIMEZONE).toBe("UTC");
  });
});

describe("DI tokens", () => {
  it("createToken mengembalikan symbol yang unik per nama", () => {
    const a = createToken("a");
    const b = createToken("b");
    expect(typeof a).toBe("symbol");
    expect(a).not.toBe(b);
  });

  it("createToken dengan nama sama mengembalikan symbol yang sama (global registry)", () => {
    const first = createToken("shared");
    const second = createToken("shared");
    expect(first).toBe(second);
  });

  it("token memiliki prefix global yang benar", () => {
    expect(DI_SYMBOL_PREFIX).toBe("runezone:di:");
    expect(Symbol.keyFor(createToken("test-token"))).toContain(DI_SYMBOL_PREFIX);
  });

  it("registry TOKENS berisi token yang berbeda satu sama lain", () => {
    const values = Object.values(TOKENS);
    const unique = new Set(values);
    expect(unique.size).toBe(values.length);
    expect(values.length).toBeGreaterThanOrEqual(6);
  });
});
