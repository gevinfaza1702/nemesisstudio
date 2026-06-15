"use client";

import React, { useState, useRef } from "react";

export function ImageGeneratorControls({
  prompt, setPrompt,
  onGenerate,
  busy,
  aspect,
  model,
  onSettingsClick,
  refPreviews,
  pickFileForSlot,
  clearRefSlot,
  isUploading
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [hoverStates, setHoverStates] = useState([false, false, false]); // Track hover for 3 slots
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !busy) {
        onGenerate();
      }
    }
  };

  const renderRefSlot = (index, label) => {
    const data = refPreviews[index];
    const isSlotUploading = isUploading && data && !data.url;
    const isHovering = hoverStates[index];

    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => {
            const newStates = [...hoverStates];
            newStates[index] = true;
            setHoverStates(newStates);
          }}
          onMouseLeave={() => {
            const newStates = [...hoverStates];
            newStates[index] = false;
            setHoverStates(newStates);
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!data) {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (ev) => pickFileForSlot(index, ev.target.files);
                input.click();
              }
            }}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: data ? "transparent" : "rgba(255,255,255,0.08)",
              border: data 
                ? "1px solid #D4AF37"
                : "1px dashed rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: data ? "default" : "pointer",
              color: data ? "#D4AF37" : "#94a3b8",
              transition: "all 0.2s",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {data ? (
              <>
                <img 
                  src={data.dataUrl || data.url} 
                  alt={label}
                  style={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0
                  }} 
                />
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8px",
                  color: "#D4AF37",
                  pointerEvents: "none",
                  zIndex: -1
                }}>
                  ✓
                </div>
              </>
            ) : (
              <span style={{ fontSize: "18px" }}>+</span>
            )}
          </button>
          
          {/* Delete X button on hover */}
          {data && isHovering && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearRefSlot(index);
              }}
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: "rgba(220, 38, 38, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "all 0.2s",
                zIndex: 10,
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 1)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(220, 38, 38, 0.9)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              ×
            </button>
          )}
        </div>
        <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{label}</span>
      </div>
    );
  };

  return (
    <div className="floating-controls-container">
      <div 
        className={`floating-bar ${isFocused ? 'focused' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Input Area */}
        <div style={{ width: "100%" }}>
          <textarea
            ref={inputRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={busy ? "Generating image..." : "Describe your image..."}
            disabled={busy}
            rows={1}
            className="prompt-input-minimal"
          />
        </div>

        {/* Media & Controls */}
        <div className="controls-row">
          <div className="ref-slots-group">
            {renderRefSlot(0, "REF 1")}
            {renderRefSlot(1, "REF 2")}
            {renderRefSlot(2, "REF 3")}
          </div>

          <div className="actions-group">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSettingsClick();
              }}
              className="icon-btn"
              title="Settings"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </button>

            <div className="badge-group">
              <div className="info-badge">{aspect === "landscape" ? "16:9" : "9:16"}</div>
              <div className="info-badge gold">{model.replace('nano-', '').replace('-pro', ' Pro')}</div>
            </div>

            <div className="separator"></div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerate();
              }}
              disabled={busy || !prompt.trim()}
              className="generate-btn-elegant"
            >
              <span>{busy ? "..." : "Generate"}</span>
              {!busy && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
