/**
 * Contoh penggunaan @runezone/rune-utils.
 *
 * Catatan: pada monorepo ini contoh meng-import dari `../src`.
 * Untuk konsumen npm, cukup import dari `@runezone/rune-utils`.
 */
import {
  chunk,
  clamp,
  debounce,
  deepMerge,
  differenceInDays,
  formatDate,
  generateId,
  generateUuid,
  get,
  groupBy,
  isNil,
  kebabCase,
  mask,
  parseUrl,
  pLimit,
  retry,
  set,
  slugify,
  sortBy,
  truncate,
} from "../src/index";
import { ALPHABET_HEX } from "../src/index";

// 1) String & slug.
const title = "RuneZone: Shared SDK untuk Enterprise!";
console.log("slug:", slugify(title));
console.log("kebab:", kebabCase("HelloWorld SDK"));
console.log("mask:", mask("0812-3456-7890", 4, 4));
console.log("truncate:", truncate("Lorem ipsum dolor sit amet", { length: 18 }));

// 2) Object (immutable) & nested path.
const source = { user: { name: "Rune", tags: ["admin", "dev"] } };
console.log("get:", get(source, "user.tags.0"));
const updated = set(source, "user.active", true);
console.log(
  "set (immutable):",
  get(updated, "user.active"),
  "| original tetap:",
  get(source, "user.active"),
);
console.log("deepMerge:", deepMerge({ a: { b: 1 } }, { a: { c: 2 }, d: 3 }));

// 3) Array.
console.log("chunk:", chunk([1, 2, 3, 4, 5], 2));
console.log(
  "sortBy:",
  sortBy([{ n: 2 }, { n: 1 }], (item) => item.n),
);
console.log(
  "groupBy:",
  groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd")),
);

// 4) Number & date.
console.log("clamp:", clamp(150, 0, 100));
console.log("days:", differenceInDays(new Date("2026-08-12"), new Date("2026-08-01")));
console.log(
  "formatDate:",
  formatDate(new Date("2026-08-12"), "id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }),
);

// 5) ID.
console.log("id:", generateId(12, ALPHABET_HEX));
console.log("uuid:", generateUuid());

// 6) URL.
console.log("parseUrl:", parseUrl("https://runezone.dev/posts/1?tab=all#top")?.pathname);

// 7) Async: retry + pLimit.
async function fetchItem(id: number): Promise<number> {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return id * 2;
}

const withRetry = (id: number): Promise<number> =>
  retry(() => fetchItem(id), { attempts: 3, delay: 5 });
const limited = pLimit(2);

(async () => {
  const results = await Promise.all([1, 2, 3].map((n) => limited(() => withRetry(n))));
  console.log("async results:", results);

  const onSave = debounce((value: string) => {
    console.log("debounced save:", value);
  }, 50);
  onSave("a");
  onSave("b");
  await new Promise((resolve) => setTimeout(resolve, 80));
  onSave.flush();
})();

// 8) Guard.
console.log("isNil(null):", isNil(null), isNil(0));
