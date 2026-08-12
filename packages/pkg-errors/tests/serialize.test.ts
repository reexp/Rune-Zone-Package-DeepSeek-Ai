import { describe, expect, it } from "vitest";
import {
  ERROR_CODES,
  NotFoundError,
  RateLimitError,
  RuneError,
  ValidationError,
  deserializeError,
  isRuneError,
  serializeError,
} from "../src/index";

describe("serializeError", () => {
  it("men-serialize RuneError lengkap dengan stack", () => {
    const error = new NotFoundError("target hilang", { details: { id: "1" } });
    const serialized = serializeError(error);

    expect(serialized.name).toBe("NotFoundError");
    expect(serialized.message).toBe("target hilang");
    expect(serialized.code).toBe("NOT_FOUND");
    expect(serialized.status).toBe(404);
    expect(serialized.details).toEqual({ id: "1" });
    expect(serialized.stack).toBeTypeOf("string");
  });

  it("menghilangkan stack saat includeStack false", () => {
    const serialized = serializeError(new RuneError("x"), { includeStack: false });
    expect(serialized).not.toHaveProperty("stack");
  });

  it("men-serialize Error native sebagai code UNKNOWN", () => {
    const serialized = serializeError(new Error("native"));
    expect(serialized.name).toBe("Error");
    expect(serialized.code).toBe(ERROR_CODES.UNKNOWN);
    expect(serialized.message).toBe("native");
  });

  it("men-serialize cause secara rekursif", () => {
    const error = new RuneError("luar", { cause: new NotFoundError("dalam") });
    const serialized = serializeError(error);
    expect(serialized.cause).toEqual({
      name: "NotFoundError",
      message: "dalam",
      code: "NOT_FOUND",
      status: 404,
      stack: expect.any(String),
    });
  });

  it("membatasi kedalaman cause (maxDepth)", () => {
    let cause: unknown;
    for (let i = 0; i < 10; i += 1) {
      cause = new RuneError(`level-${i}`, { cause });
    }
    const serialized = serializeError(new RuneError("top", { cause }), { maxDepth: 2 });
    let depth = 0;
    let cursor: unknown = serialized.cause;
    while (typeof cursor === "object" && cursor !== null && "cause" in cursor) {
      depth += 1;
      cursor = (cursor as { cause: unknown }).cause;
    }
    expect(depth).toBeLessThanOrEqual(3);
  });

  it("men-serialize string dan primitif lain", () => {
    expect(serializeError("pesan").message).toBe("pesan");
    expect(serializeError(42).message).toBe("42");
  });

  it("men-serialize object tanpa message menjadi bentuk deskriptif", () => {
    const serialized = serializeError({ foo: "bar" });
    expect(serialized.message).toBe('{"foo":"bar"}');
  });
});

describe("deserializeError", () => {
  it("merekonstruksi kelas error asli berdasarkan name", () => {
    const original = new NotFoundError("tidak ada", { details: { id: "9" } });
    const restored = deserializeError(serializeError(original));

    expect(restored).toBeInstanceOf(NotFoundError);
    expect(restored).toBeInstanceOf(RuneError);
    expect(restored.message).toBe("tidak ada");
    expect(restored.code).toBe("NOT_FOUND");
    expect(restored.status).toBe(404);
    expect(restored.details).toEqual({ id: "9" });
    expect(isRuneError(restored)).toBe(true);
  });

  it("merekontruksi cause yang juga SerializedError", () => {
    const original = new RuneError("luar", { cause: new ValidationError("dalam") });
    const restored = deserializeError(serializeError(original));

    expect(restored.cause).toBeInstanceOf(ValidationError);
    expect((restored.cause as ValidationError).code).toBe("VALIDATION");
  });

  it("merekonstruksi RateLimitError beserta retryAfter", () => {
    const original = new RateLimitError("terlalu cepat", { retryAfter: 15 });
    const restored = deserializeError(serializeError(original));

    expect(restored).toBeInstanceOf(RateLimitError);
    expect((restored as RateLimitError).retryAfter).toBe(15);
  });

  it("menggunakan RuneError untuk name yang tidak dikenal", () => {
    const restored = deserializeError({ name: "MisteriError", message: "hmm", code: "UNKNOWN" });
    expect(restored).toBeInstanceOf(RuneError);
    expect(restored.name).toBe("RuneError");
    expect(restored.message).toBe("hmm");
  });

  it("melempar TypeError untuk input yang tidak valid", () => {
    expect(() => deserializeError(null)).toThrow(TypeError);
    expect(() => deserializeError("bukan-error")).toThrow(TypeError);
    expect(() => deserializeError({ name: "X" })).toThrow(TypeError);
  });

  it("melakukan round-trip JSON penuh", () => {
    const original = new NotFoundError("hilang", {
      details: { resource: "article" },
      cause: new Error("penyebab"),
    });
    const json = JSON.stringify(serializeError(original));
    const restored = deserializeError(JSON.parse(json) as unknown);

    expect(restored.message).toBe("hilang");
    expect(restored.code).toBe("NOT_FOUND");
    expect(restored.details).toEqual({ resource: "article" });
  });
});
