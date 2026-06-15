"use client";

import { useState, useEffect } from "react";
import { CropCanvas, renderCropToDataUrl } from "../image-generator/utils";

export default function LegacyCropperModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [cropImg, setCropImg] = useState(null); // { dataUrl: ... }
  const [aspect, setAspect] = useState("landscape"); // "landscape", "portrait", "square"
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Legacy State Support
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedMediaId, setUploadedMediaId] = useState("");
  const [legacyCallback, setLegacyCallback] = useState(null); // fn(url, name, mime)
  const [legacyFileName, setLegacyFileName] = useState("image.png");
  const [legacyMime, setLegacyMime] = useState("image/png");

  useEffect(() => {
    // Legacy mapping helper
    const mapAspectKeyToSimple = (key) => {
      switch (key) {
        case "IMAGE_ASPECT_RATIO_PORTRAIT":
        case "VIDEO_ASPECT_RATIO_PORTRAIT":
          return "portrait";
        case "IMAGE_ASPECT_RATIO_SQUARE":
        case "VIDEO_ASPECT_RATIO_SQUARE":
          return "square";
        default:
          return "landscape";
      }
    };

    // Expose global function for legacy calls
    window.openCropperWithDataUrl = (dataUrl, target, fileName = "image.png", mime = "image/png") => {
      console.log("Opening Legacy Cropper (Refactored) with", { fileName, mime });

      const info = (target && typeof target === "object") ? target : {};
      const aspectKey = info.aspect || "IMAGE_ASPECT_RATIO_LANDSCAPE";

      setCropImg({ dataUrl });
      setAspect(mapAspectKeyToSimple(aspectKey));
      setLegacyCallback(() => info.onSave);
      setLegacyFileName(fileName);
      setLegacyMime(mime);

      // Reset generic state
      setScale(1);
      setOffset({ x: 0, y: 0 });
      setUploadStatus("");
      setUploadedMediaId("");
      setIsOpen(true);
    };

    return () => {
      delete window.openCropperWithDataUrl;
    };
  }, []);

  const handleConfirm = async () => {
    if (!cropImg || !legacyCallback) return;

    setUploadStatus("Memproses...");
    try {
      // 1. Render crop logic
      const aspectRatioMap = {
        landscape: 16 / 9,
        portrait: 9 / 16,
        square: 1
      };
      const numericAspect = aspectRatioMap[aspect] || 16 / 9;

      const outUrl = await renderCropToDataUrl(
        cropImg.dataUrl,
        numericAspect,
        scale,
        offset
      );

      // 2. Call legacy callback (might upload to Labs)
      console.log("[LegacyCropperModal] Calling legacy onSave...");
      const result = await legacyCallback(outUrl, legacyFileName, legacyMime);

      // 3. Handle result
      if (result && result.mediaId) {
        setUploadedMediaId(result.mediaId);
        setUploadStatus("Tersimpan ✅");
        // Do NOT close, show Media ID as per old logic
      } else {
        // If no mediaId returned (e.g. just local crop), strict legacy behavior was to close
        // But if it was an upload that returned nothing, maybe just close.
        setIsOpen(false);
      }
    } catch (err) {
      console.error("[LegacyCropperModal] Failed:", err);
      setUploadStatus("Gagal ❌");
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCropImg(null);
  };

  if (!isOpen || !cropImg) return null;

  const aspectRatios = [
    { key: "landscape", label: "Landscape", ratio: 16 / 9 },
    { key: "portrait", label: "Portrait", ratio: 9 / 16 },
    { key: "square", label: "Square", ratio: 1 }
  ];

  const currentAspect = aspectRatios.find(a => a.key === aspect) || aspectRatios[0];
  const isUploading = uploadStatus && uploadStatus !== "" && !uploadStatus.includes("Gagal") && !uploadedMediaId;
  const hasMediaId = !!uploadedMediaId;
  const hasError = uploadStatus && uploadStatus.includes("Gagal");

  return (
    <div className="modal-overlay" style={{ display: "flex" }}>
      <div className="modal-content" style={{ maxWidth: 800, width: "95%" }}>
        <h2 style={{ marginBottom: 15, fontWeight: 700, fontSize: "1.25rem" }}>Sesuaikan Gambar</h2>

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
                onClick={() => setAspect(ar.key)}
                disabled={isUploading || hasMediaId}
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
            disabled={isUploading || hasMediaId}
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
            disabled={isUploading || hasMediaId}
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
            {hasMediaId && (
              <div style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "monospace", wordBreak: "break-all" }}>
                Media ID: {uploadedMediaId}
              </div>
            )}
            {hasMediaId && (
              <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "6px", lineHeight: "1.4" }}>
                Dibuat otomatis oleh sistem sistem. Silakan tutup modal ini.
              </div>
            )}
          </div>
        )}

        <div className="modal-actions" style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          {!isUploading && !hasMediaId && !hasError && (
            <button className="btn ghost" onClick={handleClose}>Batal</button>
          )}

          {!hasMediaId ? (
            <button
              className="btn primary"
              onClick={handleConfirm}
              disabled={isUploading}
            >
              {isUploading ? "Memproses..." : "Simpan & Lanjut"}
            </button>
          ) : (
            <button className="btn primary" onClick={handleClose}>
              Tutup
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 6000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .modal-content {
          background: rgba(15, 15, 15, 0.95);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          color: #fff;
          width: 100%;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn.primary {
          background: #D4AF37;
          color: #000;
        }

        .btn.primary:hover {
          background: #C5A028;
        }

        .btn.primary:disabled {
          background: rgba(212, 175, 55, 0.3);
          color: rgba(0, 0, 0, 0.5);
          cursor: not-allowed;
        }

        .btn.ghost {
          background: transparent;
          color: #94a3b8;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn.ghost:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
        }
      `}</style>
    </div>
  );
}
