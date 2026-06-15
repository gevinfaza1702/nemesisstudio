"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "./lib/supabaseClient";

const SESSION_TIMEOUT_SECONDS = 60 * 60 * 5; // 5 jam
const VALIDATION_CACHE_MS = 30000; // 30 seconds cache

// Module-level cache for session validation
let lastValidationTime = 0;
let lastValidationResult = true;

function hasSessionCookie() {
  try {
    return /(?:^|; )sessionExpiry=/.test(document.cookie || "");
  } catch (_) {
    return false;
  }
}

function refreshSessionCookie() {
  try {
    document.cookie = `sessionExpiry=1; path=/; max-age=${SESSION_TIMEOUT_SECONDS}`;
  } catch (_) {}
}

async function performLogout(router) {
  try {
    if (supabase) {
      await supabase.auth.signOut();
    }
  } catch (_) {}

  try {
    await fetch("/api/session/logout", { method: "POST" });
  } catch (_) {}

  try {
    const names = [
      "plan",
      "planExpiry",
      "uid",
      "email",
      "name",
      "username",
      "sessionExpiry",
    ];
    for (const n of names) {
      document.cookie = `${n}=; path=/; max-age=0`;
    }
  } catch (_) {}

  try {
    router.push("/login");
  } catch (_) {
    try {
      window.location.href = "/login";
    } catch (_) {}
  }
}

export default function SessionGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const publicPaths = new Set([
      "/",
      "/landing",
      "/login",
      "/register",
      "/admin/login",
    ]);

    if (publicPaths.has(pathname)) {
      return;
    }

    let destroyed = false;
    let timer = null;
    const events = ["click", "keydown", "mousemove", "scroll"];

    const cleanupAndLogout = () => {
      if (destroyed) return;
      destroyed = true;
      try {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      } catch (_) {}
      try {
        events.forEach((evt) => {
          window.removeEventListener(evt, refresh);
        });
      } catch (_) {}
      performLogout(router);
    };

    const refresh = () => {
      if (destroyed) return;
      refreshSessionCookie();
    };

    const checkAndMaybeLogout = () => {
      if (destroyed) return;
      if (!hasSessionCookie()) {
        cleanupAndLogout();
        return;
      }
      
      // Check cache - skip API call if validated within last 30 seconds
      const now = Date.now();
      if (now - lastValidationTime < VALIDATION_CACHE_MS && lastValidationResult) {
        return; // Skip validation, use cached result
      }
      
      (async () => {
        try {
          const resp = await fetch("/api/session/validate", {
            method: "GET",
            credentials: "include",
          });
          
          lastValidationTime = Date.now();
          
          if (!resp.ok) {
            lastValidationResult = false;
            cleanupAndLogout();
            return;
          }
          let data = null;
          try {
            data = await resp.json();
          } catch (_) {
            data = null;
          }
          if (!data || data.ok !== true) {
            lastValidationResult = false;
            cleanupAndLogout();
          } else {
            lastValidationResult = true;
          }
        } catch (_) {
          // On error, don't invalidate cache to prevent logout on network blips
        }
      })();
    };

    checkAndMaybeLogout();
    if (destroyed) return;

    try {
      events.forEach((evt) => {
        window.addEventListener(evt, refresh);
      });
    } catch (_) {}

    refresh();
    try {
      timer = window.setInterval(checkAndMaybeLogout, 60 * 1000);
    } catch (_) {}

    return () => {
      destroyed = true;
      try {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      } catch (_) {}
      try {
        events.forEach((evt) => {
          window.removeEventListener(evt, refresh);
        });
      } catch (_) {}
    };
  }, [pathname, router]);

  return null;
}
