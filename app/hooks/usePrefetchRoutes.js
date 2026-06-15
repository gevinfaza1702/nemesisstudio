"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Prefetches common routes on mount for faster navigation.
 * Call this hook once in a layout or top-level component.
 */
export function usePrefetchRoutes() {
  const router = useRouter();
  
  useEffect(() => {
    // Delay prefetch to prioritize initial render
    const timer = setTimeout(() => {
      const routes = [
        "/prompt-tunggal",
        "/dashboard", 
        "/image-generator",
        "/profile",
      ];
      routes.forEach((route) => {
        try {
          router.prefetch(route);
        } catch (_) {}
      });
    }, 1000); // 1 second delay
    
    return () => clearTimeout(timer);
  }, [router]);
}

export default usePrefetchRoutes;
