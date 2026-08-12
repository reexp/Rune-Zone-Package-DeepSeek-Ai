import { describe, expect, it } from "vitest";
import {
  AuthenticationError,
  AuthorizationError,
  CancelledError,
  ConfigurationError,
  ConflictError,
  DatabaseError,
  ERROR_CLASS_BY_NAME,
  ERROR_CODE_BY_CLASS,
  InternalError,
  NetworkError,
  NotFoundError,
  RateLimitError,
  RuneError,
  StorageError,
  TimeoutError,
  UnsupportedError,
  ValidationError,
} from "../src/index";

describe("kelas error bertipe", () => {
  it.each([
    { Class: InternalError, code: "INTERNAL", status: 500 },
    { Class: ConfigurationError, code: "CONFIGURATION", status: 500 },
    { Class: ValidationError, code: "VALIDATION", status: 400 },
    { Class: AuthenticationError, code: "AUTHENTICATION", status: 401 },
    { Class: AuthorizationError, code: "AUTHORIZATION", status: 403 },
    { Class: NotFoundError, code: "NOT_FOUND", status: 404 },
    { Class: ConflictError, code: "CONFLICT", status: 409 },
    { Class: RateLimitError, code: "RATE_LIMIT", status: 429 },
    { Class: TimeoutError, code: "TIMEOUT", status: 504 },
    { Class: NetworkError, code: "NETWORK", status: 502 },
    { Class: StorageError, code: "STORAGE", status: 500 },
    { Class: DatabaseError, code: "DATABASE", status: 500 },
    { Class: UnsupportedError, code: "UNSUPPORTED", status: 501 },
    { Class: CancelledError, code: "CANCELLED", status: 499 },
  ])("$Class memiliki code $code dan status $status", ({ Class, code, status }) => {
    const error = new Class("pesan");
    expect(error).toBeInstanceOf(RuneError);
    expect(error.code).toBe(code);
    expect(error.status).toBe(status);
    expect(error.message).toBe("pesan");
    expect(error.name).toBe(Class.name);
  });

  it("semua error menggunakan pesan default yang informatif", () => {
    expect(new NotFoundError().message).toBe("Resource not found");
    expect(new AuthenticationError().message).toBe("Authentication failed");
    expect(new ValidationError().message).toBe("Validation failed");
  });
});

describe("ValidationError", () => {
  it("menyimpan fieldErrors di details dan mengeksposnya via getter", () => {
    const error = new ValidationError("data tidak valid", {
      fieldErrors: {
        email: ["Format email salah"],
        password: ["Minimal 8 karakter", "Harus ada angka"],
      },
    });

    expect(error.details).toEqual({
      fieldErrors: {
        email: ["Format email salah"],
        password: ["Minimal 8 karakter", "Harus ada angka"],
      },
    });
    expect(error.fieldErrors?.email).toEqual(["Format email salah"]);
    expect(error.fieldErrors?.password).toHaveLength(2);
  });

  it("tetap berfungsi tanpa fieldErrors", () => {
    const error = new ValidationError("validasi gagal");
    expect(error.fieldErrors).toBeUndefined();
  });

  it("menggabungkan details eksternal dan fieldErrors", () => {
    const error = new ValidationError("gagal", {
      details: { source: "register" },
      fieldErrors: { name: ["wajib diisi"] },
    });
    expect(error.details).toEqual({ source: "register", fieldErrors: { name: ["wajib diisi"] } });
  });

  it("mengabaikan fieldErrors yang bentuknya tidak valid pada getter", () => {
    const error = new ValidationError("gagal", { details: { fieldErrors: "bukan-map" } });
    expect(error.fieldErrors).toBeUndefined();
  });
});

describe("RateLimitError", () => {
  it("menyimpan retryAfter di details dan mengeksposnya via getter", () => {
    const error = new RateLimitError("terlalu cepat", { retryAfter: 30 });
    expect(error.details).toEqual({ retryAfter: 30 });
    expect(error.retryAfter).toBe(30);
    expect(error.status).toBe(429);
  });

  it("tidak menyimpan retryAfter bila tidak diberikan", () => {
    const error = new RateLimitError("terlalu cepat");
    expect(error.details).toBeUndefined();
    expect(error.retryAfter).toBeUndefined();
  });
});

describe("ERROR_CLASS_BY_NAME", () => {
  it("memetakan seluruh nama kelas ke konstruktor", () => {
    expect(ERROR_CLASS_BY_NAME.NotFoundError).toBe(NotFoundError);
    expect(ERROR_CLASS_BY_NAME.ValidationError).toBe(ValidationError);
    expect(ERROR_CLASS_BY_NAME.RuneError).toBe(RuneError);
  });

  it("mencakup semua kelas error bertipe", () => {
    const names = Object.keys(ERROR_CLASS_BY_NAME);
    expect(names).toEqual(
      expect.arrayContaining([
        "InternalError",
        "ConfigurationError",
        "ValidationError",
        "AuthenticationError",
        "AuthorizationError",
        "NotFoundError",
        "ConflictError",
        "RateLimitError",
        "TimeoutError",
        "NetworkError",
        "StorageError",
        "DatabaseError",
        "UnsupportedError",
        "CancelledError",
      ]),
    );
  });
});

describe("ERROR_CODE_BY_CLASS", () => {
  it("menyediakan code default per kelas", () => {
    expect(ERROR_CODE_BY_CLASS.NotFoundError).toBe("NOT_FOUND");
    expect(ERROR_CODE_BY_CLASS.AuthenticationError).toBe("AUTHENTICATION");
  });
});
