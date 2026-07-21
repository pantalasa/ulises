// ENG-1602: wire the ENG-1601 checkout-token LRU into the payment flow,
// behind the `checkout.cache.enabled` feature flag (default off).
import { LruCache } from "../cache/lru";

const tokenCache = new LruCache<string>(1024);

export function checkoutCacheEnabled(): boolean {
  return process.env.CHECKOUT_CACHE_ENABLED === "true";
}

export async function getToken(
  key: string,
  fromRedis: (k: string) => Promise<string>,
): Promise<string> {
  if (!checkoutCacheEnabled()) return fromRedis(key);
  const hit = tokenCache.get(key);
  if (hit !== undefined) return hit; // fast path
  const tok = await fromRedis(key);
  tokenCache.add(key, tok);
  return tok;
}
