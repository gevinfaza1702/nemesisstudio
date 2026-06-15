"use client";

import { memo } from 'react';

// CSS-only particle background - zero JS overhead, GPU-composited
function ParticleBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, #000 0%, #050505 50%, #000 100%)',
        overflow: 'hidden',
        contain: 'strict',
      }}
    >
      {/* Ambient gold radial glows */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '15%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.04) 0%, transparent 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 215, 0, 0.025) 0%, transparent 60%)',
          transform: 'translate(-50%, -50%) translate3d(0, 0, 0)',
        }}
      />

      {/* CSS-animated floating gold particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="css-particle"
          style={{
            position: 'absolute',
            top: p.top,
            left: p.left,
            width: p.size + 'px',
            height: p.size + 'px',
            borderRadius: '50%',
            background: p.color,
            opacity: p.opacity,
            animation: `cssFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
            transform: 'translate3d(0, 0, 0)',
          }}
        />
      ))}

      {/* Subtle golden ring */}
      <div
        className="animate-spin-slow"
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 215, 0, 0.06)',
          transform: 'translate(-50%, -50%)',
          animationDuration: '120s',
        }}
      />
      <div
        className="animate-spin-slow"
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '1px solid rgba(255, 215, 0, 0.04)',
          transform: 'translate(-50%, -50%)',
          animationDuration: '90s',
          animationDirection: 'reverse',
        }}
      />
    </div>
  );
}

// Pre-computed particle positions (no runtime calculation)
const PARTICLES = [
  { top: '8%', left: '12%', size: 3, color: '#FFD700', opacity: 0.5, duration: 18, delay: 0 },
  { top: '15%', left: '78%', size: 2, color: '#D4AF37', opacity: 0.4, duration: 22, delay: 2 },
  { top: '25%', left: '35%', size: 4, color: '#FFD700', opacity: 0.3, duration: 20, delay: 1 },
  { top: '35%', left: '88%', size: 2, color: '#FFD700', opacity: 0.5, duration: 16, delay: 3 },
  { top: '45%', left: '5%', size: 3, color: '#D4AF37', opacity: 0.4, duration: 24, delay: 0.5 },
  { top: '55%', left: '62%', size: 2, color: '#FFD700', opacity: 0.35, duration: 19, delay: 1.5 },
  { top: '65%', left: '22%', size: 3, color: '#D4AF37', opacity: 0.45, duration: 21, delay: 2.5 },
  { top: '72%', left: '75%', size: 2, color: '#FFD700', opacity: 0.3, duration: 17, delay: 0 },
  { top: '80%', left: '45%', size: 4, color: '#FFD700', opacity: 0.4, duration: 23, delay: 1 },
  { top: '88%', left: '15%', size: 2, color: '#D4AF37', opacity: 0.35, duration: 20, delay: 3 },
  { top: '92%', left: '90%', size: 3, color: '#FFD700', opacity: 0.3, duration: 18, delay: 2 },
  { top: '40%', left: '50%', size: 2, color: '#D4AF37', opacity: 0.25, duration: 25, delay: 4 },
];

export default memo(ParticleBackground);
