"use client";

import { useEffect, useState } from "react";
import AppNavbar from "../../components/AppNavbar";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
import "../ugc-generator.css";
import { useVideoGeneration } from "../../hooks/useVideoGeneration";
import { useSettings } from "../../context/SettingsContext";

export default function ViralShortVideoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);

  // Form State
  const [productUrl, setProductUrl] = useState("");
  const [description, setDescription] = useState("");
  const [tone, setTone] = useState("hype");
  const [platform, setPlatform] = useState("tiktok");

  // API Key State
  const [userApiKey, setUserApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const { userPlan } = useSettings();
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoAspect, setVideoAspect] = useState("portrait"); // Default for shorts

  // Video Generation Hook
  const { 
    generate: generateVideo, 
    isGenerating: isGeneratingVideo, 
    status: videoStatus, 
    statusMessage: videoStatusMessage,
    progress: videoProgress
  } = useVideoGeneration();

  // Auth Protection & Load Key
  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = "/login";
            return;
        }
        
        setUserId(session.user.id);

        // Load API Key Specific to User
        const savedKey = localStorage.getItem(`gemini_key_${session.user.id}`);
        if (savedKey) setUserApiKey(savedKey);
      } catch (e) {
          console.error("DEBUG: Auth Error", e);
      }
    })();
  }, []);

  // Sync platform with aspect ratio default
  useEffect(() => {
    if (platform === "tiktok") setVideoAspect("portrait");
    else setVideoAspect("landscape");
  }, [platform]);

  const handleGenerate = async () => {
    if (!userApiKey) {
        alert("Wajib masukkan API Key Gemini di settings (tombol kunci di atas)!");
        return;
    }

    setIsLoading(true);
    setGeneratedResult(null);
    try {
        const res = await fetch('/api/ugc/generate-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                productUrl, 
                description, 
                tone, 
                platform,
                apiKey: userApiKey
            })
        });
        
        const data = await res.json();
        
        if (res.status === 429) {
            throw new Error("Quota Gemini Habis/Limit! Tunggu 1 menit lalu coba lagi.");
        }

        if (!res.ok) {
            throw new Error(data.detail || data.error || "Generation Failed");
        }
        
        if (data.success && data.data) {
            setGeneratedResult(data.data);
        } else {
             throw new Error("Invalid data format received");
        }
    } catch (err) {
        alert("Info: " + err.message);
    } finally {
        setIsLoading(false);
    }
  };

  const saveApiKey = () => {
      if(userId && userApiKey) {
        localStorage.setItem(`gemini_key_${userId}`, userApiKey);
        alert('Saved securely for your account!');
        setShowApiInput(false);
      }
  };

  const handleStartVideoGen = () => {
    if (!generatedResult) return;

    // Build a powerful video prompt from the script components
    const videoPrompt = `
      Product Video: ${generatedResult.title}. 
      Scene: ${generatedResult.scenes[0]}. 
      Context: ${generatedResult.script.substring(0, 200)}. 
      Vibe: ${tone}, ${platform} viral style.
    `.trim();

    // Determine relaxed model based on selected aspect
    const modelKey = videoAspect === "portrait" 
        ? "veo_3_1_t2v_fast_portrait_ultra_relaxed" 
        : "veo_3_1_t2v_fast_ultra_relaxed";

    generateVideo({
      mode: "single",
      prompt: videoPrompt,
      aspect: videoAspect === "portrait" ? "VIDEO_ASPECT_RATIO_PORTRAIT" : "VIDEO_ASPECT_RATIO_LANDSCAPE",
      modelKey: modelKey,
      bypassQuota: userPlan === "admin",
    });
  };

  // Listen for video completion
  useEffect(() => {
    const handleCompleted = (e) => {
        if (e.detail && e.detail.videoUrl) {
            setVideoUrl(e.detail.videoUrl);
        }
    };
    window.addEventListener("videoGenerated", handleCompleted);
    return () => window.removeEventListener("videoGenerated", handleCompleted);
  }, []);

  return (
    <div className="ugc-layout workspace-active">
      <AppNavbar />
      
      <div className="ugc-container">
        {/* API KEY SETTINGS (Optional: keep here or just in the hub? Hub is better but let's keep it here for UX if they forget) */}
        <div className="ugc-workspace-wrapper">
             <div className="workspace-header">
                <Link href="/ugc-generator" className="btn-back-ugc">
                    ← Back to Tools
                </Link>

                <div className="api-key-section-inline">
                    <button className="btn-toggle-key" onClick={() => setShowApiInput(!showApiInput)}>
                        🔑 {showApiInput ? 'Hide Key' : 'API Key'}
                    </button>
                    {showApiInput && (
                        <div className="api-float-input">
                            <input 
                                type="password" 
                                value={userApiKey}
                                onChange={(e) => setUserApiKey(e.target.value)}
                                placeholder="Gemini Key..."
                            />
                            <button onClick={saveApiKey}>Save</button>
                        </div>
                    )}
                </div>
             </div>

             <div className="ugc-workspace-content">
                <div className="ugc-tool-split">
                    {/* LEFT: FORM input */}
                    <div className="ugc-form-panel">
                        <h2 className="panel-title"><span style={{marginRight: '8px'}}>⚡</span> Setup Viral Short</h2>
                        
                        <div className="ugc-input-group">
                            <label>Product / Content URL <span className="badge-optional">Optional</span></label>
                            <input 
                                type="text" 
                                placeholder="https://shopee.co.id/product/..." 
                                className="ugc-input"
                                value={productUrl}
                                onChange={(e) => setProductUrl(e.target.value)}
                            />
                        </div>

                        <div className="ugc-input-group grow">
                            <label>Product Details / Selling Points</label>
                            <textarea 
                                placeholder="Describe the product, what makes it special, and who needs it..." 
                                className="ugc-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <div className="ugc-row-group">
                            <div className="ugc-input-group half">
                                <label>Vibe / Tone</label>
                                <select 
                                    className="ugc-select"
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                >
                                    <option value="hype">🔥 High Energy / Hype</option>
                                    <option value="story">📖 Storytelling / POV</option>
                                    <option value="review">🧐 Honest Review</option>
                                    <option value="comedy">😂 Funny / Skit</option>
                                    <option value="luxury">💎 Luxury / Elegant</option>
                                </select>
                            </div>
                            <div className="ugc-input-group half">
                                <label>Target Platform</label>
                                <div className="platform-pills">
                                    <button 
                                        className={`pill ${platform === 'tiktok' ? 'active' : ''}`}
                                        onClick={() => setPlatform('tiktok')}
                                    >TikTok</button>
                                    <button 
                                        className={`pill ${platform === 'reels' ? 'active' : ''}`}
                                        onClick={() => setPlatform('reels')}
                                    >Reels</button>
                                </div>
                            </div>
                        </div>

                        <button 
                            className="btn-generate-ugc" 
                            onClick={handleGenerate}
                            disabled={isLoading || (!productUrl && !description)}
                        >
                            {isLoading ? "🔮 Generating Magic..." : "✨ GENERATE SCRIPT & VIDEO"}
                        </button>
                    </div>

                    {/* RIGHT: PREVIEW / RESULT */}
                    <div className="ugc-preview-panel">
                        <h2 className="panel-title">Preview & Result</h2>
                        {generatedResult ? (
                            <div className="result-content">
                                <div className="result-header">
                                    <h3>✅ Script Generated</h3>
                                    <div className="result-actions">
                                        <div className="video-aspect-toggle">
                                            <button 
                                                className={`aspect-btn ${videoAspect === 'portrait' ? 'active' : ''}`}
                                                onClick={() => setVideoAspect('portrait')}
                                                disabled={isGeneratingVideo}
                                            >
                                                📱 Portrait
                                            </button>
                                            <button 
                                                className={`aspect-btn ${videoAspect === 'landscape' ? 'active' : ''}`}
                                                onClick={() => setVideoAspect('landscape')}
                                                disabled={isGeneratingVideo}
                                            >
                                                🖥️ Landscape
                                            </button>
                                        </div>
                                        <button 
                                            className="btn-action-primary" 
                                            onClick={handleStartVideoGen}
                                            disabled={isGeneratingVideo}
                                        >
                                            {isGeneratingVideo ? "🎬 Generating..." : "🎬 Generate Video"}
                                        </button>
                                        <button className="btn-icon-small">Copy</button>
                                    </div>
                                </div>
                                <div className="script-box">
                                    <h4>{generatedResult.title}</h4>
                                    <div style={{marginBottom: '15px', padding: '10px', background: '#332b00', borderRadius: '8px', borderLeft: '3px solid #D4AF37'}}>
                                      <strong style={{color: '#D4AF37', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase'}}>🔥 Viral Hook (0-3s)</strong>
                                      {generatedResult.hook}
                                    </div>
                                    
                                    <p style={{whiteSpace: 'pre-wrap'}}>{generatedResult.script}</p>

                                    <div style={{marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px'}}>
                                      <strong style={{color: '#888', fontSize: '0.9rem'}}>🎬 Visual Scenes:</strong>
                                      <ul style={{paddingLeft: '20px', color: '#aaa', marginTop: '5px', fontSize: '0.9rem'}}>
                                        {generatedResult.scenes?.map((scene, i) => (
                                          <li key={i} style={{marginBottom: '5px'}}>{scene}</li>
                                        ))}
                                      </ul>
                                    </div>

                                    <p style={{marginTop: '15px', color: '#D4AF37', fontWeight: 'bold'}}>
                                      📢 CTA: {generatedResult.cta}
                                    </p>
                                </div>
                                <div className="video-placeholder">
                                    {videoUrl ? (
                                        <video 
                                            src={videoUrl} 
                                            controls 
                                            autoPlay 
                                            loop 
                                            className="result-video-player"
                                        />
                                    ) : (
                                        <>
                                            <div className="video-glow"></div>
                                            <div className="video-scanner"></div>
                                            <div className="video-overlay">
                                                <div className="ai-core-container">
                                                    <div className={`ai-core-ring ${isGeneratingVideo ? 'generating' : ''}`}></div>
                                                    <div className={`ai-core-ring ${isGeneratingVideo ? 'generating' : ''}`}></div>
                                                    <div className="ai-core-center">
                                                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M2 17L12 22L22 17" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M2 12L12 17L22 12" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <span className="preview-label">
                                                    {isGeneratingVideo ? `Rendering: ${videoProgress}%` : "AI Rendering Engine Initialized"}
                                                </span>
                                                <span className="preview-sub-label">
                                                    {isGeneratingVideo ? videoStatusMessage : "Waiting for script to video conversion protocol..."}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="empty-preview-state">
                                <div className="preview-icon-large">🎬</div>
                                <p>Fill the form on the left to start generating content.</p>
                                <p className="sub-hint">We will create a script and a storyboard for you.</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>
        </div>
      </div>
    </div>
  );
}
