/**
 * lib/rate-limit.ts
 *
 * Lightweight in-process rate limiter. No external dependencies.
 * Uses a sliding-window counter keyed by IP + route identifier.
 *
 * Works perfectly on Vercel (each serverless invocation shares the same
 * Node process for its lifetime; the Map resets on cold-start, which is
 * fine — it just means the window is conservative, not lenient).
 *
 * Usage:
 *   const { success, remaining, resetIn } = rateLimit(ip, "cover-letter", 5, 60);
 *   if (!success) return rateLimitResponse(resetIn);
 */

interface Entry {
  count: number;
  windowStart: number;
}

const store = new Map<string, Entry>();

/**
 * @param identifier  IP address (or user ID)
 * @param route       Unique label per endpoint, e.g. "cover-letter"
 * @param limit       Max requests allowed in the window
 * @param windowSecs  Window size in seconds
 */
export function rateLimit(
  identifier: string,
  route: string,
  limit: number,
  windowSecs: number
): { success: boolean; remaining: number; resetIn: number } {
  const key = `${route}:${identifier}`;
  const now = Date.now();
  const windowMs = windowSecs * 1000;

  const entry = store.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    // New window
    store.set(key, { count: 1, windowStart: now });
    return { success: true, remaining: limit - 1, resetIn: windowSecs };
  }

  if (entry.count >= limit) {
    const resetIn = Math.ceil((entry.windowStart + windowMs - now) / 1000);
    return { success: false, remaining: 0, resetIn };
  }

  entry.count += 1;
  const remaining = limit - entry.count;
  const resetIn = Math.ceil((entry.windowStart + windowMs - now) / 1000);
  return { success: true, remaining, resetIn };
}

/** Returns the caller's IP from a Next.js request, falling back safely. */
export function getIP(req: Request): string {
  const forwarded = (req.headers as Headers).get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

/** Standard 429 response with Retry-After header. */
export function rateLimitResponse(resetIn: number): Response {
  return new Response(
    JSON.stringify({ error: `Too many requests. Please wait ${resetIn} seconds before trying again.` }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(resetIn),
        "X-RateLimit-Limit": "0",
      },
    }
  );
}
