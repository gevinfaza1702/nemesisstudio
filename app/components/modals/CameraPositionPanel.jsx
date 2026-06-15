"use client";

import React, { useState, useEffect } from "react";

export default function CameraPositionPanel({
  isOpen,
  onClose,
  onSubmit,
}) {
  const [selectedMove, setSelectedMove] = useState(null);

  useEffect(() => {
    if (isOpen) setSelectedMove(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMove = (move) => {
    setSelectedMove(move);
  };

  const handleSubmit = () => {
    if (!selectedMove) return;
    // Map move to prompt text
    const promptMap = {
      "pan_left": "Pan Camera Left",
      "pan_right": "Pan Camera Right",
      "pan_up": "Pan Camera Up",
      "pan_down": "Pan Camera Down",
      "zoom_in": "Zoom In",
      "zoom_out": "Zoom Out",
      "static": "Static Camera"
    };
    onSubmit(promptMap[selectedMove] || "Static Camera");
  };

  const renderArrowBtn = (move, icon, rotate = 0) => {
      const isSelected = selectedMove === move;
      return (
        <button
            onClick={() => handleMove(move)}
            style={{
                width: "60px",
                height: "60px",
                borderRadius: "12px",
                background: isSelected ? "#3b82f6" : "#1f2937",
                border: isSelected ? "1px solid #60a5fa" : "1px solid #374151",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s"
            }}
        >
            <span style={{ fontSize: "24px", transform: `rotate(${rotate}deg)` }}>{icon}</span>
        </button>
      );
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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div 
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div
        style={{
          position: "relative",
          background: "#111827",
          border: "1px solid #374151",
          borderRadius: "16px",
          padding: "24px",
          width: "320px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0, color: "#f3f4f6", fontSize: "18px", fontWeight: 600 }}>Camera Position</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", fontSize: "20px" }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
            {/* Top */}
            {renderArrowBtn("pan_up", "⬆️")}
            
            {/* Middle Row */}
            <div style={{ display: "flex", gap: "10px" }}>
                {renderArrowBtn("pan_left", "⬅️")}
                <div style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
                    🎥
                </div>
                {renderArrowBtn("pan_right", "➡️")}
            </div>

            {/* Bottom */}
            {renderArrowBtn("pan_down", "⬇️")}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "24px" }}>
             {renderArrowBtn("zoom_in", "🔍+")}
             {renderArrowBtn("zoom_out", "🔍-")}
        </div>

        <button
            onClick={handleSubmit}
            disabled={!selectedMove}
            style={{
                width: "100%",
                padding: "12px",
                background: selectedMove ? "#2563eb" : "#374151",
                color: selectedMove ? "#fff" : "#9ca3af",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: selectedMove ? "pointer" : "not-allowed",
                transition: "background 0.2s"
            }}
        >
            Apply Camera Move
        </button>

      </div>
    </div>
  );
}
