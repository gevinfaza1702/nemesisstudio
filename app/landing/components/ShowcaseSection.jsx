"use client";

import { memo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "./TiltCard";
import "../landing-animations.css";

const tabs = [
  {
    id: "text-to-video",
    label: "Text to Video",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Turn Words into Visuals",
    description:
      "Simply write the description you want, and our AI will bring your vision to life. From cinematic scenes to animated stories.",
    video: "/video/veo4.mp4",
  },
  {
    id: "image-to-video",
    label: "Image to Video",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    title: "Animate Your Images",
    description:
      "Transform static images into dynamic videos. Add motion, effects, and transitions to bring your photos to life.",
    video: "/video/sora2.mp4",
  },
  {
    id: "enhancement",
    label: "Video Enhancement",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <path d="M5 19l1 3 1-3 3-1-3-1-1-3-1 3-3 1 3 1z" />
      </svg>
    ),
    title: "Enhance & Upscale",
    description:
      "Upgrade your videos with AI-powered enhancement. Improve resolution, reduce noise, and add professional polish.",
    video: "/video/13.mp4",
  },
];

const features = [
  "Intuitive interface for creators",
  "Real-time previews and adjustments",
  "Export in various formats and resolutions",
  "Seamless team collaboration",
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

const contentVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
      delay: 0.1,
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
      delay: 0.2,
    },
  },
};

function ShowcaseSection() {
  const [activeTab, setActiveTab] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [activeTab]);

  const currentTab = tabs[activeTab];

  return (
    <section
      id="showcase"
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
        height: '800px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 60%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      {/* Content container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header - with scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          <div className="lux-eyebrow">
            Powerful Tools
          </div>

          <h2
            className="lux-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              margin: '0 0 24px 0',
            }}
          >
            <span className="text-accent-gold">Golden</span> Creation Tools
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
            Multiple ways to create stunning videos. Choose the workflow that fits your needs.
          </p>
        </motion.div>

        {/* Tabs - kimi_UI style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '48px' }}
        >
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                background: activeTab === index
                  ? 'linear-gradient(135deg, #FFD700, #D4AF37)'
                  : 'rgba(255, 215, 0, 0.05)',
                color: activeTab === index ? '#000' : 'rgba(255, 255, 255, 0.7)',
                boxShadow: activeTab === index ? '0 8px 24px rgba(255, 215, 0, 0.3)' : 'none',
              }}
            >
              <span style={{ color: activeTab === index ? '#000' : '#FFD700' }}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content Grid - 2-column layout with scroll animation */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '48px',
            alignItems: 'center',
          }}
        >
          {/* Left - Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={contentVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
              >
                {/* Tab badge */}
                <span
                  className="glass-gold"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    width: 'fit-content',
                  }}
                >
                  <span style={{ color: '#FFD700' }}>{currentTab.icon}</span>
                  <span style={{ color: '#FFD700', fontSize: '14px', fontWeight: 500 }}>
                    {currentTab.label}
                  </span>
                </span>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(24px, 3vw, 36px)',
                    fontWeight: 700,
                    color: '#fff',
                    margin: 0,
                  }}
                >
                  {currentTab.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '18px',
                    lineHeight: 1.7,
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: 0,
                  }}
                >
                  {currentTab.description}
                </p>

                {/* Feature list */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {features.map((item, index) => (
                    <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #FFD700, #D4AF37)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontFamily: 'var(--font-body)' }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link
                  href="/prompt-tunggal"
                  className="btn-primary-gold"
                  style={{
                    padding: '16px 32px',
                    fontSize: '15px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: 'fit-content',
                    marginTop: '16px',
                  }}
                >
                  Try Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right - Video with TiltCard */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={imageVariants}
            style={{ position: 'relative', perspective: '2000px' }}
          >
            <TiltCard tiltAmount={5} glowColor="#FFD700">
              <div
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.18)',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.video
                    key={currentTab.id}
                    ref={videoRef}
                    src={currentTab.video}
                    muted
                    playsInline
                    loop
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </AnimatePresence>

                {/* Overlay gradient */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent 50%)',
                    pointerEvents: 'none',
                  }}
                />

                {/* Corner frames */}
                <div style={{ position: 'absolute', top: '16px', left: '16px', width: '40px', height: '40px', borderTop: '1px solid rgba(212, 175, 55, 0.35)', borderLeft: '1px solid rgba(212, 175, 55, 0.35)' }} />
                <div style={{ position: 'absolute', top: '16px', right: '16px', width: '40px', height: '40px', borderTop: '1px solid rgba(212, 175, 55, 0.35)', borderRight: '1px solid rgba(212, 175, 55, 0.35)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '40px', height: '40px', borderBottom: '1px solid rgba(212, 175, 55, 0.35)', borderLeft: '1px solid rgba(212, 175, 55, 0.35)' }} />
                <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '40px', height: '40px', borderBottom: '1px solid rgba(212, 175, 55, 0.35)', borderRight: '1px solid rgba(212, 175, 55, 0.35)' }} />
              </div>
            </TiltCard>

            {/* Decorative glow orbs */}
            <div
              style={{
                position: 'absolute',
                top: '-16px',
                right: '-16px',
                width: '96px',
                height: '96px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '-16px',
                left: '-16px',
                width: '128px',
                height: '128px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
                borderRadius: '50%',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default memo(ShowcaseSection);
