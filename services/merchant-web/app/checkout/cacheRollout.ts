// ENG-1602: wire the ENG-1601 checkout-token cache into the payment flow,
// behind the checkout.cache.enabled flag, with a percentage ramp per merchant.
//
// Stacked on ENG-1601: depends on getToken/checkoutCacheEnabled (cacheFlag.ts)
// and on the checkout_token_cache_hits_total metric (tokenCacheMetrics.ts).
import { checkoutCacheEnabled, getToken } from "./cacheFlag";
import { cacheHitRatio, recordHit, recordMiss } from "../cache/tokenCacheMetrics";

// Deterministic 0..99 bucket per merchant so a given merchant stays on one side
// of the ramp across requests (no flapping while we watch the error rate).
//
// DP-62: fold the modulus in only once, at the end. The previous hash took
// `% 100` on every iteration, which collapses the running state to 0..99
// mid-stream and mixes poorly — buckets clustered, so an N% ramp did not map to
// ~N% of merchants and rollout sampling was skewed. FNV-1a over the whole id,
// kept 32-bit via Math.imul/`>>> 0`, gives an even 0..99 spread.
function bucket(merchantId: string): number {
  let h = 0x811c9dc5; // FNV-1a 32-bit offset basis
  for (const ch of merchantId) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 0x01000193); // FNV prime
  }
  return (h >>> 0) % 100;
}

export function cacheEnabledForMerchant(
  merchantId: string,
  rampPercent: number,
): boolean {
  if (!checkoutCacheEnabled()) return false;
  return bucket(merchantId) < rampPercent;
}

// Resolve a checkout token for a merchant, using the cache only when the flag is
// on AND the merchant falls inside the current ramp (start at 1%).
export async function tokenForMerchant(
  merchantId: string,
  key: string,
  fromRedis: (k: string) => Promise<string>,
  rampPercent = 1,
): Promise<string> {
  if (!cacheEnabledForMerchant(merchantId, rampPercent)) {
    recordMiss();
    return fromRedis(key);
  }
  const tok = await getToken(key, fromRedis);
  recordHit();
  return tok;
}

export { cacheHitRatio };
