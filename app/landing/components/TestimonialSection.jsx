"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import "../landing-animations.css";

// English testimonials for Nemesis Studio
const testimonials = [
  {
    name: "Rina S.",
    role: "Content Creator",
    content:
      "Usually making 1 video takes 2 hours, with Nemesis Studio it only takes 5 minutes. Total game changer!",
    rating: 5,
  },
  {
    name: "Budi P.",
    role: "Shopee Seller",
    content:
      "My product videos look more professional. Sales increased by 40% after using videos from Nemesis Studio.",
    rating: 5,
  },
  {
    name: "Dewi A.",
    role: "Digital Agency",
    content:
      "We can handle more clients without adding team members. The ROI is crazy!",
    rating: 5,
  },
  {
    name: "Ahmad R.",
    role: "YouTuber",
    content:
      "I was skeptical at first, but the quality of the generated videos is amazing. My subscribers love this new content!",
    rating: 5,
  },
  {
    name: "Lisa M.",
    role: "Marketing Director",
    content:
      "Our team increased video output by 300% since using Nemesis Studio. The AI is truly powerful.",
    rating: 5,
  },
  {
    name: "Farhan K.",
    role: "Startup Founder",
    content:
      "As a startup, we needed a cost-effective solution for video marketing. Nemesis Studio exceeded our expectations.",
    rating: 5,
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

function TestimonialSection() {
  return (
    <section
      id="testimoni"
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
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '900px',
        height: '700px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.025) 0%, transparent 50%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {/* Header - with scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          style={{ textAlign: 'center', marginBottom: '72px' }}
        >
          {/* Eyebrow */}
          <div className="lux-eyebrow">
            Testimonials
          </div>

          {/* Title */}
          <h2
            className="lux-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              margin: '0 0 24px 0',
            }}
          >
            Loved by <span className="text-accent-gold">Elite Creators</span>
          </h2>

          {/* Description */}
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
            See what our users say about their experience with Nemesis Studio.
          </p>
        </motion.div>

        {/* Testimonials Grid - with staggered scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto',
            perspective: '2000px',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
            >
              <TiltCard tiltAmount={4} glowColor="#FFD700">
                <div
                  className="lux-card"
                  style={{
                    padding: '28px',
                    position: 'relative',
                  }}
                >
                  {/* Quote icon - kimi_UI style */}
                  <div style={{ marginBottom: '16px' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255, 215, 0, 0.3)" strokeWidth="1">
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                  </div>

                  {/* Rating - gold stars */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="1">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Content */}
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '15px',
                      lineHeight: 1.7,
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0 0 24px 0',
                    }}
                  >
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* Avatar - circular with gold border */}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #FFD700, #D4AF37)',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#000',
                        fontWeight: 600,
                        fontSize: '18px',
                        fontFamily: 'var(--font-heading)',
                        border: '2px solid rgba(255, 215, 0, 0.3)',
                      }}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '15px',
                        fontWeight: 600,
                        color: '#fff',
                      }}>
                        {testimonial.name}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'rgba(255, 215, 0, 0.7)',
                      }}>
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default memo(TestimonialSection);
