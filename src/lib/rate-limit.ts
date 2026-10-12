const hits = new Map<string, { count: number; resetAt: number }>();

/**
 * True when `request` already used up `max` calls to `name` in the last `windowMs`.
 * ponytail: in-memory per process, fine for one Node server; use Redis/Upstash if the app runs on several instances.
 */
export function isRateLimited(request: Request, name: string, max: number, windowMs: number) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const key = `${name}:${ip}`;
  const now = Date.now();

  if (hits.size > 5000) for (const [k, v] of hits) if (v.resetAt < now) hits.delete(k);

  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > max;
}

export const tooManyRequests = () =>
  Response.json({ error: "Demasiados intentos. Espera unos minutos e inténtalo de nuevo." }, { status: 429 });
