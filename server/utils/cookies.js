/**
 * Cookie and Time Utilities for Server
 */

// ===== Parse Cookies =====
export const parseCookies = (cookieHeader) => {
  try {
    const map = Object.fromEntries(
      String(cookieHeader || "")
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const i = s.indexOf("=");
          const k = i >= 0 ? s.slice(0, i).trim() : s;
          const v = i >= 0 ? s.slice(i + 1).trim() : "";
          return [k, decodeURIComponent(v)];
        })
    );
    return map;
  } catch (_) {
    return {};
  }
};

// ===== Quota Today String =====
// Zona waktu logika reset kuota (menit offset dari UTC).
// Default: 420 menit (UTC+7, mis. WIB). Bisa di-override via env QUOTA_TZ_OFFSET_MINUTES.
const QUOTA_TZ_OFFSET_MINUTES = Number(
  process.env.QUOTA_TZ_OFFSET_MINUTES || "420"
);

export const quotaTodayStr = () => {
  try {
    const now = new Date();
    // Konversi ke UTC lalu geser ke zona kuota tetap (mis. WIB)
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
    const localMs = utcMs + QUOTA_TZ_OFFSET_MINUTES * 60000;
    const d = new Date(localMs);
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, "0");
    const s = String(d.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${s}`;
  } catch (_) {
    try {
      return new Date().toISOString().slice(0, 10);
    } catch (_) {
      return "1970-01-01";
    }
  }
};
