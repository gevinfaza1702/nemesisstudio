"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * CrossTabLogout component
 * Detects when user logs out in another tab by polling auth cookies
 * and immediately redirects to login page
 */
export default function CrossTabLogout() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Only run on protected pages
        const publicPaths = ["/", "/landing", "/login", "/register", "/admin/login"];
        if (publicPaths.includes(pathname)) {
            return;
        }

        let intervalId = null;
        let isRedirecting = false;
        let checkCount = 0;
        let hadAuthBefore = false;

        const checkAuth = () => {
            if (isRedirecting) return;

            checkCount++;

            // Check if auth cookies exist
            const cookies = document.cookie;
            const hasAuthOk = cookies.includes("auth_ok=");
            const hasAuthUid = cookies.includes("auth_uid=");
            const hasAuth = hasAuthOk && hasAuthUid;

            // First check: remember if we had auth
            if (checkCount === 1) {
                hadAuthBefore = hasAuth;
                return; // Skip first check
            }

            // Grace period: skip first 3 checks (3 seconds) to allow cookies to be set after navigation
            if (checkCount <= 3) {
                if (hasAuth) {
                    hadAuthBefore = true;
                }
                return;
            }

            // Only redirect if we HAD auth before but now it's gone
            // This prevents false positives during login
            if (hadAuthBefore && !hasAuth) {
                isRedirecting = true;
                console.log("[CrossTabLogout] Auth cookies removed in another tab, redirecting to login...");

                // Clear any remaining cookies
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
                } catch (_) { }

                // Redirect to login
                router.push("/login");
            }

            // Update auth status
            if (hasAuth) {
                hadAuthBefore = true;
            }
        };

        // Check auth every 1 second for instant cross-tab logout
        intervalId = setInterval(checkAuth, 1000);

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [pathname, router]);

    return null;
}
