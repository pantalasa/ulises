// ENG-1611: background sweeper for the checkout-token LRU.
//
// Stacked on ENG-1610: the LRU now expires entries lazily on read, but a token
// that is written once and never read again would linger in the map until
// capacity pressure evicts it. This sweeper calls purgeExpired() on an interval
// and feeds the removed count into checkout_token_cache_evictions_total, so
// expired tokens are reclaimed promptly and the eviction rate is observable.
import { LruCache } from "./lru";
import { recordEvictions } from "./tokenCacheMetrics";

export interface Sweeper {
  stop(): void;
}

// Sweep expired entries every intervalMs (default 30s). The timer is unref()'d
// so it never keeps the process alive during shutdown.
export function startSweeper<V>(
  cache: LruCache<V>,
  intervalMs = 30_000,
): Sweeper {
  const timer = setInterval(() => {
    const removed = cache.purgeExpired();
    if (removed > 0) recordEvictions(removed);
  }, intervalMs);
  if (typeof timer.unref === "function") timer.unref();
  return { stop: () => clearInterval(timer) };
}
