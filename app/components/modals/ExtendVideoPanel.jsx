"use client";

import React, { useState, useEffect, useRef } from "react";

export default function ExtendVideoPanel({
  isOpen,
  onClose,
  onSubmit,
  initialPrompt,
  selectedModel
}) {
  const [prompt, setPrompt] = useState(initialPrompt || "lanjutkan");
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset prompt when opening
  useEffect(() => {
    if (isOpen) {
      setPrompt(initialPrompt || "lanjutkan");
      // Focus input shortly after open
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialPrompt]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    onSubmit(prompt);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 10000,
        pointerEvents: "none", // Let clicks pass through backdrop
      }}
    >
      {/* Backdrop - Clickable to close */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          pointerEvents: "auto",
          backdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

      {/* Floating Bar */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? "20px" : "40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: isMobile ? "calc(100% - 20px)" : "700px",
          maxWidth: "94%",
          background: "#0f0f0f",
          border: "1px solid #333",
          borderRadius: isMobile ? "16px" : "24px",
          padding: isMobile ? "12px" : "12px 16px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "stretch" : "center",
          gap: isMobile ? "10px" : "12px",
          boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
          pointerEvents: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Row on Mobile: Mode Selector + Input */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "8px" : "12px",
          flex: isMobile ? "none" : 1,
        }}>
          {/* Mode Selector (Left) */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(212, 175, 55, 0.05))",
            padding: isMobile ? "6px 10px" : "8px 12px",
            borderRadius: isMobile ? "10px" : "12px",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            cursor: "default",
            flexShrink: 0,
          }}>
            <svg
              width={isMobile ? "14" : "16"}
              height={isMobile ? "14" : "16"}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
            <span style={{
              fontSize: isMobile ? "11px" : "13px",
              fontWeight: 600,
              color: "#e5e5e5",
              whiteSpace: "nowrap"
            }}>Extend Video</span>
          </div>

          {/* Input Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
            <input
              ref={inputRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Deskripsikan sambungan adegan..."
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: isMobile ? "14px" : "15px",
                width: "100%",
                fontFamily: "inherit"
              }}
              autoComplete="off"
            />
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!prompt.trim()}
            style={{
              width: isMobile ? "32px" : "28px",
              height: isMobile ? "32px" : "28px",
              borderRadius: "50%",
              border: "none",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: prompt.trim() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              flexShrink: 0,
              outline: "none",
              boxShadow: "none",
            }}
          >
            <span style={{
              fontSize: "16px",
              fontWeight: "bold",
              lineHeight: 1,
              color: prompt.trim() ? "#D4AF37" : "#666"
            }}>
              ▶
            </span>
          </button>
        </div>
      </div>

      {/* Close Hint */}
      <div style={{
        position: "absolute",
        bottom: isMobile ? "8px" : "16px",
        left: "50%",
        transform: "translateX(-50%)",
        color: "rgba(255,255,255,0.4)",
        fontSize: isMobile ? "10px" : "12px",
        pointerEvents: "none"
      }}>
        Tekan Esc untuk menutup
      </div>
    </div>
  );
}
