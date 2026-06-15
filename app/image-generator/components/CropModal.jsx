"use client";

import { useState } from "react";
import { CropCanvas } from "../utils";

export function CropModal({
  isOpen, onClose,
  cropImg,
  aspect, setAspect,
  scale, setScale,
  offset, setOffset,
  onConfirm,
  uploadStatus = "",
  uploadedMediaId = ""
}) {
  if (!isOpen || !cropImg) return null;

  const aspectRatios = [
    { key: "landscape", label: "Landscape", ratio: 16/9 },
    { key: "portrait", label: "Portrait", ratio: 9/16 },
    { key: "square", label: "Square", ratio: 1 }
  ];

  const currentAspect = aspectRatios.find(a => a.key === aspect) || aspectRatios[0];
  const isUploading = uploadStatus && uploadStatus !== "" && uploadedMediaId !== "ERROR";
  const hasMediaId = uploadedMediaId && uploadedMediaId !== "" && uploadedMediaId !== "ERROR";
  const hasError = uploadedMediaId === "ERROR";

  return (
    <div className="modal-overlay" style={{ display: "flex" }}>
      <div className="modal-content" style={{ maxWidth: 800, width: "95%" }}>
        <h2 style={{ marginBottom: 15 }}>Sesuaikan Gambar</h2>
        
        {/* Aspect Ratio Selector */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: 14, color: "#9CA3AF" }}>
            Rasio Aspek
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {aspectRatios.map(ar => (
              <button
                key={ar.key}
                className={`btn ${aspect === ar.key ? 'primary' : 'ghost'}`}
                onClick={() => setAspect && setAspect(ar.key)}
                disabled={isUploading}
                style={{ flex: 1, fontSize: 13 }}
              >
                {ar.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "#111", padding: 20, borderRadius: 12, marginBottom: 20 }}>
          <CropCanvas
            src={cropImg.dataUrl}
            aspect={currentAspect.ratio}
            scale={scale}
            offset={offset}
            onOffsetChange={setOffset}
            onScaleInit={setScale}
          />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", marginBottom: 8 }}>Zoom: {Math.round(scale * 100)}%</label>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            disabled={isUploading}
            style={{ width: "100%", accentColor: "#D4AF37" }}
          />
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div style={{ 
            marginBottom: 20, 
            padding: 12, 
            background: hasError ? "rgba(220, 38, 38, 0.1)" : hasMediaId ? "rgba(16, 185, 129, 0.1)" : "rgba(212, 175, 55, 0.1)",
            borderRadius: 8,
            border: `1px solid ${hasError ? "rgba(220, 38, 38, 0.3)" : hasMediaId ? "rgba(16, 185, 129, 0.3)" : "rgba(212, 175, 55, 0.3)"}` 
          }}>
            <div style={{ fontSize: 14, color: hasError ? "#dc2626" : hasMediaId ? "#10b981" : "#D4AF37", marginBottom: 4 }}>
              {uploadStatus}
            </div>
            {hasMediaId && !hasError && (
              <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "monospace", wordBreak: "break-all" }}>
                Media ID: {uploadedMediaId}
              </div>
            )}
          </div>
        )}

        <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          {!isUploading && !hasMediaId && !hasError && (
            <button className="btn ghost" onClick={onClose}>Batal</button>
          )}
          {!hasMediaId && !hasError ? (
            <button 
              className="btn primary" 
              onClick={onConfirm}
              disabled={isUploading}
            >
              {isUploading ? "Mengupload..." : "Simpan & Lanjut"}
            </button>
          ) : (
            <button className="btn primary" onClick={onClose}>
              Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
