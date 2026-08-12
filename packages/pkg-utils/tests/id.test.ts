import { describe, expect, it } from "vitest";

import {
  ALPHABET_HEX,
  createIdGenerator,
  generateId,
  generateNanoId,
  generateToken,
  generateUuid,
} from "../src";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("id: generateId", () => {
  it("menghasilkan ID dengan panjang dan alfabet yang benar", () => {
    const id = generateId(16, ALPHABET_HEX);
    expect(id).toHaveLength(16);
    expect(id).toMatch(/^[0-9a-f]+$/);
  });

  it("unik pada banyak pemanggilan", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i += 1) seen.add(generateId());
    expect(seen.size).toBe(1000);
  });

  it("menolak parameter tidak valid", () => {
    expect(() => generateId(0)).toThrow(RangeError);
    expect(() => generateId(1, "")).toThrow(RangeError);
  });

  it("generateNanoId menggunakan ukuran default 21", () => {
    expect(generateNanoId()).toHaveLength(21);
  });

  it("createIdGenerator menghasilkan fungsi tetap", () => {
    const newId = createIdGenerator(8, ALPHABET_HEX);
    expect(newId()).toHaveLength(8);
  });
});

describe("id: generateUuid & generateToken", () => {
  it("generateUuid sesuai format v4", () => {
    expect(generateUuid()).toMatch(UUID_REGEX);
  });

  it("generateToken berupa hex dengan panjang byte", () => {
    expect(generateToken(16)).toHaveLength(32);
    expect(generateToken(16)).toMatch(/^[0-9a-f]+$/);
  });
});
