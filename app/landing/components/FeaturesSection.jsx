"use client";

import { memo, useState } from "react";
import TiltCard from "./TiltCard";
import "../landing-animations.css";

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI-Powered Generation",
    desc: "Transform text prompts into stunning videos using advanced AI models trained on millions of professional videos.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
    title: "Premium Templates",
    desc: "Choose from 100+ professionally designed templates for marketing, education, social media, and more.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Smart Editing",
    desc: "AI-assisted editing tools that understand your content and suggest improvements automatically.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Lightning Fast",
    desc: "Generate high-quality videos in seconds, not hours. Our optimized infrastructure delivers results instantly.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "4K Quality",
    desc: "Export your videos in stunning 4K resolution with crystal-clear quality and vibrant colors.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z" />
      </svg>
    ),
    title: "Cloud Storage",
    desc: "All your projects securely stored in the cloud. Access and edit from anywhere, anytime.",
  },
];

function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        padding: '140px 24px',
        position: 'relative',
        zIndex: 1,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.02), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '88px', position: 'relative', zIndex: 1 }}>
        <div className="fade-in-up lux-eyebrow">
          Powerful Features
        </div>
        <h2
          className="fade-in-up fade-in-up-delay-1 lux-heading"
          style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            margin: '0 0 20px 0',
          }}
        >
          Experience the Future of <br />
          <span className="text-accent-gold">Visual Storytelling</span>
        </h2>
        <p
          className="fade-in-up fade-in-up-delay-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.55)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}
        >
          Everything you need to create spectacular AI videos in one powerful platform.
        </p>
      </div>
      
      {/* Feature Cards Grid */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '28px',
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}
      >
        {FEATURES.map((feature, idx) => (
          <TiltCard key={idx} tiltAmount={5} glowColor="#FFD700">
            <div
              className={`lux-card fade-in-up fade-in-up-delay-${(idx % 6) + 1}`}
              style={{
                padding: '40px',
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Icon */}
              <div 
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 134, 11, 0.05))',
                  border: '1px solid rgba(212, 175, 55, 0.18)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#FFD700',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: 'translateZ(30px)',
                }}
              >
                {feature.icon}
              </div>
              
              {/* Content */}
              <div style={{ transform: 'translateZ(20px)' }}>
                <h3 
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: 'var(--white-pure)',
                    margin: '0 0 12px 0',
                    letterSpacing: '-0.02em',
                    transition: 'color 0.3s ease'
                  }}
                >
                  {feature.title}
                </h3>
                <p 
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    lineHeight: 1.7,
                    color: 'rgba(255, 255, 255, 0.6)',
                    margin: 0,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
              
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

export default memo(FeaturesSection);

