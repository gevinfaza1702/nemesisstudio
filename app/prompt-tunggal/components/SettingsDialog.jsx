"use client";

import React from "react";

export default function SettingsDialog({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 9999, // Just below Floating Bar (5000) or above? Floating Bar is 5000. Let's go higher for modal.
        zIndex: 6000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Dialog Content */}
      <div
        style={{
          position: "relative",
          width: "500px",
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
          background: "#0f0f0f",
          border: "1px solid #333",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.8)",
          color: "#fff",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
           <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Pengaturan</h3>
           <button 
             onClick={onClose}
             style={{ background: "transparent", border: "none", color: "#666", fontSize: "20px", cursor: "pointer" }}
           >
             ✕
           </button>
        </div>
        {children}
      </div>
    </div>
  );
}
