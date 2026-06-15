"use client";

import { useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import { supabase } from "../lib/supabaseClient";
import Link from "next/link";
import "./ugc-generator.css";

export default function UGCGeneratorPage() {
  // API Key State
  const [userApiKey, setUserApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [userId, setUserId] = useState(null);

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

  const features = [
    {
      id: "viral-short-video",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      ),
      title: "Viral Shorts Generator",
      desc: "Turn product links into high-conversion viral video shorts instantly.",
      active: true,
      href: "/ugc-generator/viral-short-video"
    },
    {
      id: "magic-writer",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 5 2.25L13 6"/><path d="m2 2 2.25 5L6 13"/></svg>
      ),
      title: "Magic Script Writer",
      desc: "Create engaging hooks and scripts tailored for TikTok and Reels.",
      active: true,
      href: "/ugc-generator/magic-writer"
    }
  ];

  const saveApiKey = () => {
      if(userId && userApiKey) {
        localStorage.setItem(`gemini_key_${userId}`, userApiKey);
        alert('Saved securely for your account!');
        setShowApiInput(false);
      }
  };

  return (
    <div className="ugc-layout">
      <AppNavbar />
      
      <div className="ugc-container">
        <div className="ugc-hero">
          <h1>UGC Generator</h1>
          <p>
            Create authentic, high-converting User Generated Content with AI.
            <br />
            Select a tool to get started.
          </p>
        </div>

        {/* GLOBAL API KEY SETTINGS */}
        <div className="api-key-section">
            <div className="api-key-header" onClick={() => setShowApiInput(!showApiInput)}>
                <h4>🔑 API KEY SETTINGS</h4>
                <span className={`api-toggle-icon`}>{showApiInput ? '▲' : '▼'}</span>
            </div>
            {showApiInput && (
                <div className="api-content">
                    <div className="api-input-wrapper">
                        <input 
                            type="password" 
                            className="api-input"
                            placeholder="Paste Gemini Key..."
                            value={userApiKey}
                            onChange={(e) => setUserApiKey(e.target.value)}
                        />
                        <button 
                            className="btn-save-api"
                            onClick={saveApiKey}
                        >
                            SAVE KEY
                        </button>
                    </div>
                    <p className="api-hint">Key is stored locally for your security.</p>
                </div>
            )}
        </div>

        <div className="ugc-options">
          {features.map((f) => (
            <Link 
              key={f.id} 
              href={f.href}
              className={`ugc-card ${f.active ? '' : 'coming-soon'}`}
            >
              <div className="ugc-card-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              {!f.active && <span className="coming-soon-ribbon">COMING SOON</span>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
