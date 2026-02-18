type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 60 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    store.forEach((entry, key) => {
      if (now > entry.resetAt) {
        store.delete(key);
      }
    });
  }, 60_000);
}

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const RATE_LIMITS = {
  submitIdea: { windowMs: 60_000, maxRequests: 3 },
  castVote: { windowMs: 10_000, maxRequests: 5 },
  auth: { windowMs: 60_000, maxRequests: 10 },
  moderationApi: { windowMs: 86_400_000, maxRequests: 3 },
} as const satisfies Record<string, RateLimitConfig>;

export type RateLimitAction = keyof typeof RATE_LIMITS;

export function checkRateLimit(
  identifier: string,
  action: RateLimitAction
): { success: boolean; retryAfterMs?: number } {
  const config = RATE_LIMITS[action];
  const key = `${action}:${identifier}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { success: true };
  }

  if (entry.count >= config.maxRequests) {
    return { success: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count++;
  return { success: true };
}
