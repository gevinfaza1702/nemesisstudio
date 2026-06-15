"use client";

import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import "./VideoCarousel.css";

export default function VideoCarousel({ videos = [], onDelete, onExtend, onCameraClick, onReshoot, aspectRatio = "16:9" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [playingStates, setPlayingStates] = useState({});
  const [progressStates, setProgressStates] = useState({}); // Tracking progress for each generating video

  // Logic to simulate progress for generating videos
  useEffect(() => {
    const generatingVideos = videos.filter(v => v.isGenerating);
    if (generatingVideos.length === 0) return;

    const interval = setInterval(() => {
      setProgressStates(prev => {
        const next = { ...prev };
        generatingVideos.forEach(v => {
          const current = next[v.id] || 0;
          if (current < 95) {
            // Slower progress as it gets closer to 95%
            const increment = Math.max(0.2, (100 - current) / 40);
            next[v.id] = Math.min(95, current + increment);
          }
        });
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [videos]);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Menu State
  const [activeMenu, setActiveMenu] = useState(null);
  const [gradingVideoId, setGradingVideoId] = useState(null);
  const [videoGrades, setVideoGrades] = useState({}); // Maps video ID to LUT key


  // VFX state
  const [vfxOverlayVideoId, setVfxOverlayVideoId] = useState(null);
  const [videoVFXs, setVideoVFXs] = useState({}); // Maps video ID to array of VFX keys

  const LUT_PRESETS = [
    { key: "original", name: "Original", icon: "🎬" },
    { key: "cyberpunk", name: "Cyberpunk", icon: "🌃" },
    { key: "noir", name: "Noir", icon: "🕶️" },
    { key: "vintage", name: "Vintage", icon: "🕰️" },
    { key: "cold-thriller", name: "Cold Thriller", icon: "❄️" },
    { key: "golden-hour", name: "Golden Hour", icon: "🌅" },
    { key: "emerald-matrix", name: "Emerald Matrix", icon: "🧩" },
    { key: "solar-flare", name: "Solar Flare", icon: "💥" },
    { key: "deep-abyss", name: "Deep Abyss", icon: "🌊" },
    { key: "anime-soul", name: "Anime Soul", icon: "✨" },
    { key: "sunset-blade", name: "Sunset Blade", icon: "⚔️" },
  ];



  const VFX_PRESETS = [
    { key: "grain", name: "Film Grain", icon: "🎞️", desc: "Adds cinematic analog texture" },
    { key: "vignette", name: "Vignette", icon: "🔦", desc: "Darkens edges for focus" },
    { key: "rgb", name: "RGB Shift", icon: "🌈", desc: "Trippy chromatic aberration" },
    { key: "vhs", name: "VHS Glitch", icon: "📼", desc: "Retro signal interference" },
    { key: "flare", name: "Lens Flare", icon: "✨", desc: "Anamorphic light streaks" },
  ];
  const menuRefs = useRef({});

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu !== null) {
        // Check if click is inside the active menu container
        const activeRef = menuRefs.current[activeMenu];
        if (activeRef && !activeRef.contains(event.target)) {
          setActiveMenu(null);
          setGradingVideoId(null);

          setVfxOverlayVideoId(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeMenu]);

  const menuItemStyle = {
    background: 'transparent',
    border: 'none',
    color: '#e0e0e0',
    width: '100%',
    textAlign: 'left',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s',
    borderRadius: '8px',
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);
  // Auto-play active video, pause others
  useEffect(() => {
    videoRefs.current.forEach((videoEl, index) => {
      if (videoEl) {
        if (index === activeIndex && !isDragging) {
          videoEl.play().catch(() => { });
        } else {
          videoEl.pause();
        }
      }
    });
  }, [activeIndex, isDragging]);

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < videos.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleDownload = (videoUrl, index, videoId) => {
    // We use a server-side proxy to bypass CORS and bake in LUTs/Filters
    const filename = `veo-video-scene-${index + 1}.mp4`;
    const grade = videoGrades[videoId] || 'original';
    const vfx = videoVFXs[videoId] || [];

    let proxyUrl = `/api/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(filename)}&grade=${grade}`;

    // Add VFX params if any exist
    if (vfx.length > 0) {
      proxyUrl += `&vfx=${vfx.join(',')}`;
    }

    const link = document.createElement("a");
    link.href = proxyUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (videos.length === 0) {
    return (
      <div className="video-carousel-empty">
        <div className="empty-state">
          <span className="empty-icon">🎬</span>
          <h3>No Videos Yet</h3>
          <p>Generate a video to see it here</p>
        </div>
      </div>
    );
  }

  // Virtualization Logic
  const GAP = 24;
  const getCardWidth = (aspect) => aspect === "VIDEO_ASPECT_RATIO_LANDSCAPE" ? 500 : 260;

  // Pre-calculate positions for all items (including ghost card)
  const itemPositions = useMemo(() => {
    const allItems = [...videos, { id: "ghost-card", type: "ghost", aspect: videos[videos.length - 1]?.aspect || "VIDEO_ASPECT_RATIO_LANDSCAPE" }];
    let currentX = 0;
    return allItems.map((item, index) => {
      const width = getCardWidth(item.aspect);
      const pos = { left: currentX, width };
      currentX += width + GAP;
      return { item, pos };
    });
  }, [videos]);

  const allItems = itemPositions.map(p => p.item);

  const calculateTargetX = (index) => {
    if (!itemPositions[index]) return 0;
    const { left, width } = itemPositions[index].pos;
    const cardCenter = left + (width / 2);
    const containerCenter = containerWidth / 2;
    return containerCenter - cardCenter;
  };

  // Virtualization window (render ±3 around activeIndex)
  const BUFFER = 3;
  const visibleIndices = itemPositions
    .map((_, i) => i)
    .filter(i => Math.abs(i - activeIndex) <= BUFFER);

  return (
    <div className="video-carousel-container">
      <div className="carousel-wrapper" ref={containerRef}>
        <motion.div
          className="carousel-track"
          style={{ position: 'relative', height: '100%', width: '100%' }} // Flex not needed for absolute items
          drag="x"
          dragConstraints={{ left: -10000, right: 10000 }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e, info) => {
            setIsDragging(false);
            const offset = info.offset.x;
            const velocity = info.velocity.x;

            if (Math.abs(velocity) > 500 || Math.abs(offset) > 100) {
              if (offset > 0) {
                if (activeIndex > 0) setActiveIndex(activeIndex - 1);
                else setActiveIndex(allItems.length - 1);
              } else {
                if (activeIndex < allItems.length - 1) setActiveIndex(activeIndex + 1);
                else setActiveIndex(0);
              }
            }
          }}
          animate={{ x: calculateTargetX(activeIndex) }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AnimatePresence mode="popLayout">
            {visibleIndices.map((index) => {
              const { item, pos } = itemPositions[index];
              const isActive = index === activeIndex;
              const isLandscape = item.aspect === "VIDEO_ASPECT_RATIO_LANDSCAPE";
              const isGhost = item.type === "ghost";

              const cardHeight = isLandscape ? 320 : 440;

              return (
                <motion.div
                  key={item.id}
                  className={`carousel-card ${isActive ? "active" : ""} ${isLandscape ? "landscape" : ""}`}
                  style={{
                    position: 'absolute',
                    left: pos.left,
                    top: 0,
                    height: cardHeight,
                    width: pos.width,
                    ...(isGhost ? {
                      border: "none",
                      background: "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    } : {})
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0.5,
                    filter: isActive ? "blur(0px)" : "blur(4px)",
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  {isGhost ? (
                    <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", width: "100%" }}>
                      <div style={{ fontSize: "40px", marginBottom: "8px" }}>+</div>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>Scene {index + 1}</div>
                    </div>
                  ) : (
                    <div className="card-content">
                      {/* Scene Header */}
                      <div className="scene-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <h3 className="scene-title">Scene {index + 1}</h3>

                        {!item.isGenerating && (
                          <div
                            className="card-menu-container"
                            ref={el => menuRefs.current[index] = el}
                            onClick={(e) => e.stopPropagation()}
                            style={{ position: 'absolute', right: '16px' }}
                          >
                            <button
                              className="menu-trigger-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(activeMenu === index ? null : index);
                                setGradingVideoId(null);

                                setVfxOverlayVideoId(null);
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#D4AF37',
                                cursor: 'pointer',
                                zIndex: 50,
                                transition: 'transform 0.2s ease'
                              }}
                            >
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </button>

                            <AnimatePresence>
                              {activeMenu === index && (
                                <motion.div
                                  className="dropdown-menu"
                                  initial={{ opacity: 0, scale: 0.9, y: -10, filter: 'blur(10px)' }}
                                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                  exit={{ opacity: 0, scale: 0.9, y: -10, filter: 'blur(10px)' }}
                                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                                  style={{
                                    position: 'absolute',
                                    top: '32px',
                                    right: '0',
                                    background: 'rgba(20, 20, 20, 0.95)',
                                    border: '1px solid rgba(212, 175, 55, 0.2)',
                                    borderRadius: '14px',
                                    padding: '10px',
                                    minWidth: '200px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 15px rgba(212, 175, 55, 0.1)',
                                    zIndex: 30,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                    backdropFilter: 'blur(15px)'
                                  }}
                                >
                                  <button
                                    className="menu-item"
                                    onClick={() => {
                                      handleDownload(item.url, index, item.id);
                                      setActiveMenu(null);
                                    }}
                                    style={menuItemStyle}
                                  >
                                    <svg style={{ marginRight: '10px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                      <polyline points="7 10 12 15 17 10"></polyline>
                                      <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    <span>Download</span>
                                  </button>

                                  {/* Grade Video */}
                                  <button
                                    className="menu-item"
                                    onClick={() => {
                                      setGradingVideoId(item.id);
                                      setActiveMenu(null);
                                    }}
                                    style={menuItemStyle}
                                  >
                                    <svg style={{ marginRight: '10px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10"></circle>
                                      <path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 1 0-20"></path>
                                      <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 0 0-20"></path>
                                    </svg>
                                    <span>Grade Video</span>
                                  </button>



                                  {/* VFX Overlays */}
                                  <button
                                    className="menu-item"
                                    onClick={() => {
                                      setVfxOverlayVideoId(item.id);
                                      setActiveMenu(null);
                                    }}
                                    style={menuItemStyle}
                                  >
                                    <svg style={{ marginRight: '10px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                    </svg>
                                    <span>VFX Overlays</span>
                                  </button>

                                  <button
                                    className="menu-item"
                                    onClick={() => {
                                      if (onCameraClick) {
                                        onCameraClick(item);
                                      } else if (typeof window.showCameraPositionPanel === 'function') {
                                        window.showCameraPositionPanel({
                                          mediaId: item.generationId || item.mediaId || "",
                                          aspect: item.aspect || "VIDEO_ASPECT_RATIO_LANDSCAPE"
                                        });
                                      } else {
                                        alert("Camera Position panel not available");
                                      }
                                      setActiveMenu(null);
                                    }}
                                    style={menuItemStyle}
                                  >
                                    <svg style={{ marginRight: '10px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                    Camera Position
                                  </button>

                                  <button
                                    className="menu-item"
                                    onClick={() => {
                                      if (onExtend) {
                                        onExtend(item);
                                      } else if (typeof window.showExtendPanel === 'function') {
                                        window.showExtendPanel({
                                          overrideGenerationId: item.generationId || "",
                                          suggestedPrompt: "lanjutkan"
                                        });
                                      } else {
                                        alert("Extend panel not available");
                                      }
                                      setActiveMenu(null);
                                    }}
                                    style={menuItemStyle}
                                  >
                                    <svg style={{ marginRight: '10px' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                    Extend
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Video or Loading */}
                      <div className={`video-container ${(videoGrades && videoGrades[item.id]) ? `lut-${videoGrades[item.id]}` : ''}`}>
                        {item.isGenerating ? (
                          // Enhanced Loading State
                          <div className="video-loading">
                            <div className="loading-content">
                              <div className="progress-container">
                                <motion.div
                                  className="progress-bar-fill"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressStates[item.id] || 0}%` }}
                                  transition={{ type: "spring", damping: 20, stiffness: 50 }}
                                />
                                <div className="progress-glow"></div>
                              </div>
                              <div className="loading-info">
                                <span className="loading-percentage">{Math.round(progressStates[item.id] || 0)}%</span>
                                <p className="loading-text">Crafting your cinematic masterpiece...</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <video
                              ref={(el) => (videoRefs.current[index] = el)}
                              src={item.url}
                              className="video-player"
                              loop
                              playsInline
                              onPlay={() => {
                                setPlayingStates(prev => ({ ...prev, [item.id]: true }));
                              }}
                              onPause={() => {
                                setPlayingStates(prev => ({ ...prev, [item.id]: false }));
                              }}
                              onClick={() => {
                                const videoEl = videoRefs.current[index];
                                if (videoEl) {
                                  if (videoEl.paused) {
                                    videoEl.play();
                                  } else {
                                    videoEl.pause();
                                  }
                                }
                              }}
                            />

                            {/* Grade Modal - Portal to body */}
                            {gradingVideoId === item.id && typeof document !== 'undefined' && createPortal(
                              <AnimatePresence>
                                <motion.div
                                  className="grade-overlay"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  onClick={() => setGradingVideoId(null)}
                                >
                                  <motion.div
                                    className="grade-popup"
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="grade-header">
                                      <h3>Cinematic LUTs</h3>
                                      <button className="close-grade-btn" onClick={() => setGradingVideoId(null)}>✕</button>
                                    </div>
                                    <div className="grade-grid">
                                      {LUT_PRESETS.map((preset) => (
                                        <div
                                          key={preset.key}
                                          className={`grade-option ${((videoGrades && videoGrades[gradingVideoId]) === preset.key || (!videoGrades[gradingVideoId] && preset.key === 'original')) ? 'active' : ''}`}
                                          onClick={() => setVideoGrades(prev => ({ ...prev, [gradingVideoId]: preset.key === 'original' ? null : preset.key }))}
                                        >
                                          <span>{preset.icon}</span>
                                          <span className="grade-name">{preset.name}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </motion.div>
                                </motion.div>
                              </AnimatePresence>,
                              document.body
                            )}

                            {/* VFX Modal - Portal to body */}
                            {vfxOverlayVideoId === item.id && typeof document !== 'undefined' && createPortal(
                              <AnimatePresence>
                                <motion.div
                                  className="vfx-overlay"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  onClick={() => setVfxOverlayVideoId(null)}
                                >
                                  <motion.div
                                    className="vfx-popup"
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="grade-header">
                                      <h3>VFX Protocol</h3>
                                      <button className="close-grade-btn" onClick={() => setVfxOverlayVideoId(null)}>✕</button>
                                    </div>

                                    <div className="vfx-grid">
                                      {VFX_PRESETS.map(vfx => {
                                        const isActiveVfx = (videoVFXs[vfxOverlayVideoId] || []).includes(vfx.key);
                                        return (
                                          <div
                                            key={vfx.key}
                                            className={`vfx-option ${isActiveVfx ? 'active' : ''}`}
                                            onClick={() => {
                                              setVideoVFXs(prev => {
                                                const current = prev[vfxOverlayVideoId] || [];
                                                if (current.includes(vfx.key)) {
                                                  return { ...prev, [vfxOverlayVideoId]: current.filter(k => k !== vfx.key) };
                                                } else {
                                                  return { ...prev, [vfxOverlayVideoId]: [...current, vfx.key] };
                                                }
                                              });
                                            }}
                                          >
                                            <div className="vfx-icon-box">{vfx.icon}</div>
                                            <div className="vfx-info">
                                              <span className="vfx-name">{vfx.name}</span>
                                              <span className="vfx-desc">{vfx.desc}</span>
                                            </div>
                                            {isActiveVfx && <div className="vfx-active-check">✓</div>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                </motion.div>
                              </AnimatePresence>,
                              document.body
                            )}

                            {/* Center Play/Pause Overlay - only show when paused */}
                            {isActive && !playingStates[item.id] && gradingVideoId !== item.id && (
                              <div
                                className="play-overlay"
                                onClick={() => {
                                  const videoEl = videoRefs.current[index];
                                  if (videoEl) {
                                    if (videoEl.paused) {
                                      videoEl.play();
                                    } else {
                                      videoEl.pause();
                                    }
                                  }
                                }}
                              >
                                <svg className="play-icon-svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
