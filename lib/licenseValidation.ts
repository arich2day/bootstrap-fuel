type CacheEntry = { valid: boolean; instanceName?: string; checkedAt: number };

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export interface LicenseValidation {
  valid: boolean;
  instanceName?: string;
  reason?: string;
}

export async function validateLicenseKey(
  rawKey: string
): Promise<LicenseValidation> {
  const key = rawKey.trim();
  if (!key) return { valid: false, reason: "Empty key" };

  const cached = cache.get(key);
  if (cached && Date.now() - cached.checkedAt < CACHE_TTL_MS) {
    return { valid: cached.valid, instanceName: cached.instanceName };
  }

  const expectedStoreId = process.env.LEMONSQUEEZY_STORE_ID;

  try {
    const res = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new URLSearchParams({ license_key: key }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { valid: false, reason: body || `HTTP ${res.status}` };
    }

    const data = (await res.json()) as {
      valid?: boolean;
      error?: string | null;
      license_key?: { status?: string };
      meta?: { store_id?: number; product_name?: string };
      instance?: { name?: string };
    };

    let valid = Boolean(data.valid) && data.license_key?.status === "active";

    if (
      valid &&
      expectedStoreId &&
      data.meta?.store_id !== Number(expectedStoreId)
    ) {
      valid = false;
    }

    const entry: CacheEntry = {
      valid,
      instanceName: data.meta?.product_name,
      checkedAt: Date.now(),
    };
    cache.set(key, entry);

    return valid
      ? { valid: true, instanceName: entry.instanceName }
      : { valid: false, reason: data.error || "Invalid license" };
  } catch (err) {
    return {
      valid: false,
      reason: err instanceof Error ? err.message : "License lookup failed",
    };
  }
}
