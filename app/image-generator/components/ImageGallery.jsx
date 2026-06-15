"use client";

export function ImageGallery({ images, downloadImage }) {
  if (!images || images.length === 0) return null;

  return (
    <main className="content" style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
      <style>{`
        .image-gallery-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        @media (min-width: 500px) {
          .image-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 20px;
          }
        }
      `}</style>
      <div className="image-gallery-grid">
        {images.map((img, idx) => (
          <div key={idx} className="video-card active" style={{
            borderRadius: "16px",
            border: "1px solid rgba(212, 175, 55, 0.15)",
            background: "rgba(20, 20, 20, 0.5)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            overflow: "hidden"
          }}>
            <div className="video-wrapper" style={{ position: "relative" }}>
              <img
                src={img.url}
                alt={img.title}
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block"
                }}
              />
              <div className="video-overlay" style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                <div className="video-title" style={{ color: "#fff", fontWeight: 700, fontSize: "14px" }}>{img.title}</div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="btn primary"
                    style={{ fontSize: 12, padding: "6px 16px", borderRadius: "20px" }}
                    onClick={() => downloadImage(img.url, `image-${idx + 1}.png`)}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
