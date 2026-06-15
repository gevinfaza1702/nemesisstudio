"use client";

import { useEffect, useRef } from "react";

export default function ScrollPerf() {
  const timerRef = useRef(null);
  const lastYRef = useRef(0);

  useEffect(() => {
    let ticking = false;
    const navbarRef = document.querySelector('.navbar');

    const onScroll = () => {
      // Tanda sedang scroll: kurangi efek berat via CSS
      document.body.classList.add("scrolling");
      // Hapus tanda setelah idle sebentar
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        document.body.classList.remove("scrolling");
      }, 120);

      if (!ticking) {
        window.requestAnimationFrame(() => {
            const y = window.scrollY || 0;
            const last = lastYRef.current || 0;
            
            if (navbarRef) {
                // Optimize class updates: check before add/remove
                if (y > last + 4 && y > 60) {
                   if (!navbarRef.classList.contains('nav-hidden')) navbarRef.classList.add('nav-hidden');
                } else {
                   if (navbarRef.classList.contains('nav-hidden')) navbarRef.classList.remove('nav-hidden');
                }
                
                if (y > 4) {
                   if (!navbarRef.classList.contains('nav-active')) navbarRef.classList.add('nav-active');
                } else {
                   if (navbarRef.classList.contains('nav-active')) navbarRef.classList.remove('nav-active');
                }
            }
            lastYRef.current = y;
            ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return null;
}
