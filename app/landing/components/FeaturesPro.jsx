"use client";

import { memo } from "react";
import "../landing-animations.css";

// Feature texts
const FEATURES = [
  { icon: "⚡", name: "Super Fast", desc: "Generate professional videos in seconds", gradient: "linear-gradient(135deg, #ffd700, #ff9500)" },
  { icon: "🎯", name: "Easy to Use", desc: "No editing skills required", gradient: "linear-gradient(135deg, #a8ff7a, #22c55e)" },
  { icon: "🎨", name: "Multiple Styles", desc: "Cinematic, Anime, Cyberpunk & more", gradient: "linear-gradient(135deg, #7ae0ff, #3b82f6)" },
  { icon: "🎬", name: "Multi-Scene", desc: "Complex videos with smooth transitions", gradient: "linear-gradient(135deg, #f472b6, #ec4899)" },
  { icon: "🎙️", name: "Audio Support", desc: "Voice narration in multiple languages", gradient: "linear-gradient(135deg, #c084fc, #8b5cf6)" },
  { icon: "📐", name: "All Formats", desc: "16:9 or 9:16 up to 1080p", gradient: "linear-gradient(135deg, #fb923c, #f97316)" },
];

const FeatureCard = memo(function FeatureCard({ icon, name, desc, gradient, isLarge, delay }) {
  return (
    <div 
      className={`animate-card animate-fade-in animate-fade-in-delay-${delay}`}
      style={{
        padding: '24px',
        borderRadius: '16px',
        background: 'rgba(20, 20, 20, 0.9)',
        border: '1px solid rgba(212, 175, 55, 0.1)',
        gridColumn: isLarge ? 'span 2' : 'span 1',
      }}
    >
      <div 
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'grid',
          placeItems: 'center',
          fontSize: '22px',
          marginBottom: '16px',
          background: gradient,
        }}
      >
        {icon}
      </div>
      <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: 700, margin: '0 0 8px 0' }}>{name}</h3>
      <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.5, margin: 0 }}>{desc}</p>
    </div>
  );
});

function FeaturesPro() {
  return (
    <section 
      style={{
        padding: '80px 24px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {FEATURES.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} isLarge={idx === 0} delay={(idx % 5) + 1} />
        ))}
      </div>
    </section>
  );
}

export default memo(FeaturesPro);
