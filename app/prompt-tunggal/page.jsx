"use client";

import { useState, useEffect, useRef } from "react";
import AppNavbar from "../components/AppNavbar";
import VideoCarousel from "../components/VideoCarousel";
import FloatingPromptBar from "./components/FloatingPromptBar";
import SettingsPanel from "./components/SettingsPanel";
import SettingsDialog from "./components/SettingsDialog";

import { useSoraGenerator } from "../hooks/useSoraGenerator";
import "../components/AppNavbar.css";
import "../components/VideoCarousel.css";
import "./two-column-layout.css";

export default function PromptTunggalPage() {
  // Video state for carousel
  const [videos, setVideos] = useState([]);

  // Settings dialog
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Enforce no scroll on this page
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // ===== USE SORA GENERATOR (GeminiGen API) =====
  const { state, actions } = useSoraGenerator();
  const {
    prompt, model, status, videoUrl, thumbUrl,
    isPolling, credits, creditScope, isGrok, isVeo, modelLabel,
    orientation, grokAspectRatio, grokResolution, negativePrompt,
    duration, allowedDurations, genSeconds, isTiming, mode
  } = state;
  const {
    setPrompt, setModel, setOrientation, setDuration,
    setGrokAspectRatio, setGrokResolution, setNegativePrompt,
    setMode, generate, handleManualCheck,
    setImageData, setImagePreview, setImageName, setImageMime
  } = actions;

  // Track last videoUrl to add to carousel when new video is ready
  const lastVideoUrlRef = useRef("");
  useEffect(() => {
    if (videoUrl && videoUrl !== lastVideoUrlRef.current) {
      lastVideoUrlRef.current = videoUrl;
      const newVideo = {
        id: Date.now().toString(),
        url: videoUrl,
        prompt: prompt || "",
        createdAt: new Date(),
        model: model,
        aspect: orientation === "portrait" ? "VIDEO_ASPECT_RATIO_PORTRAIT" : "VIDEO_ASPECT_RATIO_LANDSCAPE",
      };
      setVideos((prev) => [...prev, newVideo]);
    }
  }, [videoUrl]);

  const handleDeleteVideo = (videoId) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  const onGenerate = () => {
    generate();
  };

  const isGenerating = status.startsWith("Mengirim") || isPolling || isTiming;

  return (
    <div
      className="video-generator-app"
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        background: "transparent",
      }}
    >
      <AppNavbar />

      <main
        style={{
          marginLeft: 0,
          marginTop: "64px",
          height: "calc(100vh - 64px)",
          background: "transparent",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Full Screen Carousel Area */}
        <div
          style={{
            flex: 1,
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            paddingTop: "30px",
            marginTop: "-90px",
            paddingBottom: "0px",
          }}
        >
          {videos.length === 0 ? (
            <div style={{
              textAlign: "center",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0.8,
              paddingBottom: "100px"
            }}>
              <div style={{ fontSize: "64px", marginBottom: "16px", filter: "grayscale(100%) brightness(1.5)" }}>🎥</div>
              <h2 style={{ fontSize: "24px", color: "#ECECEC", fontWeight: 600 }}>
                Start with a New Prompt
              </h2>
              <p style={{ color: "#9CA3AF", marginTop: "8px" }}>
                Type below to generate a video
              </p>
              {status && status !== "idle" && (
                <p style={{ color: "#fbbf24", marginTop: "12px", fontSize: "13px" }}>
                  {status}
                </p>
              )}
            </div>
          ) : (
            <VideoCarousel
              videos={videos}
              onDelete={handleDeleteVideo}
            />
          )}
        </div>

        {/* Settings Dialog */}
        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        >
          <SettingsPanel
            model={model}
            onModelChange={setModel}
            orientation={orientation}
            onOrientationChange={setOrientation}
            duration={duration}
            onDurationChange={setDuration}
            allowedDurations={allowedDurations}
            grokAspectRatio={grokAspectRatio}
            onGrokAspectRatioChange={setGrokAspectRatio}
            grokResolution={grokResolution}
            onGrokResolutionChange={setGrokResolution}
            negativePrompt={negativePrompt}
            onNegativePromptChange={setNegativePrompt}
            isGrok={isGrok}
            isVeo={isVeo}
            credits={credits}
            creditScope={creditScope}
          />
        </SettingsDialog>

        {/* Floating Prompt Bar */}
        <FloatingPromptBar
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={onGenerate}
          isGenerating={isGenerating}
          onCancel={() => {}}
          onSettingsClick={() => setIsSettingsOpen(true)}
          model={model}
          modelLabel={modelLabel}
          status={status}
          genSeconds={genSeconds}
          sidebarOffset={0}
        />
      </main>
    </div>
  );
}
