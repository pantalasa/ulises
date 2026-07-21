// ENG-1601: in-memory LRU in front of the Redis checkout-token cache.
// Cuts p99 latency on GET /checkout/token by serving the hot ~1k tokens locally.
export class LruCache<V> {
  private max: number;
  private map = new Map<string, V>();
  constructor(max = 1024) {
    this.max = max;
  }
  get(key: string): V | undefined {
    const v = this.map.get(key);
    if (v !== undefined) {
      this.map.delete(key);
      this.map.set(key, v); // mark most-recently-used
    }
    return v;
  }
  add(key: string, val: V): void {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, val);
    if (this.map.size > this.max) {
      this.map.delete(this.map.keys().next().value as string);
    }
  }
}
