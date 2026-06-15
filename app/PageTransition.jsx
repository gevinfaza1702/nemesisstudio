"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="page-transition-motion"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

