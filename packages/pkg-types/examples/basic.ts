/**
 * Contoh penggunaan @runezone/rune-types.
 *
 * Catatan: pada monorepo ini contoh meng-import dari `../src`.
 * Untuk konsumen npm, cukup import dari `@runezone/rune-types`.
 */
import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  RUNTIME_NAMES,
  TOKENS,
  createToken,
} from "../src/index";
import type {
  CursorPage,
  EntityId,
  Page,
  RequireAtLeastOne,
  Result,
  RuntimeName,
} from "../src/index";

// 1) Branded ID — mencegah tertukar dengan string biasa.
const userId: EntityId = "usr_01J..." as EntityId;
const postId: EntityId = "post_01J..." as EntityId;
// @ts-expect-error — string biasa tidak boleh langsung dipakai sebagai EntityId
const invalid: EntityId = "hello";
console.log({ userId, postId, invalid });

// 2) Result — kontrak sukses/gagal tanpa exception.
function findUser(id: EntityId): Result<{ name: string }, Error> {
  if (id.length < 5) {
    return { ok: false, error: new Error("ID terlalu pendek") };
  }
  return { ok: true, value: { name: "Rune" } };
}

const found = findUser(userId);
if (found.ok) {
  console.log("User:", found.value.name);
} else {
  console.error("Gagal:", found.error.message);
}

// 3) Pagination contract.
const page: Page<{ id: EntityId; title: string }> = {
  items: [{ id: postId, title: "Hello" }],
  meta: {
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};
const cursor: CursorPage<number> = {
  items: [1, 2, 3],
  meta: { nextCursor: "abc", hasMore: false, totalItems: 3 },
};
console.log(page.meta, cursor.meta.hasMore);

// 4) Runtime name.
const runtime: RuntimeName = "node";
console.log(runtime, RUNTIME_NAMES.includes(runtime));

// 5) DI token.
const Database = createToken<{ connect(): Promise<void> }>("database");
console.log(Symbol.keyFor(Database), Symbol.keyFor(TOKENS.Logger));

// 6) Constraint — minimal satu field update.
type UpdateUser = { id: EntityId } & RequireAtLeastOne<{ name?: string; email?: string }>;
const update: UpdateUser = { id: userId, name: "New Name" };
console.log(update, MAX_PAGE_SIZE);
