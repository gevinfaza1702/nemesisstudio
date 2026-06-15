"use client";

export function ImageSettingsModal({
  isOpen, onClose,
  aspect, setAspect,
  count, setCount,
  model, setModel
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ display: "flex" }}>
      <div className="modal-content" style={{ maxWidth: 450 }}>
        <h2 className="section-title" style={{ marginBottom: 20 }}>Generator Settings</h2>
        
        <div className="settings-grid" style={{ display: "grid", gap: 20 }}>
          <div className="setting-item">
            <label className="setting-label">Aspect Ratio</label>
            <div className="radio-group" style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button 
                className={`btn ${aspect === "landscape" ? "primary" : "ghost"}`}
                onClick={() => setAspect("landscape")}
                style={{ flex: 1 }}
              >
                16:9 Landscape
              </button>
              <button 
                className={`btn ${aspect === "portrait" ? "primary" : "ghost"}`}
                onClick={() => setAspect("portrait")}
                style={{ flex: 1 }}
              >
                9:16 Portrait
              </button>
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">Images per Prompt</label>
            <div className="radio-group" style={{ display: "flex", gap: 10, marginTop: 10 }}>
              {[1, 2].map(num => (
                <button 
                  key={num}
                  className={`btn ${count === num ? "primary" : "ghost"}`}
                  onClick={() => setCount(num)}
                  style={{ flex: 1 }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <div className="setting-item">
            <label className="setting-label">AI Model</label>
            <select 
              className="dropdown" 
              value={model} 
              onChange={(e) => setModel(e.target.value)}
              style={{ marginTop: 10, width: "100%" }}
            >
              <option value="imagen-4">Imagen 4 (High Quality)</option>
              <option value="nano-banana">Nano Banana (Fast)</option>
              <option value="nano-banana-pro">Nano Banana Pro (Creative)</option>
            </select>
          </div>
        </div>

        <div className="modal-actions" style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}>
          <button className="btn primary" onClick={onClose} style={{ width: "100%" }}>Done</button>
        </div>
      </div>
    </div>
  );
}
