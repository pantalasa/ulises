// ENG-1602: wire the ENG-1601 checkout-token cache into the payment flow,
// behind the checkout.cache.enabled flag, with a percentage ramp per merchant.
//
// Stacked on ENG-1601: depends on getToken/checkoutCacheEnabled (cacheFlag.ts)
// and on the checkout_token_cache_hits_total metric (tokenCacheMetrics.ts).
import { checkoutCacheEnabled, getToken } from "./cacheFlag";
import { cacheHitRatio, recordHit, recordMiss } from "../cache/tokenCacheMetrics";

// Deterministic 0..99 bucket per merchant so a given merchant stays on one side
// of the ramp across requests (no flapping while we watch the error rate).
function bucket(merchantId: string): number {
  let h = 0;
  for (const ch of merchantId) h = (h * 31 + ch.charCodeAt(0)) % 100;
  return h;
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
