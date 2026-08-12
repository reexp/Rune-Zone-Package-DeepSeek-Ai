import { describe, expect, it } from "vitest";
import {
  RuneError,
  ValidationError,
  isError,
  isErrorCode,
  isFieldErrors,
  isRuneError,
  isSerializedError,
  isStandardErrorCode,
} from "../src/index";

describe("isRuneError", () => {
  it("mengenali RuneError dan turunannya", () => {
    expect(isRuneError(new RuneError("x"))).toBe(true);
    expect(isRuneError(new ValidationError("x"))).toBe(true);
  });

  it("menolak nilai lain", () => {
    expect(isRuneError(new Error("x"))).toBe(false);
    expect(isRuneError("x")).toBe(false);
    expect(isRuneError(null)).toBe(false);
    expect(isRuneError({ isRuneError: false })).toBe(false);
  });

  it("mengenali objek dengan brand isRuneError (duplikat salinan lib)", () => {
    const fake = { isRuneError: true as const, message: "x", name: "RuneError" };
    expect(isRuneError(fake)).toBe(true);
  });
});

describe("isError", () => {
  it("mengenali Error native dan RuneError", () => {
    expect(isError(new Error("x"))).toBe(true);
    expect(isError(new RuneError("x"))).toBe(true);
  });

  it("menolak non-error", () => {
    expect(isError("x")).toBe(false);
    expect(isError({})).toBe(false);
    expect(isError(null)).toBe(false);
  });
});

describe("isErrorCode", () => {
  it("menerima string non-kosong", () => {
    expect(isErrorCode("NOT_FOUND")).toBe(true);
    expect(isErrorCode("KUSTOM")).toBe(true);
  });

  it("menolak string kosong dan non-string", () => {
    expect(isErrorCode("")).toBe(false);
    expect(isErrorCode(404)).toBe(false);
    expect(isErrorCode(undefined)).toBe(false);
  });
});

describe("isStandardErrorCode", () => {
  it("mengenali kode standar", () => {
    expect(isStandardErrorCode("NOT_FOUND")).toBe(true);
    expect(isStandardErrorCode("RATE_LIMIT")).toBe(true);
  });

  it("menolak kode kustom dan non-string", () => {
    expect(isStandardErrorCode("KUSTOM")).toBe(false);
    expect(isStandardErrorCode(404)).toBe(false);
  });
});

describe("isSerializedError", () => {
  it("mengenali bentuk SerializedError yang valid", () => {
    expect(isSerializedError({ name: "X", message: "m", code: "UNKNOWN" })).toBe(true);
    expect(
      isSerializedError({ name: "X", message: "m", code: "UNKNOWN", status: 500, stack: "s" }),
    ).toBe(true);
  });

  it("menolak bentuk yang tidak valid", () => {
    expect(isSerializedError(null)).toBe(false);
    expect(isSerializedError("x")).toBe(false);
    expect(isSerializedError({})).toBe(false);
    expect(isSerializedError({ name: "X", message: "m" })).toBe(false);
    expect(isSerializedError({ name: "X", message: "m", code: "" })).toBe(false);
    expect(isSerializedError({ name: "X", message: 1, code: "UNKNOWN" })).toBe(false);
  });
});

describe("isFieldErrors", () => {
  it("mengenali FieldErrors yang valid", () => {
    expect(isFieldErrors({ email: ["salah"], name: undefined })).toBe(true);
    expect(isFieldErrors({})).toBe(true);
  });

  it("menolak bentuk yang tidak valid", () => {
    expect(isFieldErrors("x")).toBe(false);
    expect(isFieldErrors(["bukan-map"])).toBe(false);
    expect(isFieldErrors({ email: "bukan-array" })).toBe(false);
    expect(isFieldErrors({ email: [1] })).toBe(false);
    expect(isFieldErrors(null)).toBe(false);
  });
});
