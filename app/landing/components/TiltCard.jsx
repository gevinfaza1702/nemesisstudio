"use client";

import { useRef, useState, useCallback, useMemo } from 'react';

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export default function TiltCard({
  children,
  className = '',
  tiltAmount = 15,
  glowColor = '#FFD700',
}) {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const rafId = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !isHovered) return;

    // Use requestAnimationFrame for smooth 60fps updates without React render cycle overhead
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate rotation
      const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * -tiltAmount;
      const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * tiltAmount;

      // Apply transform directly to DOM element
      cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      
      // Update glow position if it exists
      if (glowRef.current) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        glowRef.current.style.background = `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${glowColor}25, transparent 60%)`;
      }
    });
  }, [tiltAmount, isHovered, glowColor]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (cardRef.current) {
      cardRef.current.style.willChange = 'transform';
      cardRef.current.style.transition = 'transform 0.1s ease-out';
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (rafId.current) cancelAnimationFrame(rafId.current);
    
    // Smoothly return to center
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
      cardRef.current.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      // Clear will-change after animation ends
      setTimeout(() => {
        if (cardRef.current) cardRef.current.style.willChange = 'auto';
      }, 500);
    }
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at 50% 50%, ${glowColor}00, transparent)`;
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      style={{
        position: 'relative',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Optimized Glow Effect */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          background: `radial-gradient(circle at 50% 50%, ${glowColor}00, transparent)`,
          pointerEvents: 'none',
          zIndex: 2,
          transition: 'background 0.3s ease', // Only transition opacity
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
