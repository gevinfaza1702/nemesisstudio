export const DEFAULT_ALLOC = {
  budget: 50,
  single: 15,
  batch: 30,
  frame: 5,
};

export const QUOTA_KEYS = {
  alloc: "veo_quota_alloc",
  single: "veo_quota_single",
  batch: "veo_quota_batch",
  frame: "veo_quota_frame",
  extend: "veo_quota_single", // Share quota with single
};

export function readQuotaAlloc() {
  if (typeof window === "undefined") return DEFAULT_ALLOC;
  try {
    const raw = localStorage.getItem(QUOTA_KEYS.alloc);
    if (!raw) return DEFAULT_ALLOC;
    const data = JSON.parse(raw);
    return { ...DEFAULT_ALLOC, ...data };
  } catch {
    return DEFAULT_ALLOC;
  }
}

export function writeQuotaAlloc(alloc) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUOTA_KEYS.alloc, JSON.stringify(alloc));
}

export function readQuota(mode) {
  if (typeof window === "undefined") return { count: 0, date: new Date().toDateString() };
  const key = QUOTA_KEYS[mode] || QUOTA_KEYS.single;
  const today = new Date().toDateString();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { count: 0, date: today };
    const data = JSON.parse(raw);
    if (data.date !== today) {
      // Reset if different day
      return { count: 0, date: today };
    }
    return data;
  } catch {
    return { count: 0, date: today };
  }
}

export function writeQuota(mode, count) {
  if (typeof window === "undefined") return;
  const key = QUOTA_KEYS[mode] || QUOTA_KEYS.single;
  const today = new Date().toDateString();
  localStorage.setItem(key, JSON.stringify({ count, date: today }));
}

export function getQuotaLimit(mode) {
  const alloc = readQuotaAlloc();
  if (mode === "extend") return alloc.single || 0; // Share limit with single
  return alloc[mode] || 0;
}

export function checkQuota(mode, amount = 1) {
  const q = readQuota(mode);
  const limit = getQuotaLimit(mode);
  return {
    ok: q.count + amount <= limit,
    current: q.count,
    limit,
    remaining: Math.max(0, limit - q.count)
  };
}
