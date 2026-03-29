import { describe, expect, it } from "vitest";
import { consumeRateLimit, getClientIpAddress } from "./rate-limit";

describe("rate-limit helpers", () => {
  it("parses the first forwarded IP address", () => {
    const request = new Request("https://campuslift.dev/api/test", {
      headers: {
        "x-forwarded-for": "203.0.113.1, 10.0.0.1",
      },
    });

    expect(getClientIpAddress(request)).toBe("203.0.113.1");
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
});
