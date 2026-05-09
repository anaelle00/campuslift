import { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

type RateLimitOptions = {
  key: string;
  max: number;
  windowMs: number;
  message?: string;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const RATE_LIMIT_HEADER_LIMIT = "X-RateLimit-Limit";
const RATE_LIMIT_HEADER_REMAINING = "X-RateLimit-Remaining";
const RATE_LIMIT_HEADER_RESET = "X-RateLimit-Reset";
const RETRY_AFTER_HEADER = "Retry-After";

declare global {
  var __campusliftRateLimitStore: RateLimitStore | undefined;
}

function getGlobalRateLimitStore() {
  if (!globalThis.__campusliftRateLimitStore) {
    globalThis.__campusliftRateLimitStore = new Map<string, RateLimitEntry>();
  }

  return globalThis.__campusliftRateLimitStore;
}

function pruneExpiredEntries(store: RateLimitStore, now: number) {
  if (store.size < 1000) {
    return;
  }

  for (const [key, value] of store.entries()) {
    if (value.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function getClientIpAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export function consumeRateLimit(
  store: RateLimitStore,
  input: {
    key: string;
    max: number;
    windowMs: number;
    now?: number;
  },
): RateLimitResult {
  const now = input.now ?? Date.now();
  pruneExpiredEntries(store, now);

  const existing = store.get(input.key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + input.windowMs;
    store.set(input.key, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: Math.max(0, input.max - 1),
      resetAt,
    };
  }

  if (existing.count >= input.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: existing.resetAt,
    };
  }

  existing.count += 1;
  store.set(input.key, existing);

  return {
    allowed: true,
    remaining: Math.max(0, input.max - existing.count),
    resetAt: existing.resetAt,
  };
}

export function enforceRateLimit(
  request: Request,
  options: RateLimitOptions,
) {
  const ipAddress = getClientIpAddress(request);
  const store = getGlobalRateLimitStore();
  const result = consumeRateLimit(store, {
    key: `${options.key}:${ipAddress}`,
    max: options.max,
    windowMs: options.windowMs,
  });

  if (result.allowed) {
    return null;
  }

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((result.resetAt - Date.now()) / 1000),
  );

  return NextResponse.json(
    {
      success: false,
      message:
        options.message ??
        "Too many requests. Please wait a moment before trying again.",
    },
    {
      status: 429,
      headers: {
        [RATE_LIMIT_HEADER_LIMIT]: String(options.max),
        [RATE_LIMIT_HEADER_REMAINING]: String(result.remaining),
        [RATE_LIMIT_HEADER_RESET]: String(result.resetAt),
        [RETRY_AFTER_HEADER]: String(retryAfterSeconds),
      },
    },
  );
}
