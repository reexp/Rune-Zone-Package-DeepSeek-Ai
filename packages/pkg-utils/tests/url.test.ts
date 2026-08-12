import { describe, expect, it } from "vitest";

import {
  buildQuery,
  getOrigin,
  getPathname,
  isAbsoluteUrl,
  isValidHttpUrl,
  joinUrl,
  parseQuery,
  parseUrl,
  withQuery,
} from "../src";

describe("url: query", () => {
  it("buildQuery", () => {
    expect(buildQuery({ page: 1, tags: ["a", "b"] })).toBe("?page=1&tags=a&tags=b");
    expect(buildQuery({ a: null, b: undefined, c: "x" })).toBe("?c=x");
    expect(buildQuery({})).toBe("");
  });

  it("parseQuery", () => {
    expect(parseQuery("a=1&a=2&b=x")).toEqual({ a: ["1", "2"], b: "x" });
    expect(parseQuery(new URLSearchParams("x=1"))).toEqual({ x: "1" });
  });

  it("withQuery mempertahankan hash dan query lama", () => {
    expect(withQuery("https://x.com/p?old=1#hash", { new: 2 })).toBe(
      "https://x.com/p?old=1&new=2#hash",
    );
    expect(withQuery("https://x.com/p", { a: 1 })).toBe("https://x.com/p?a=1");
  });
});

describe("url: validation & join", () => {
  it("isAbsoluteUrl / isValidHttpUrl", () => {
    expect(isAbsoluteUrl("https://x.com")).toBe(true);
    expect(isAbsoluteUrl("/relative")).toBe(false);
    expect(isValidHttpUrl("https://x.com")).toBe(true);
    expect(isValidHttpUrl("ftp://x.com")).toBe(false);
    expect(isValidHttpUrl("not-a-url")).toBe(false);
  });

  it("joinUrl", () => {
    expect(joinUrl("https://api.example.com/", "/v1/", "users")).toBe(
      "https://api.example.com/v1/users",
    );
  });

  it("parseUrl / getPathname / getOrigin", () => {
    expect(parseUrl("https://x.com/a/b?q=1")).not.toBeNull();
    expect(parseUrl("nonsense")).toBeNull();
    expect(getPathname("https://x.com/a/b?q=1")).toBe("/a/b");
    expect(getOrigin("https://x.com/a")).toBe("https://x.com");
  });
});
