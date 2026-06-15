"use client";

import { useEffect } from "react";
import AppNavbar from "../components/AppNavbar";
import { supabase } from "../lib/supabaseClient";
import { renderCropToDataUrl, downloadImage } from "./utils";
import { useImageGenerator } from "./useImageGenerator";
import { ImageGeneratorControls } from "./components/ImageGeneratorControls";
import { ImageSettingsModal } from "./components/ImageSettingsModal";
import { ImageGallery } from "./components/ImageGallery";
import { CropModal } from "./components/CropModal";
import "./image-generator.css";

export default function ImageGeneratorPage() {
  const gen = useImageGenerator();



  // Auth Redirect
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) window.location.href = "/login";
      } catch (_) { }
    })();
  }, []);

  const handleCropConfirm = async () => {
    if (!gen.cropImg) return;
    gen.setStatus("Preprocessing image...");
    try {
      // Convert aspect string to numeric ratio
      const aspectRatioMap = {
        landscape: 16 / 9,
        portrait: 9 / 16,
        square: 1
      };
      const numericAspect = aspectRatioMap[gen.cropAspect] || 16 / 9;

      const croppedDataUrl = await renderCropToDataUrl(
        gen.cropImg.dataUrl,
        numericAspect,
        gen.cropScale,
        gen.cropOffset
      );

      const slot = gen.cropImg.slot !== undefined ? gen.cropImg.slot : 0;
      await gen.uploadDataUrlAsRef(slot, croppedDataUrl, gen.cropImg.fileName);
      gen.setStatus("Image ready.");
    } catch (e) {
      gen.setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div className="elegant-layout">
      <AppNavbar />

      <div className="gallery-container">
        {gen.images.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🖼️</div>
            <h2 className="empty-title">Start with a New Prompt</h2>
            <p className="empty-sub">Type below to generate an image</p>
            {gen.status && <p style={{ marginTop: 15, color: "#D4AF37", fontSize: 12 }}>{gen.status}</p>}
          </div>
        ) : (
          <ImageGallery
            images={gen.images}
            downloadImage={downloadImage}
          />
        )}
      </div>

      <ImageGeneratorControls
        {...gen}
        onGenerate={gen.generate}
        onSettingsClick={() => gen.setIsSettingsOpen(true)}
      />

      <ImageSettingsModal
        isOpen={gen.isSettingsOpen}
        onClose={() => gen.setIsSettingsOpen(false)}
        aspect={gen.aspect}
        setAspect={gen.setAspect}
        count={gen.count}
        setCount={gen.setCount}
        model={gen.model}
        setModel={gen.setModel}
      />

      <CropModal
        isOpen={gen.cropOpen}
        onClose={() => {
          gen.setCropOpen(false);
          gen.setUploadStatus("");
          gen.setUploadedMediaId("");
        }}
        cropImg={gen.cropImg}
        aspect={gen.cropAspect}
        setAspect={gen.setCropAspect}
        scale={gen.cropScale}
        setScale={gen.setCropScale}
        offset={gen.cropOffset}
        setOffset={gen.setCropOffset}
        uploadStatus={gen.uploadStatus}
        uploadedMediaId={gen.uploadedMediaId}
        onConfirm={handleCropConfirm}
      />
    </div>
  );
}
