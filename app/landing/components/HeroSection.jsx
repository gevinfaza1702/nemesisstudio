"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import TiltCard from "./TiltCard";
import "../landing-animations.css";

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden',
      }}
    >
      {/* Subtle decorative elements - static, no animation */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          width: '128px',
          height: '128px',
          borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.06)',
        }} />
        <div style={{
          position: 'absolute',
          top: '160px',
          right: '80px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          border: '1px solid rgba(212, 175, 55, 0.07)',
        }} />
      </div>

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '140px 24px 80px' : '160px 48px 100px',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '48px' : '80px',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Left Column - Text */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* Eyebrow */}
            <div className="fade-in-up lux-eyebrow lux-eyebrow-left" style={{ width: 'fit-content', marginBottom: 0 }}>
              Premium AI Video Generation
            </div>

            {/* Title */}
            <h1
              className="fade-in-up fade-in-up-delay-1 lux-heading"
              style={{
                fontSize: isMobile ? 'clamp(40px, 10vw, 52px)' : 'clamp(48px, 5vw, 72px)',
                margin: 0,
              }}
            >
              Create <span className="text-accent-gold">Golden</span>
              <br />
              <span>Videos with AI</span>
            </h1>

            {/* Subtitle */}
            <p
              className="fade-in-up fade-in-up-delay-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '16px' : '18px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                maxWidth: '500px',
              }}
            >
              Transform your ideas into stunning, professional videos in minutes. 
              Experience the luxury of AI-powered video creation.
            </p>

            {/* CTA Buttons */}
            <div
              className="fade-in-up fade-in-up-delay-3"
              style={{
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/register"
                className="btn-primary-gold"
                style={{
                  padding: '18px 36px',
                  fontSize: '15px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                Start Creating Free
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="#showcase"
                className="btn-secondary-gold"
                style={{
                  padding: '18px 36px',
                  fontSize: '15px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFD700" stroke="none">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div
              className="fade-in-up fade-in-up-delay-4"
              style={{
                display: 'flex',
                gap: isMobile ? '32px' : '48px',
                flexWrap: 'wrap',
                paddingTop: '16px',
              }}
            >
              <div style={{ position: 'relative' }}>
                <div className="text-gradient-gold" style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>10K+</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Elite Creators</div>
                <div style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <div className="text-gradient-gold" style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>500K+</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Videos Generated</div>
                <div style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
              </div>
              <div style={{ position: 'relative' }}>
                <div className="text-gradient-gold" style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'var(--font-heading)' }}>4.9</div>
                <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Premium Rating</div>
                <div style={{ position: 'absolute', bottom: '-6px', left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
              </div>
            </div>
          </div>

          {/* Right Column - 3D Image */}
          <div 
            className="fade-in-up fade-in-up-delay-2"
            style={{ 
              position: 'relative',
              display: isMobile ? 'none' : 'block',
            }}
          >
            <TiltCard tiltAmount={5} glowColor="#FFD700">
              <div
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.18)',
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.03) 0%, rgba(0, 0, 0, 0.85) 100%)',
                  padding: '24px',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Premium interface mockup */}
                <div style={{
                  width: '100%',
                  height: '280px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(0, 0, 0, 0.5) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  marginBottom: '20px',
                  overflow: 'hidden',
                }}>
                  {/* Fake toolbar */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FFD700', opacity: 0.6 }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D4AF37', opacity: 0.4 }} />
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#B8860B', opacity: 0.3 }} />
                  </div>
                  {/* Fake prompt area */}
                  <div style={{
                    flex: 1,
                    borderRadius: '8px',
                    background: 'rgba(255, 215, 0, 0.03)',
                    border: '1px solid rgba(255, 215, 0, 0.1)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ height: '10px', width: '80%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '10px' }} />
                      <div style={{ height: '10px', width: '60%', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', marginBottom: '10px' }} />
                      <div style={{ height: '10px', width: '40%', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
                    </div>
                    <div style={{
                      alignSelf: 'flex-end',
                      padding: '8px 20px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #FFD700, #D4AF37)',
                      color: '#000',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-heading)',
                    }}>
                      Generate ✦
                    </div>
                  </div>
                </div>
                
                {/* Text below */}
                <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
                  <div style={{ color: '#FFD700', fontWeight: 600, marginBottom: '4px' }}>Nemesis Studio</div>
                  AI Video Generator Interface
                </div>
                
                {/* Corner decorations */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', width: '24px', height: '24px', borderTop: '2px solid #FFD700', borderLeft: '2px solid #FFD700' }} />
                <div style={{ position: 'absolute', top: '16px', right: '16px', width: '24px', height: '24px', borderTop: '2px solid #FFD700', borderRight: '2px solid #FFD700' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '24px', height: '24px', borderBottom: '2px solid #FFD700', borderLeft: '2px solid #FFD700' }} />
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '24px', height: '24px', borderBottom: '2px solid #FFD700', borderRight: '2px solid #FFD700' }} />
              </div>
            </TiltCard>

            {/* Floating elements around image */}
            <div 
              className="glass-gold animate-float"
              style={{
                position: 'absolute',
                top: '-24px',
                right: '-24px',
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5">
                <path d="M12 3l1.5 4.5H18l-3.5 3 1 4.5L12 12.5l-3.5 2.5 1-4.5-3.5-3h4.5L12 3z" />
              </svg>
            </div>
            
            <div
              className="glass-gold animate-float"
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                padding: '10px 16px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                animationDelay: '1s',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80' }} />
              <span style={{ color: '#FFD700', fontSize: '13px', fontWeight: 600 }}>AI Active</span>
            </div>
            
            {/* Gold orb decoration */}
            <div 
              style={{
                position: 'absolute',
                bottom: '-40px',
                right: '40px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, transparent 70%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: 'linear-gradient(to top, #000, transparent)',
        zIndex: 10,
        pointerEvents: 'none'
      }} />
    </section>
  );
}
