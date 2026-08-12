import { describe, expect, it } from "vitest";
import {
  AuthenticationError,
  ERROR_CODES,
  InternalError,
  NotFoundError,
  RuneError,
  getErrorMessage,
  normalizeError,
} from "../src/index";

describe("normalizeError", () => {
  it("mengembalikan RuneError apa adanya", () => {
    const original = new NotFoundError("tidak ada");
    expect(normalizeError(original)).toBe(original);
  });

  it("membungkus Error native menjadi RuneError dengan cause", () => {
    const native = new Error("koneksi gagal");
    const result = normalizeError(native);
    expect(result).toBeInstanceOf(RuneError);
    expect(result.message).toBe("koneksi gagal");
    expect(result.code).toBe(ERROR_CODES.INTERNAL);
    expect(result.cause).toBe(native);
  });

  it("membungkus string menjadi RuneError", () => {
    const result = normalizeError("token invalid");
    expect(result).toBeInstanceOf(RuneError);
    expect(result.message).toBe("token invalid");
  });

  it("membungkus object dengan properti message", () => {
    const result = normalizeError({ message: "dari object" });
    expect(result.message).toBe("dari object");
    expect(result.cause).toEqual({ message: "dari object" });
  });

  it("menggunakan fallbackMessage untuk null / undefined", () => {
    expect(normalizeError(undefined, "gagal diam-diam").message).toBe("gagal diam-diam");
    expect(normalizeError(null, "gagal diam-diam").message).toBe("gagal diam-diam");
  });

  it("mengubah angka/boolean menjadi string", () => {
    expect(normalizeError(42).message).toBe("42");
    expect(normalizeError(false).message).toBe("false");
  });

  it("menghormati code kustom lewat opsi", () => {
    const result = normalizeError("ups", "fallback", { code: "CUSTOM" });
    expect(result.code).toBe("CUSTOM");
  });

  it("tetap mempertahankan instance RuneError bertipe ketika diberi opsi", () => {
    const original = new AuthenticationError("salah");
    const result = normalizeError(original, "fallback", { code: "AUTHENTICATION" });
    expect(result).toBe(original);
  });

  it("tidak menimpa code INTERNAL default bila opsi tidak diberikan", () => {
    const result = normalizeError(new Error("biasa"));
    expect(result).toBeInstanceOf(InternalError);
    expect(result.code).toBe(ERROR_CODES.INTERNAL);
  });
});

describe("getErrorMessage", () => {
  it("mengambil pesan dari RuneError", () => {
    expect(getErrorMessage(new NotFoundError("target hilang"))).toBe("target hilang");
  });

  it("mengambil pesan dari Error native", () => {
    expect(getErrorMessage(new Error("disk penuh"))).toBe("disk penuh");
  });

  it("mengembalikan string apa adanya", () => {
    expect(getErrorMessage("langsung")).toBe("langsung");
  });

  it("mengembalikan fallback untuk null/undefined", () => {
    expect(getErrorMessage(undefined)).toBe("Unknown error");
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
  });

  it("mengembalikan JSON untuk object tanpa message", () => {
    expect(getErrorMessage({ a: 1 })).toBe('{"a":1}');
  });

  it("mengembalikan representasi string untuk primitif lain", () => {
    expect(getErrorMessage(7)).toBe("7");
  });

  it("menggunakan fallback saat Error tidak punya message", () => {
    const empty = new Error("");
    expect(getErrorMessage(empty, "fallback")).toBe("fallback");
  });

  it("tidak mengembalikan '{}' untuk object kosong", () => {
    expect(getErrorMessage({}, "fallback")).toBe("fallback");
  });
});
