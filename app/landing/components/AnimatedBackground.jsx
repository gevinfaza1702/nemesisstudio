"use client";

import { memo } from "react";
import "../landing-animations.css";

function AnimatedBackground() {
  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: '#050505',
        contain: 'strict',
        willChange: 'auto',
      }}
    >
      {/* Abstract gold aurora - optimized with lower blur */}
      <div 
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 60%)',
          top: '-200px',
          left: '-150px',
          filter: 'blur(40px)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(181, 142, 0, 0.06) 0%, transparent 60%)',
          top: '40%',
          right: '-150px',
          filter: 'blur(40px)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
      />
      
      {/* Floating gold particles - reduced to 4 for performance */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="particle" />
      ))}
      
      {/* Subtle grid pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(212, 175, 55, 0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212, 175, 55, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
    </div>
  );
}

export default memo(AnimatedBackground);
