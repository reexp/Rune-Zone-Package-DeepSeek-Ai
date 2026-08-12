import { describe, expect, it } from "vitest";

import {
  camelCase,
  capitalize,
  collapseWhitespace,
  constantCase,
  escapeRegExp,
  interpolate,
  isBlank,
  isNotBlank,
  isSlug,
  kebabCase,
  mask,
  pascalCase,
  reverse,
  slugify,
  snakeCase,
  stripHtml,
  takeWords,
  titleCase,
  toWords,
  truncate,
  uncapitalize,
  uniqueChars,
} from "../src";

describe("string: case conversion", () => {
  it("capitalize / uncapitalize", () => {
    expect(capitalize("rune")).toBe("Rune");
    expect(capitalize("")).toBe("");
    expect(uncapitalize("Rune")).toBe("rune");
  });

  it("toWords memecah berbagai format", () => {
    expect(toWords("helloWorld")).toEqual(["hello", "World"]);
    expect(toWords("hello_world")).toEqual(["hello", "world"]);
    expect(toWords("hello-world")).toEqual(["hello", "world"]);
    expect(toWords("hello world")).toEqual(["hello", "world"]);
  });

  it("konversi case", () => {
    const input = "hello world";
    expect(camelCase(input)).toBe("helloWorld");
    expect(pascalCase(input)).toBe("HelloWorld");
    expect(snakeCase(input)).toBe("hello_world");
    expect(kebabCase(input)).toBe("hello-world");
    expect(constantCase(input)).toBe("HELLO_WORLD");
    expect(titleCase(input)).toBe("Hello World");
    expect(camelCase("hello-world")).toBe("helloWorld");
    expect(pascalCase("hello_world")).toBe("HelloWorld");
  });
});

describe("string: slugify", () => {
  it("menghasilkan slug aman", () => {
    expect(slugify("Halo Dunia!")).toBe("halo-dunia");
    expect(slugify("  Banyak  Spasi  ")).toBe("banyak-spasi");
    expect(slugify("Café & Crème")).toBe("cafe-creme");
  });

  it("mendukung separator khusus", () => {
    expect(slugify("Hello World", { separator: "_" })).toBe("hello_world");
  });

  it("isSlug memvalidasi slug", () => {
    expect(isSlug("hello-world")).toBe(true);
    expect(isSlug("hello_world")).toBe(false);
    expect(isSlug("Hello")).toBe(false);
  });
});

describe("string: truncate / mask", () => {
  it("truncate", () => {
    expect(truncate("short")).toBe("short");
    expect(truncate("a".repeat(120), { length: 100 })).toBe(`${"a".repeat(99)}…`);
    expect(truncate("abcdef", { length: 4, suffix: "..." })).toBe("a...");
  });

  it("mask", () => {
    expect(mask("1234567890", 4, 2)).toBe("1234••••90");
    expect(mask("abc", 2, 2)).toBe("•••");
  });
});

describe("string: misc", () => {
  it("escapeRegExp", () => {
    expect(escapeRegExp("a.b*c")).toBe("a\\.b\\*c");
    expect(new RegExp(escapeRegExp("a.b")).test("a.b")).toBe(true);
  });

  it("interpolate dengan dot notation", () => {
    expect(interpolate("Halo {name}!", { name: "Rune" })).toBe("Halo Rune!");
    expect(interpolate("{user.name} ({user.age})", { user: { name: "A", age: 3 } })).toBe("A (3)");
    expect(interpolate("Tidak ada {missing}", {})).toBe("Tidak ada {missing}");
  });

  it("stripHtml", () => {
    expect(stripHtml("<p>Hello <b>World</b></p>")).toBe("Hello World");
    expect(stripHtml("a &amp; b")).toBe("a & b");
  });

  it("collapseWhitespace / blank", () => {
    expect(collapseWhitespace("a   b\n\t c")).toBe("a b c");
    expect(isBlank("   ")).toBe(true);
    expect(isNotBlank("x")).toBe(true);
    expect(isBlank("x")).toBe(false);
  });

  it("takeWords / uniqueChars / reverse", () => {
    expect(takeWords("a b c d", 2)).toBe("a b");
    expect(uniqueChars("abacaba")).toBe("abc");
    expect(reverse("abc")).toBe("cba");
  });
});
