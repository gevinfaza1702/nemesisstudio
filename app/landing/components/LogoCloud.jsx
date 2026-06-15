"use client";

import { memo } from 'react';
import "../landing-animations.css";

// Technology/Partner logos with icons
const logos = [
  { name: 'Google AI', icon: 'crown' },
  { name: 'Veo 3.1', icon: 'star' },
  { name: 'Sora 2', icon: 'diamond' },
  { name: 'Imagen', icon: 'gem' },
  { name: 'Gemini', icon: 'award' },
  { name: 'OpenAI', icon: 'trophy' },
  { name: 'Grok', icon: 'crown' },
  { name: 'Nano Banana', icon: 'star' },
];

// SVG icon components
function Icon({ type }) {
  switch (type) {
    case 'crown':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM3 20h18" />
        </svg>
      );
    case 'star':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case 'diamond':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="6 3 18 3 22 9 12 22 2 9 6 3" />
        </svg>
      );
    case 'gem':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="6 3 12 3 18 3 22 9 12 22 2 9 6 3" />
          <line x1="2" y1="9" x2="22" y2="9" />
          <line x1="12" y1="3" x2="12" y2="9" />
          <line x1="6" y1="3" x2="9" y2="9" />
          <line x1="18" y1="3" x2="15" y2="9" />
          <line x1="9" y1="9" x2="12" y2="22" />
          <line x1="15" y1="9" x2="12" y2="22" />
        </svg>
      );
    case 'award':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12" />
        </svg>
      );
    case 'trophy':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47 1-.97 1H8.5a.5.5 0 0 0-.5.5v.5c0 .77.23 1.5.68 2h6.64c.45-.5.68-1.23.68-2v-.5a.5.5 0 0 0-.5-.5h-.53c-.5 0-.97-.45-.97-1v-2.34a3 3 0 0 0-3-3c-1.28 0-2.4.8-2.83 2" />
          <path d="M6 4v5a6 6 0 0 0 12 0V4" />
        </svg>
      );
    default:
      return null;
  }
}

function LogoCloud() {
  return (
    <section
      className="fade-in-up"
      style={{
        position: 'relative',
        padding: '64px 0',
        overflow: 'hidden',
        background: '#000',
      }}
    >
      {/* Title */}
      <p
        style={{
          textAlign: 'center',
          color: 'rgba(212, 175, 55, 0.6)',
          fontSize: '12px',
          textTransform: 'uppercase',
          letterSpacing: '0.22em',
          marginBottom: '40px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
        }}
      >
        Powered by cutting-edge AI technology
      </p>

      {/* Marquee Track */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          className="animate-marquee"
          style={{
            display: 'flex',
            gap: '48px',
            width: 'max-content',
          }}
        >
          {/* Duplicate logos for seamless loop */}
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="glass-gold"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(184, 134, 11, 0.08) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(212, 175, 55, 0.18)',
                  color: 'var(--gold-primary)',
                }}
              >
                <Icon type={logo.icon} />
              </div>
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-heading)',
                  whiteSpace: 'nowrap',
                }}
              >
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient overlays */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '150px',
          background: 'linear-gradient(to right, #000, transparent)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '150px',
          background: 'linear-gradient(to left, #000, transparent)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}

export default memo(LogoCloud);
