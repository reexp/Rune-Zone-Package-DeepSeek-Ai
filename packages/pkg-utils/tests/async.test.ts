import { describe, expect, it, vi } from "vitest";

import {
  debounce,
  isPromiseLike,
  mapWithConcurrency,
  pLimit,
  retry,
  sleep,
  throttle,
  timeout,
  toPromise,
} from "../src";

describe("async: sleep / timeout / retry", () => {
  it("sleep menunggu setidaknya durasi", async () => {
    const start = Date.now();
    await sleep(30);
    expect(Date.now() - start).toBeGreaterThanOrEqual(25);
  });

  it("timeout membatalkan promise lambat", async () => {
    await expect(timeout(sleep(200), 20)).rejects.toThrow("Operation timed out");
  });

  it("timeout mengembalikan hasil promise cepat", async () => {
    await expect(timeout(Promise.resolve("ok"), 100)).resolves.toBe("ok");
  });

  it("retry berhasil setelah beberapa kegagalan", async () => {
    let attempt = 0;
    const fn = vi.fn(async () => {
      attempt += 1;
      if (attempt < 3) throw new Error(`fail ${attempt}`);
      return "success";
    });
    await expect(retry(fn, { attempts: 3, delay: 0 })).resolves.toBe("success");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("retry menyerah setelah attempts habis", async () => {
    const fn = vi.fn(async () => {
      throw new Error("always fail");
    });
    await expect(retry(fn, { attempts: 2, delay: 0 })).rejects.toThrow("always fail");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("async: debounce / throttle", () => {
  it("debounce hanya mengeksekusi sekali setelah jeda", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 30);
    debounced();
    debounced();
    debounced();
    expect(fn).not.toHaveBeenCalled();
    await sleep(60);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("debounce.flush mengeksekusi segera", async () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 1000);
    debounced("x");
    debounced.flush();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("x");
  });

  it("throttle membatasi eksekusi", async () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 50);
    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
    await sleep(80);
    throttled();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe("async: concurrency", () => {
  it("pLimit membatasi konkurensi", async () => {
    const limit = pLimit(2);
    let active = 0;
    let peak = 0;
    const task = async () => {
      active += 1;
      peak = Math.max(peak, active);
      await sleep(20);
      active -= 1;
      return active;
    };
    await Promise.all([limit(task), limit(task), limit(task), limit(task)]);
    expect(peak).toBeLessThanOrEqual(2);
  });

  it("mapWithConcurrency", async () => {
    const result = await mapWithConcurrency([1, 2, 3], async (n) => n * 2, 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it("pLimit menolak concurrency tidak valid", () => {
    expect(() => pLimit(0)).toThrow(RangeError);
  });
});

describe("async: promise helpers", () => {
  it("isPromiseLike / toPromise", () => {
    expect(isPromiseLike(Promise.resolve())).toBe(true);
    expect(isPromiseLike({ then() {} })).toBe(true);
    expect(isPromiseLike({})).toBe(false);
    expect(toPromise(42)).toBeInstanceOf(Promise);
  });
});
