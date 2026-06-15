"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingPromptBar({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  onCancel,
  onSettingsClick,
  model,
  modelLabel = "Veo 3.1",
  status = "",
  genSeconds = 0,
  sidebarOffset = 125,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const inputRef = useRef(null);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isGenerating) {
        onGenerate();
      }
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: isMobile ? "20px" : "40px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "550px",
        maxWidth: isMobile ? "95%" : "90%",
        zIndex: 5000,
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.2)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: isMobile ? "24px" : "32px",
          padding: isMobile ? "10px 14px" : "12px 20px",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? "8px" : "10px",
          boxShadow: "none",
          transition: "all 0.3s ease",
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Row 1: Input Area */}
        <div style={{ width: "100%" }}>
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={isGenerating ? `Generating with ${modelLabel}...` : "Describe your video..."}
            disabled={isGenerating}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#fff",
              fontSize: "14px",
              width: "100%",
              fontFamily: "inherit",
              resize: "none",
              minHeight: "20px",
              maxHeight: "100px",
              overflow: "hidden"
            }}
            rows={1}
            autoComplete="off"
          />
        </div>

        {/* Row 2: Media & Controls */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>

          {/* Left: Status */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {isGenerating && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                background: "rgba(251, 191, 36, 0.1)",
                borderRadius: 8,
                fontSize: 12,
                color: "#fbbf24",
              }}>
                <div style={{
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: "#fbbf24",
                  animation: "pulse 1.5s infinite",
                }} />
                {genSeconds > 0 ? `${genSeconds}s` : "Processing..."}
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* Settings Trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSettingsClick?.();
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                borderRadius: "50%",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              title="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.18-.08a2 2 0 0 0-2 0l-.44.44a2 2 0 0 0 0 2l.08.18a2 2 0 0 1 0 2l-.25.43a2 2 0 0 1-1.73 1l-.18.2V12.22a2 2 0 0 0 0 2v.44a2 2 0 0 1-1 1.73l-.25.43a2 2 0 0 1 0 2l.18.18a2 2 0 0 0 0 2l.44.44a2 2 0 0 0 2 0l.18-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73l.2.18h.44a2 2 0 0 0 2 0v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.18.08a2 2 0 0 0 2 0l.44-.44a2 2 0 0 0 0-2l-.08-.18a2 2 0 0 1 0-2l.25-.43a2 2 0 0 1 1.73-1l.18-.2v-.44a2 2 0 0 0 0-2v-.44a2 2 0 0 1 1-1.73l.25-.43a2 2 0 0 1 0-2l-.18-.18a2 2 0 0 0 0-2l-.44-.44a2 2 0 0 0-2 0l-.18.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73l-.2-.18z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>

            {/* Model Badge */}
            <div style={{ display: "flex", gap: "6px" }}>
              {!isMobile && (
                <div style={{
                  padding: "4px 8px",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "#fbbf24",
                  cursor: "default",
                  whiteSpace: "nowrap",
                }}>
                  {modelLabel}
                </div>
              )}
            </div>

            {/* Separator - hide on mobile */}
            {!isMobile && <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }}></div>}

            {/* Submit / Cancel Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isGenerating) {
                  onCancel();
                } else {
                  onGenerate();
                }
              }}
              disabled={!isGenerating && !prompt.trim()}
              style={{
                height: "32px",
                padding: isMobile ? "0 12px" : "0 16px",
                borderRadius: "16px",
                border: "none",
                background: isGenerating
                  ? "rgba(239, 68, 68, 0.1)"
                  : (!isGenerating && !prompt.trim()) ? "rgba(255,255,255,0.1)" : "#D4AF37",
                color: isGenerating ? "#ef4444" : (!isGenerating && !prompt.trim()) ? "#666" : "#FFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? "4px" : "8px",
                cursor: (!isGenerating && !prompt.trim()) ? "not-allowed" : "pointer",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: 600,
                transition: "all 0.2s"
              }}
              title=""
            >
              {isGenerating ? (
                <>
                  <span style={{ fontSize: "16px" }}>⏹</span>
                  {!isMobile && <span>Stop</span>}
                </>
              ) : (
                <>
                  <span>{isMobile ? "Go" : "Generate"}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
