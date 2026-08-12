import { describe, expect, it } from "vitest";
import {
  AuthenticationError,
  NotFoundError,
  RuneError,
  codeToHttpStatus,
  toHttpStatus,
} from "../src/index";

describe("toHttpStatus", () => {
  it("memprioritaskan status eksplisit pada RuneError", () => {
    const error = new RuneError("kustom", { code: "NOT_FOUND", status: 418 });
    expect(toHttpStatus(error)).toBe(418);
  });

  it("memetakan code standar ke status default", () => {
    expect(toHttpStatus(new NotFoundError())).toBe(404);
    expect(toHttpStatus(new AuthenticationError())).toBe(401);
    expect(toHttpStatus(new RuneError("x", { code: "VALIDATION" }))).toBe(400);
    expect(toHttpStatus(new RuneError("x", { code: "RATE_LIMIT" }))).toBe(429);
  });

  it("mengembalikan fallback untuk non-RuneError", () => {
    expect(toHttpStatus(new Error("biasa"))).toBe(500);
    expect(toHttpStatus(new Error("biasa"), 400)).toBe(400);
    expect(toHttpStatus("string")).toBe(500);
  });
});

describe("codeToHttpStatus", () => {
  it("memetakan seluruh kode standar", () => {
    expect(codeToHttpStatus("UNKNOWN")).toBe(500);
    expect(codeToHttpStatus("INTERNAL")).toBe(500);
    expect(codeToHttpStatus("CONFIGURATION")).toBe(500);
    expect(codeToHttpStatus("VALIDATION")).toBe(400);
    expect(codeToHttpStatus("AUTHENTICATION")).toBe(401);
    expect(codeToHttpStatus("AUTHORIZATION")).toBe(403);
    expect(codeToHttpStatus("NOT_FOUND")).toBe(404);
    expect(codeToHttpStatus("CONFLICT")).toBe(409);
    expect(codeToHttpStatus("RATE_LIMIT")).toBe(429);
    expect(codeToHttpStatus("TIMEOUT")).toBe(504);
    expect(codeToHttpStatus("NETWORK")).toBe(502);
    expect(codeToHttpStatus("STORAGE")).toBe(500);
    expect(codeToHttpStatus("DATABASE")).toBe(500);
    expect(codeToHttpStatus("UNSUPPORTED")).toBe(501);
    expect(codeToHttpStatus("CANCELLED")).toBe(499);
  });

  it("mengembalikan fallback untuk kode non-standar", () => {
    expect(codeToHttpStatus("STRIPE_WEBHOOK")).toBe(500);
    expect(codeToHttpStatus("STRIPE_WEBHOOK", 400)).toBe(400);
  });
});
