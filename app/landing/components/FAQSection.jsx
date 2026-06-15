"use client";

import { memo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import "../landing-animations.css";

// English FAQ content adapted from Nemesis Studio
const faqs = [
  {
    question: "How does AI video generation work?",
    answer:
      "Our AI uses advanced machine learning models trained on millions of professional videos. Simply write your desired description, and the AI will generate a unique video based on it. You can also use images or videos as input for more control.",
  },
  {
    question: "Can the videos be used commercially?",
    answer:
      "Yes! All videos generated with Nemesis Studio have full commercial usage rights. You can use them for marketing, social media, presentations, or other commercial purposes.",
  },
  {
    question: "How long does video generation take?",
    answer:
      "Most videos are completed in 30-60 seconds. Longer or more complex videos may take 2-3 minutes. Premium and Enterprise plans receive priority processing for faster results.",
  },
  {
    question: "Is there a free trial available?",
    answer:
      "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start. You can generate up to 10 videos during the trial period.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time, no questions asked. If you cancel, your access will remain available until the end of your billing cycle.",
  },
  {
    question: "What video qualities are available?",
    answer:
      "Depending on your plan, videos can be generated in 720p, 1080p, or stunning 4K resolution. All videos are rendered with professional quality, smooth transitions, and vibrant colors.",
  },
];

// Animation variants - OPTIMIZED for performance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

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

// Pure CSS accordion styles for 60fps
const accordionStyles = `
  .faq-answer {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .faq-answer.open {
    grid-template-rows: 1fr;
  }
  .faq-answer-inner {
    overflow: hidden;
  }
  .faq-icon {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .faq-icon.open {
    transform: rotate(45deg);
  }
`;

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleItem = useCallback((index) => {
    setOpenIndex(prev => prev === index ? null : index);
  }, []);

  return (
    <section
      id="faq"
      style={{
        padding: '120px 24px',
        position: 'relative',
        zIndex: 1,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Inject CSS for smooth accordion */}
      <style dangerouslySetInnerHTML={{ __html: accordionStyles }} />

      {/* Background glow - simplified */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) translateZ(0)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
        filter: 'blur(100px)',
        zIndex: -1,
        pointerEvents: 'none',
        contain: 'strict',
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
          {/* Eyebrow */}
          <div className="lux-eyebrow">
            FAQ
          </div>

          {/* Title */}
          <h2
            className="lux-heading"
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              margin: '0 0 24px 0',
            }}
          >
            Frequently Asked <span className="text-accent-gold">Questions</span>
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
            Everything you need to know about Nemesis Studio. Can't find the answer? Contact our support team.
          </p>
        </motion.div>

        {/* FAQ Items - with staggered scroll animation */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          style={{ maxWidth: '768px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="lux-card"
                style={{
                  overflow: 'hidden',
                  background: isOpen ? 'rgba(212, 175, 55, 0.04)' : undefined,
                  borderColor: isOpen ? 'rgba(212, 175, 55, 0.3)' : undefined,
                }}
              >
                <button
                  onClick={() => toggleItem(index)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    outline: 'none',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: isOpen ? '#FFD700' : '#fff',
                      paddingRight: '16px',
                    }}
                  >
                    {faq.question}
                  </span>
                  
                  {/* Plus icon - CSS transform only */}
                  <div
                    className={`faq-icon ${isOpen ? 'open' : ''}`}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isOpen 
                        ? 'linear-gradient(135deg, #FFD700, #D4AF37)' 
                        : 'rgba(255, 215, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke={isOpen ? '#000' : '#FFD700'} 
                      strokeWidth="3" 
                      strokeLinecap="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                </button>

                {/* Answer - Pure CSS grid animation (60fps) */}
                <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
                  <div className="faq-answer-inner">
                    <div style={{ padding: '0 24px 24px 24px' }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '15px',
                          lineHeight: 1.7,
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: 0,
                        }}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default memo(FAQSection);
