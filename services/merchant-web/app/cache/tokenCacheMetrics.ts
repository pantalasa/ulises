// ENG-1601: metrics + invalidation for the in-memory checkout-token LRU.
//
// Complements the LRU in app/cache/lru.ts by (a) emitting the
// checkout_token_cache_hits_total metric so we can watch hit ratio on the hot
// GET /checkout/token path, and (b) invalidating entries when a merchant
// changes settings (the merchant.settings.updated event), so a cached token
// never outlives the config it was minted under.
import { LruCache } from "./lru";

let hits = 0;
let misses = 0;

export function recordHit(): void {
  hits += 1;
}

export function recordMiss(): void {
  misses += 1;
}

// checkout_token_cache_hits_total — scraped from the web tier's /metrics.
export function checkoutTokenCacheHitsTotal(): number {
  return hits;
}

export function cacheHitRatio(): number {
  const total = hits + misses;
  return total === 0 ? 0 : hits / total;
}

// Drop a merchant's cached token when its settings change. Called from the
// merchant.settings.updated handler so the next lookup re-mints from Redis.
export function invalidateForMerchant(
  cache: LruCache<string>,
  merchantId: string,
): void {
  cache.delete(`checkout-token:${merchantId}`);
}
