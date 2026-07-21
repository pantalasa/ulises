// ENG-1601: in-memory LRU in front of the Redis checkout-token cache.
// Cuts p99 latency on GET /checkout/token by serving the hot ~1k tokens locally.
//
// ENG-1610: entries now carry a TTL so a locally-cached token can't outlive the
// Redis TTL it was minted under. Expired entries are dropped lazily on read and
// can be reclaimed in bulk via purgeExpired() (driven by the ENG-1611 sweeper).
interface Entry<V> {
  val: V;
  expiresAt: number; // epoch ms; Infinity when no TTL is configured
}

export class LruCache<V> {
  private max: number;
  private ttlMs: number;
  private now: () => number;
  private map = new Map<string, Entry<V>>();

  // ttlMs <= 0 keeps the original never-expire behaviour. `now` is injectable so
  // expiry is deterministic under test.
  constructor(max = 1024, ttlMs = 0, now: () => number = Date.now) {
    this.max = max;
    this.ttlMs = ttlMs;
    this.now = now;
  }

  get(key: string): V | undefined {
    const e = this.map.get(key);
    if (e === undefined) return undefined;
    if (e.expiresAt <= this.now()) {
      this.map.delete(key); // ENG-1610: expired -> treat as a miss
      return undefined;
    }
    this.map.delete(key);
    this.map.set(key, e); // mark most-recently-used
    return e.val;
  }

  add(key: string, val: V): void {
    if (this.map.has(key)) this.map.delete(key);
    const expiresAt = this.ttlMs > 0 ? this.now() + this.ttlMs : Infinity;
    this.map.set(key, { val, expiresAt });
    if (this.map.size > this.max) {
      this.map.delete(this.map.keys().next().value as string);
    }
  }

  // ENG-1601: explicit eviction so merchant.settings.updated can invalidate.
  delete(key: string): boolean {
    return this.map.delete(key);
  }

  // ENG-1610: drop every entry whose TTL has elapsed and return the count
  // removed, so the sweeper (ENG-1611) can emit an eviction metric.
  purgeExpired(): number {
    const cutoff = this.now();
    let removed = 0;
    for (const [key, e] of this.map) {
      if (e.expiresAt <= cutoff) {
        this.map.delete(key);
        removed += 1;
      }
    }
    return removed;
  }
}
