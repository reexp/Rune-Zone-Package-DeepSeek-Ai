import { describe, expect, it } from "vitest";
import { ERROR_CODES, RuneError } from "../src/index";

describe("RuneError", () => {
  it("menggunakan code dan name default", () => {
    const error = new RuneError("sesuatu gagal");
    expect(error.name).toBe("RuneError");
    expect(error.code).toBe(ERROR_CODES.UNKNOWN);
    expect(error.message).toBe("sesuatu gagal");
    expect(error.isRuneError).toBe(true);
  });

  it("menerima code, status, details, name, dan cause", () => {
    const cause = new Error("root cause");
    const error = new RuneError("gagal", {
      code: "CUSTOM_CODE",
      status: 418,
      details: { id: "abc" },
      name: "CustomError",
      cause,
    });

    expect(error.name).toBe("CustomError");
    expect(error.code).toBe("CUSTOM_CODE");
    expect(error.status).toBe(418);
    expect(error.details).toEqual({ id: "abc" });
    expect(error.cause).toBe(cause);
  });

  it("adalah instance Error dan Error.cause terpasang", () => {
    const cause = new Error("penyebab");
    const error = new RuneError("gagal", { cause });
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(RuneError);
    expect(error.cause).toBe(cause);
  });

  it("toJSON() tidak membocorkan stack atau cause", () => {
    const error = new RuneError("rahasia", {
      code: "NOT_FOUND",
      status: 404,
      details: { resource: "post" },
      cause: new Error("internal detail"),
    });
    const json = error.toJSON();
    expect(json).toEqual({
      name: "RuneError",
      message: "rahasia",
      code: "NOT_FOUND",
      status: 404,
      details: { resource: "post" },
    });
    expect(json).not.toHaveProperty("stack");
    expect(json).not.toHaveProperty("cause");
  });

  it("toJSON() menghasilkan output yang valid untuk JSON.stringify", () => {
    const error = new RuneError("pesan", { code: "CONFLICT", status: 409 });
    const parsed = JSON.parse(JSON.stringify(error)) as Record<string, unknown>;
    expect(parsed.message).toBe("pesan");
    expect(parsed.code).toBe("CONFLICT");
    expect(parsed.status).toBe(409);
  });

  it("mendukung penyebab tanpa cause", () => {
    const error = new RuneError("polos");
    expect(error.cause).toBeUndefined();
  });

  it("mengabaikan cause undefined pada konstruktor", () => {
    const error = new RuneError("tanpa cause", { cause: undefined });
    expect(error.cause).toBeUndefined();
  });
});
