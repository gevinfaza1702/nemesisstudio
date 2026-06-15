"use client";

export function GeneratorSidebar({
  prompt, setPrompt,
  aspect, setAspect,
  count, setCount,
  model, setModel,
  busy, generate,
  status,
  showRefSection, setShowRefSection,
  refPreviews, pickFileForSlot, clearRefSlot, uploadRefSlot,
  refs
}) {
  return (
    <aside className="sidebar">
      <h2 className="section-title">Prompt Gambar</h2>
      <textarea
        className="scene-textarea"
        rows={4}
        placeholder="Deskripsikan gambar..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
        <button className="btn primary" disabled={busy} onClick={generate}>
          {busy ? "Sedang Proses..." : "Buat Gambar"}
        </button>
        <span className="settings-help" style={{ fontSize: 12 }}>{status}</span>
      </div>

      <div style={{ marginTop: 14 }}>
        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Rasio Aspek</label>
            <select className="dropdown" value={aspect} onChange={(e) => setAspect(e.target.value)}>
              <option value="landscape">Lanskap (16:9)</option>
              <option value="portrait">Potret (9:16)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Output</label>
            <select className="dropdown" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
          </div>
        </div>

        <div className="row" style={{ marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Model</label>
            <select className="dropdown" value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="imagen-4">Imagen 4 (High Quality)</option>
              <option value="nano-banana">Nano Banana (Fast)</option>
              <option value="nano-banana-pro">Nano Banana Pro (Creative)</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: 12 }}
            onClick={() => setShowRefSection(!showRefSection)}
          >
            <label style={{ cursor: "pointer", margin: 0 }}>Gambar Referensi (opsional)</label>
            <span style={{ fontSize: 12, color: "#D4AF37" }}>{showRefSection ? "▼" : "▶"}</span>
          </div>

          {showRefSection && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="photo-card" style={{ padding: 12 }}>
                  <div className="photo-name" style={{ marginBottom: 6, display: "flex", justifyContent: "space-between" }}>
                    <span>Referensi {i + 1}</span>
                    {refPreviews[i] && (
                      <button onClick={() => clearRefSlot(i)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 11 }}>
                        Hapus
                      </button>
                    )}
                  </div>
                  
                  {refPreviews[i] ? (
                    <div style={{ position: "relative" }}>
                      <img src={refPreviews[i].url || refPreviews[i].dataUrl} alt={`Ref ${i}`} style={{ width: "100%", borderRadius: 8, border: "1px solid #333" }} />
                      {!refs[i] && (
                        <button onClick={() => uploadRefSlot(i)} className="btn ghost" style={{ position: "absolute", bottom: 4, right: 4, fontSize: 10, padding: "2px 8px" }}>
                          Upload Media ID
                        </button>
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept = "image/*";
                        input.onchange = (e) => pickFileForSlot(i, e.target.files);
                        input.click();
                      }}
                      style={{ height: 60, border: "1px dashed #444", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#666", fontSize: 12 }}
                    >
                      Klik untuk Upload
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
