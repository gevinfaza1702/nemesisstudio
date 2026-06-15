"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ErrorModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          style={{
            width: "400px",
            maxWidth: "90%",
            background: "#1e293b",
            border: "1px solid rgba(239, 68, 68, 0.5)",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ef4444",
                fontSize: "20px",
              }}
            >
              ⚠️
            </div>
            <h3 style={{ margin: 0, color: "#f8fafc", fontSize: "18px" }}>
              Terjadi Kesalahan
            </h3>
          </div>
          
          <p style={{ margin: 0, color: "#94a3b8", lineHeight: "1.5" }}>
            {message || "Terjadi kesalahan yang tidak diketahui."}
          </p>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                padding: "8px 20px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: 500,
                fontSize: "14px",
              }}
            >
              Tutup
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
