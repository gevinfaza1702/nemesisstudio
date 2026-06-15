"use client";

import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../landing-animations.css";

const STEPS = [
  {
    number: "01",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: "Write Your Idea",
    desc: "Describe the video you want to create. Our AI will understand the context and style you desire.",
  },
  {
    number: "02",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
    title: "Customization",
    desc: "Adjust the duration, visual style, music, and other elements to your preferences.",
  },
  {
    number: "03",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
        <path d="M18 15l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L16 17l1.5-.5.5-1.5z" />
      </svg>
    ),
    title: "Generate",
    desc: "Click generate and watch the AI create amazing videos in seconds.",
  },
];

// Animation variants - OPTIMIZED for performance
const headerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const stepVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

function HowItWorks() {
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      id="cara-kerja"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 1,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.025) 0%, transparent 55%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      {/* Content container */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header - with scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <div className="lux-eyebrow">
            Easy Process
          </div>

          <h2
            className="lux-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              margin: '0 0 20px 0',
            }}
          >
            Your Vision.{' '}
            <span className="text-accent-gold">AI Efficiency.</span>
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.55)',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Three simple steps to transform your ideas into stunning visual content.
          </p>
        </motion.div>

        {/* Steps - with staggered scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            alignItems: isMobile ? 'center' : 'flex-start',
            gap: isMobile ? '48px' : '80px',
          }}
        >
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              variants={stepVariants}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Circle with icon */}
              <div
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(-1)}
                style={{
                  position: 'relative',
                  width: isMobile ? '80px' : '100px',
                  height: isMobile ? '80px' : '100px',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: hoveredIndex === idx
                      ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(184, 134, 11, 0.2))'
                      : 'rgba(0, 0, 0, 0.6)',
                    border: hoveredIndex === idx ? '2px solid #FFD700' : '1px solid rgba(255, 215, 0, 0.2)',

                    display: 'grid',
                    placeItems: 'center',
                    transition: 'all 0.4s ease',
                    transform: hoveredIndex === idx ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: hoveredIndex === idx ? '0 0 40px rgba(255, 215, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div
                    style={{
                      transition: 'transform 0.4s ease',
                      transform: hoveredIndex === idx ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {step.icon}
                  </div>
                </div>

                {/* Number badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: isMobile ? '32px' : '40px',
                    height: isMobile ? '32px' : '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FFD700, #D4AF37)',
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'var(--font-heading)',
                    fontSize: isMobile ? '12px' : '15px',
                    fontWeight: 700,
                    color: '#000',
                    transition: 'all 0.4s ease',
                    transform: hoveredIndex === idx ? 'scale(1.1) rotate(10deg)' : 'scale(1) rotate(0deg)',
                    boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)',
                    zIndex: 2,
                  }}
                >
                  {step.number}
                </div>
              </div>

              {/* Text */}
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: hoveredIndex === idx ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                  margin: '32px 0 16px 0',
                  transition: 'color 0.3s ease',
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                  maxWidth: '220px',
                }}
              >
                {step.desc}
              </p>

              {/* Arrow connector (desktop only) */}
              {idx < STEPS.length - 1 && !isMobile && (
                <div
                  style={{
                    position: 'absolute',
                    right: '-50px',
                    top: '50px',
                    opacity: 0.3,
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default memo(HowItWorks);
