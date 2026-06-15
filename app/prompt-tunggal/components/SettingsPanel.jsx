"use client";

import React, { useState } from "react";

const MODEL_OPTIONS = [
  { value: "veo-3.1-fast", label: "Veo 3.1", icon: "🎬" },
  { value: "sora-2", label: "Sora 2", icon: "✨" },
  { value: "sora-2-pro", label: "Sora Pro", icon: "⚡" },
  { value: "grok", label: "Grok 3", icon: "🔮" },
];

const VEO_ORIENTATIONS = [
  { value: "landscape", label: "Landscape (16:9)" },
  { value: "portrait", label: "Portrait (9:16)" },
];

const SORA_ORIENTATIONS = [
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
];

const GROK_ASPECTS = [
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" },
  { value: "square", label: "Square" },
  { value: "3:2", label: "3:2" },
  { value: "2:3", label: "2:3" },
];

const VEO_RESOLUTIONS = [
  { value: "720p", label: "720p" },
  { value: "1080p", label: "1080p" },
];

export default function SettingsPanel({
  model,
  onModelChange,
  orientation,
  onOrientationChange,
  duration,
  onDurationChange,
  allowedDurations,
  grokAspectRatio,
  onGrokAspectRatioChange,
  grokResolution,
  onGrokResolutionChange,
  negativePrompt,
  onNegativePromptChange,
  isGrok,
  isVeo,
  credits,
  creditScope,
}) {
  const [expanded, setExpanded] = useState(true);

  const isSora = !isGrok && !isVeo;

  const orientationOptions = isGrok ? GROK_ASPECTS : isVeo ? VEO_ORIENTATIONS : SORA_ORIENTATIONS;
  const currentOrientation = isGrok ? grokAspectRatio : orientation;
  const onOrientationSet = isGrok ? onGrokAspectRatioChange : onOrientationChange;

  return (
    <>
      <button
        className="collapse-toggle"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        style={{ marginTop: 14 }}
      >
        Pengaturan Video
      </button>

      {expanded && (
        <div className="collapsible-body">

          {/* Model Selection Tabs */}
          <div className="row" style={{ marginBottom: 16 }}>
            <div style={{ flex: "1 1 100%" }}>
              <label style={{ display: "block", marginBottom: 8, color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>
                Model Video
              </label>
              <div style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}>
                {MODEL_OPTIONS.map((m) => (
                  <button
                    key={m.value}
                    onClick={() => onModelChange(m.value)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: model === m.value
                        ? "1px solid rgba(251, 191, 36, 0.6)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: model === m.value
                        ? "rgba(251, 191, 36, 0.15)"
                        : "rgba(255,255,255,0.05)",
                      color: model === m.value ? "#fbbf24" : "#94a3b8",
                      fontSize: 13,
                      fontWeight: model === m.value ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Credit Info */}
              <div style={{ marginTop: 8, fontSize: 12, color: "#94a3b8" }}>
                Credit: <span style={{ color: "#22c55e", fontWeight: 600 }}>{credits}</span>
                {" · "}
                <span style={{ color: "#fbbf24" }}>1 credit/video</span>
              </div>
            </div>
          </div>

          {/* Orientation / Aspect Ratio */}
          <div className="row">
            <div style={{ flex: "1 1 100%" }}>
              <label>Orientasi</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {orientationOptions.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => onOrientationSet(o.value)}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 6,
                      border: currentOrientation === o.value
                        ? "1px solid rgba(99, 102, 241, 0.6)"
                        : "1px solid rgba(255,255,255,0.1)",
                      background: currentOrientation === o.value
                        ? "rgba(99, 102, 241, 0.15)"
                        : "rgba(255,255,255,0.05)",
                      color: currentOrientation === o.value ? "#818cf8" : "#94a3b8",
                      fontSize: 12,
                      fontWeight: currentOrientation === o.value ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resolution (Grok + Veo) */}
          {(isGrok || isVeo) && (
            <div className="row">
              <div style={{ flex: 1 }}>
                <label>Resolusi</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {(isGrok ? [{ value: "480p", label: "480p" }, { value: "720p", label: "720p" }] : VEO_RESOLUTIONS).map((r) => (
                    <button
                      key={r.value}
                      onClick={() => onGrokResolutionChange(r.value)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: grokResolution === r.value
                          ? "1px solid rgba(99, 102, 241, 0.6)"
                          : "1px solid rgba(255,255,255,0.1)",
                        background: grokResolution === r.value
                          ? "rgba(99, 102, 241, 0.15)"
                          : "rgba(255,255,255,0.05)",
                        color: grokResolution === r.value ? "#818cf8" : "#94a3b8",
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div style={{ flex: 1 }}>
                <label>Durasi</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {allowedDurations.map((d) => (
                    <button
                      key={d}
                      onClick={() => onDurationChange(d)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: duration === d
                          ? "1px solid rgba(99, 102, 241, 0.6)"
                          : "1px solid rgba(255,255,255,0.1)",
                        background: duration === d
                          ? "rgba(99, 102, 241, 0.15)"
                          : "rgba(255,255,255,0.05)",
                        color: duration === d ? "#818cf8" : "#94a3b8",
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Sora Duration (Sora only) */}
          {isSora && (
            <div className="row">
              <div style={{ flex: 1 }}>
                <label>Durasi</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {allowedDurations.map((d) => (
                    <button
                      key={d}
                      onClick={() => onDurationChange(d)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: duration === d
                          ? "1px solid rgba(99, 102, 241, 0.6)"
                          : "1px solid rgba(255,255,255,0.1)",
                        background: duration === d
                          ? "rgba(99, 102, 241, 0.15)"
                          : "rgba(255,255,255,0.05)",
                        color: duration === d ? "#818cf8" : "#94a3b8",
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Negative Prompt (Grok only) */}
          {isGrok && (
            <div className="row">
              <div style={{ flex: "1 1 100%" }}>
                <label>Negative Prompt (Opsional)</label>
                <input
                  type="text"
                  placeholder="e.g. blurry, poor quality, watermark"
                  value={negativePrompt}
                  onChange={(e) => onNegativePromptChange(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "#f1f5f9",
                    padding: "10px 14px",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .collapse-toggle {
          width: 100%;
          text-align: left;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          padding: 12px 16px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .collapse-toggle:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
        }
        .collapsible-body {
          margin-top: 16px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .row {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
        }
        .row:last-child {
          margin-bottom: 0;
        }
        label {
          display: block;
          margin-bottom: 8px;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
