import { describe, expect, it } from "vitest";
import { consumeRateLimit, getClientIpAddress } from "./rate-limit";

describe("getClientIpAddress", () => {
  it("parses the first forwarded IP address", () => {
    const request = new Request("https://campuslift.dev/api/test", {
      headers: {
        "x-forwarded-for": "203.0.113.1, 10.0.0.1",
      },
    });

    expect(getClientIpAddress(request)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip header", () => {
    const request = new Request("https://campuslift.dev/api/test", {
      headers: {
        "x-real-ip": "198.51.100.42",
      },
    });

    expect(getClientIpAddress(request)).toBe("198.51.100.42");
  });

  it("returns unknown when no IP headers are present", () => {
    const request = new Request("https://campuslift.dev/api/test");
    expect(getClientIpAddress(request)).toBe("unknown");
  });

  it("trims whitespace from x-real-ip", () => {
    const request = new Request("https://campuslift.dev/api/test", {
      headers: {
        "x-real-ip": "  198.51.100.42  ",
      },
    });

    expect(getClientIpAddress(request)).toBe("198.51.100.42");
  });

  it("prefers x-forwarded-for over x-real-ip", () => {
    const request = new Request("https://campuslift.dev/api/test", {
      headers: {
        "x-forwarded-for": "203.0.113.1",
        "x-real-ip": "198.51.100.42",
      },
    });

    expect(getClientIpAddress(request)).toBe("203.0.113.1");
  });
});

describe("consumeRateLimit", () => {
  it("allows the first request", () => {
    const store = new Map();
    const result = consumeRateLimit(store, {
      key: "test:127.0.0.1",
      max: 5,
      windowMs: 60_000,
      now: 1_000,
    });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests after the configured limit", () => {
    const store = new Map();
    const first = consumeRateLimit(store, {
      key: "comments:127.0.0.1",
      max: 2,
      windowMs: 60_000,
      now: 1_000,
    });
    const second = consumeRateLimit(store, {
      key: "comments:127.0.0.1",
      max: 2,
      windowMs: 60_000,
      now: 2_000,
    });
    const third = consumeRateLimit(store, {
      key: "comments:127.0.0.1",
      max: 2,
      windowMs: 60_000,
      now: 3_000,
    });

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
  });

  it("resets the window after expiration", () => {
    const store = new Map();

    consumeRateLimit(store, {
      key: "checkout:127.0.0.1",
      max: 1,
      windowMs: 1_000,
      now: 1_000,
    });

    const afterReset = consumeRateLimit(store, {
      key: "checkout:127.0.0.1",
      max: 1,
      windowMs: 1_000,
      now: 2_500,
    });

    expect(afterReset.allowed).toBe(true);
    expect(afterReset.remaining).toBe(0);
  });

  it("tracks separate keys independently", () => {
    const store = new Map();

    consumeRateLimit(store, {
      key: "keyA:127.0.0.1",
      max: 1,
      windowMs: 60_000,
      now: 1_000,
    });

    const resultB = consumeRateLimit(store, {
      key: "keyB:127.0.0.1",
      max: 1,
      windowMs: 60_000,
      now: 1_000,
    });

    expect(resultB.allowed).toBe(true);
  });

  it("returns correct remaining count as requests accumulate", () => {
    const store = new Map();

    const r1 = consumeRateLimit(store, { key: "k", max: 3, windowMs: 60_000, now: 1_000 });
    const r2 = consumeRateLimit(store, { key: "k", max: 3, windowMs: 60_000, now: 2_000 });
    const r3 = consumeRateLimit(store, { key: "k", max: 3, windowMs: 60_000, now: 3_000 });
    const r4 = consumeRateLimit(store, { key: "k", max: 3, windowMs: 60_000, now: 4_000 });

    expect(r1.remaining).toBe(2);
    expect(r2.remaining).toBe(1);
    expect(r3.remaining).toBe(0);
    expect(r4.allowed).toBe(false);
    expect(r4.remaining).toBe(0);
  });
});
