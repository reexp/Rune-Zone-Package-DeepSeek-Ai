import { describe, expectTypeOf, it } from "vitest";

import type {
  DeepPartial,
  EntityId,
  Equal,
  IsAny,
  IsNever,
  IsUnknown,
  Page,
  PartialBy,
  RequireAtLeastOne,
  RequireOnlyOne,
  RequiredBy,
  Result,
  UnwrapPromise,
  UnionToIntersection,
} from "../src/index";

describe("type guards (type-level)", () => {
  it("IsAny hanya true untuk any", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- sengaja menguji `any`
    expectTypeOf<IsAny<any>>().toEqualTypeOf<true>();
    expectTypeOf<IsAny<never>>().toEqualTypeOf<false>();
    expectTypeOf<IsAny<string>>().toEqualTypeOf<false>();
    expectTypeOf<IsAny<unknown>>().toEqualTypeOf<false>();
  });

  it("IsNever hanya true untuk never", () => {
    expectTypeOf<IsNever<never>>().toEqualTypeOf<true>();
    expectTypeOf<IsNever<string>>().toEqualTypeOf<false>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- sengaja menguji `any`
    expectTypeOf<IsNever<any>>().toEqualTypeOf<false>();
  });

  it("IsUnknown hanya true untuk unknown (bukan any)", () => {
    expectTypeOf<IsUnknown<unknown>>().toEqualTypeOf<true>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- sengaja menguji `any`
    expectTypeOf<IsUnknown<any>>().toEqualTypeOf<false>();
    expectTypeOf<IsUnknown<string>>().toEqualTypeOf<false>();
  });

  it("Equal membandingkan dua tipe secara identik", () => {
    expectTypeOf<Equal<string, string>>().toEqualTypeOf<true>();
    expectTypeOf<Equal<string, number>>().toEqualTypeOf<false>();
    expectTypeOf<Equal<{ a: 1 }, { a: 1 }>>().toEqualTypeOf<true>();
  });
});

describe("utility types (type-level)", () => {
  it("UnwrapPromise membuka Promise", () => {
    expectTypeOf<UnwrapPromise<Promise<string>>>().toEqualTypeOf<string>();
    expectTypeOf<UnwrapPromise<string>>().toEqualTypeOf<string>();
  });

  it("PartialBy membuat sebagian key opsional", () => {
    type Input = { id: string; name: string };
    type Partial = PartialBy<Input, "name">;
    expectTypeOf<Partial>().toMatchTypeOf<{ id: string; name?: string }>();
    // Key yang dijadikan opsional tidak lagi wajib.
    expectTypeOf<Partial>().not.toMatchTypeOf<{ name: string }>();
  });

  it("RequiredBy membuat sebagian key wajib", () => {
    type Input = { id?: string; name: string };
    type Required = RequiredBy<Input, "id">;
    expectTypeOf<Required>().toMatchTypeOf<{ id: string; name: string }>();
  });

  it("DeepPartial merekursif seluruh property", () => {
    type Input = { meta: { tags: string[]; nested: { count: number } } };
    type Deep = DeepPartial<Input>;
    expectTypeOf<Deep>().toEqualTypeOf<{
      meta?: { tags?: string[]; nested?: { count?: number } };
    }>();
  });

  it("UnionToIntersection menggabungkan union menjadi intersection", () => {
    type Input = { a: string } | { b: number };
    expectTypeOf<UnionToIntersection<Input>>().toEqualTypeOf<{ a: string } & { b: number }>();
  });
});

describe("constraint types (type-level)", () => {
  it("RequireAtLeastOne menerima satu atau lebih key", () => {
    type Update = { id: string } & RequireAtLeastOne<{ name?: string; email?: string }>;
    // Hanya name — valid.
    const byName: Update = { id: "1", name: "rune" };
    // Keduanya — valid.
    const byBoth: Update = { id: "1", name: "rune", email: "rune@zone.dev" };
    expectTypeOf(byName).toMatchTypeOf<Update>();
    expectTypeOf(byBoth).toMatchTypeOf<Update>();
    // @ts-expect-error — tanpa salah satu key, tidak valid.
    const none: Update = { id: "1" };
    expectTypeOf(none).toMatchTypeOf<Update>();
  });

  it("RequireOnlyOne menolak lebih dari satu key", () => {
    type Payload = RequireOnlyOne<{ byId: string; bySlug: string }>;
    // Hanya satu — valid.
    const ok: Payload = { byId: "1" };
    expectTypeOf(ok).toMatchTypeOf<Payload>();
    // @ts-expect-error — dua key sekaligus tidak diizinkan.
    const bad: Payload = { byId: "1", bySlug: "x" };
    expectTypeOf(bad).toMatchTypeOf<Payload>();
  });
});

describe("domain contracts (type-level)", () => {
  it("EntityId bersifat branded dan tidak menerima string biasa", () => {
    const id: EntityId = "usr_1" as EntityId;
    expectTypeOf(id).toEqualTypeOf<EntityId>();
    // @ts-expect-error — string biasa tidak assignable ke EntityId.
    const wrong: EntityId = "usr_1";
    expectTypeOf(wrong).toEqualTypeOf<EntityId>();
  });

  it("Result melakukan narrowing otomatis", () => {
    function read(): Result<string, Error> {
      return { ok: true, value: "data" };
    }

    const result = read();
    if (result.ok) {
      expectTypeOf(result.value).toEqualTypeOf<string>();
    } else {
      expectTypeOf(result.error).toEqualTypeOf<Error>();
    }
  });

  it("Page membawa items dan meta", () => {
    const page: Page<number> = {
      items: [1, 2, 3],
      meta: {
        page: 1,
        pageSize: 20,
        totalItems: 3,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    expectTypeOf(page.items).toEqualTypeOf<number[]>();
    expectTypeOf(page.meta.page).toEqualTypeOf<number>();
  });
});
