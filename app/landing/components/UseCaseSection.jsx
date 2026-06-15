"use client";

import { memo, useState } from "react";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import "../landing-animations.css";

const USE_CASES = [
  {
    title: "Seller & Affiliate",
    desc: "Auto-generate product videos for marketplace & affiliate marketing",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    gradient: "from-[#FFD700]/20 to-[#B8860B]/20",
  },
  {
    title: "Content Creator",
    desc: "Daily content without hours of tiring editing",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <circle cx="12" cy="10" r="2" />
      </svg>
    ),
    gradient: "from-[#D4AF37]/20 to-[#FFD700]/20",
  },
  {
    title: "SMB & Brand",
    desc: "Fast & affordable video ads without hiring a videographer",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    gradient: "from-[#B8860B]/20 to-[#D4AF37]/20",
  },
  {
    title: "Agency & Freelancer",
    desc: "Scale video production for multiple clients at once",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <line x1="12" y1="2" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="22" />
        <line x1="2" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="22" y2="12" />
      </svg>
    ),
    gradient: "from-[#FFD700]/20 to-[#D4AF37]/20",
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
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

function UseCaseSection() {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  return (
    <section
      id="fitur"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 1,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.025), transparent)',
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
            Who It's For
          </div>

          <h2
            className="lux-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              margin: '0 0 24px 0',
            }}
          >
            Nemesis Studio{' '}
            <span className="text-accent-gold">Is For You.</span>
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
            Our technology is designed to empower every creative vision.
            Whatever your role, we have the solution.
          </p>
        </motion.div>

        {/* Cards Grid - with staggered scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            perspective: '2000px',
          }}
        >
          {USE_CASES.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
            >
              <TiltCard tiltAmount={5} glowColor="#FFD700">
                <div
                  className="lux-card"
                  style={{
                    padding: '32px',
                    position: 'relative',
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(-1)}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      background: `linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(184, 134, 11, 0.05))`,
                      border: '1px solid rgba(212, 175, 55, 0.18)',
                      display: 'grid',
                      placeItems: 'center',
                      marginBottom: '24px',
                      transition: 'transform 0.3s ease',
                      transform: hoveredIndex === idx ? 'scale(1.06)' : 'scale(1)',
                      color: '#FFD700',
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Content */}
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: hoveredIndex === idx ? '#FFD700' : '#fff',
                      margin: '0 0 12px 0',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      lineHeight: 1.6,
                      color: 'rgba(255, 255, 255, 0.6)',
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </p>

                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default memo(UseCaseSection);
