"use client";

import { memo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import TiltCard from "./TiltCard";
import "../landing-animations.css";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "Forever",
    desc: "Perfect for trying out basic features",
    features: ["Dashboard Access", "Feature Preview", "Full Tutorials"],
    excluded: ["Video Generation", "Image Generation"],
    btnText: "Start Free",
    btnLink: "/prompt-tunggal?plan=free",
  },
  {
    name: "Veo 3.1",
    price: "300k",
    period: "Lifetime",
    desc: "Full Veo 3.1 access forever",
    features: ["Unlimited Videos", "Unlimited Images", "Unlimited Music", "Veo 3.1 Model", "HD Download"],
    excluded: ["Sora 2 Model"],
    btnText: "Get Started",
    btnLink: "/prompt-tunggal?plan=veo_lifetime",
  },
  {
    name: "Ultimate",
    price: "370k",
    period: "Lifetime",
    desc: "Complete access to all features",
    features: ["All Veo 3.1 Features", "Sora 2 Model", "Priority Support", "Early Access"],
    excluded: [],
    featured: true,
    btnText: "Get Ultimate",
    btnLink: "/prompt-tunggal?plan=veo_sora_unlimited",
  },
  {
    name: "Monthly",
    price: "70k",
    period: "/month",
    desc: "Flexible, cancel anytime",
    features: ["All Features", "Veo 3.1 + Sora 2", "Cancel Anytime"],
    excluded: [],
    btnText: "Subscribe",
    btnLink: "/prompt-tunggal?plan=monthly&days=28",
  },
];

const PricingCard = memo(function PricingCard({ plan, delay, isMobile, isYearly }) {
  const isMonthlyPlan = plan.name === "Monthly";
  const displayPrice = isMonthlyPlan && isYearly ? "700k" : plan.price;
  const displayPeriod = isMonthlyPlan && isYearly ? "/year" : plan.period;

  return (
    <TiltCard
      tiltAmount={isMobile ? 5 : 6}
      glowColor={plan.featured ? '#FFD700' : '#B8860B'}
      className={`fade-in-up fade-in-up-delay-${delay}`}
    >
      <div
        className={`lux-card`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: isMobile ? '32px 24px' : '40px 32px',
          position: 'relative',
          width: isMobile ? '300px' : 'auto',
          minHeight: isMobile ? '500px' : '520px',
          flex: isMobile ? '0 0 auto' : '1',
          marginTop: isMobile && plan.featured ? '20px' : '0',
          zIndex: plan.featured ? 2 : 1,
          borderColor: plan.featured ? 'rgba(212, 175, 55, 0.4)' : undefined,
          boxShadow: plan.featured
            ? '0 0 50px rgba(212, 175, 55, 0.12), inset 0 1px 0 rgba(212, 175, 55, 0.1)'
            : undefined,
          background: plan.featured
            ? 'linear-gradient(180deg, rgba(212, 175, 55, 0.07) 0%, rgba(8, 8, 8, 0.7) 100%)'
            : undefined,
          transform: plan.featured && !isMobile ? 'scale(1.04)' : undefined,
        }}
    >
      {/* Corner decorations for featured */}
      {plan.featured && (
        <>
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '24px',
            height: '24px',
            borderTop: '2px solid rgba(255, 215, 0, 0.4)',
            borderLeft: '2px solid rgba(255, 215, 0, 0.4)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '24px',
            height: '24px',
            borderBottom: '2px solid rgba(255, 215, 0, 0.4)',
            borderRight: '2px solid rgba(255, 215, 0, 0.4)',
          }} />
        </>
      )}

      {plan.featured && (
        <div
          className=""
          style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '8px 20px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%)',
            color: '#000',
            fontSize: '11px',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
            zIndex: 10,
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          Most Popular
        </div>
      )}

      <div style={{ marginBottom: '32px' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '16px',
            fontWeight: 700,
            color: plan.featured ? '#FFD700' : 'rgba(255, 255, 255, 0.6)',
            margin: '0 0 16px 0',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          {plan.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
          <span
            className={plan.featured ? 'text-gradient-gold' : ''}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: isMobile ? '44px' : '52px',
              fontWeight: 900,
              color: plan.featured ? undefined : 'var(--white-pure)',
              letterSpacing: '-0.02em'
            }}
          >
            {displayPrice}
          </span>
          <span style={{ 
            fontFamily: 'var(--font-body)', 
            fontSize: '14px', 
            color: 'rgba(255, 255, 255, 0.5)',
            fontWeight: 500
          }}>
            {displayPeriod}
          </span>
        </div>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            lineHeight: 1.6,
            color: 'rgba(255, 255, 255, 0.5)',
            margin: 0,
          }}
        >
          {plan.desc}
        </p>
      </div>


      <div
        style={{
          height: '1px',
          background: plan.featured 
            ? 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)' 
            : 'rgba(255, 255, 255, 0.1)',
          width: '100%',
          marginBottom: '32px'
        }}
      />

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '0 0 40px 0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {plan.features.map((f, i) => (
          <li
            key={i}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--white-pure)',
              lineHeight: 1.4
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(255, 215, 0, 0.15)" stroke="#FFD700" strokeWidth="1.5" />
                <path d="M8 12l3 3 5-6" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {f}
          </li>
        ))}
        {plan.excluded.map((f, i) => (
          <li
            key={`ex-${i}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.3)',
              lineHeight: 1.4
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" />
                <path d="M8 8l8 8M16 8l-8 8" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={plan.btnLink}
        className={plan.featured ? 'btn-primary-gold' : 'btn-secondary-gold'}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '16px 24px',
          borderRadius: '12px',
          fontFamily: 'var(--font-heading)',
          fontSize: '14px',
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        {plan.btnText}
      </Link>
      </div>
    </TiltCard>
  );
});

function PricingSection() {
  const [isMobile, setIsMobile] = useState(false);
  const [isYearly, setIsYearly] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section
      id="pricing"
      style={{
        padding: '140px 24px',
        position: 'relative',
        zIndex: 1,
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* Background gradients */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.04) 0%, transparent 55%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.03) 0%, transparent 55%)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '72px', position: 'relative', zIndex: 1 }}>
        <div className="fade-in-up lux-eyebrow">
          Pricing Plans
        </div>
        <h2
          className="fade-in-up fade-in-up-delay-1 lux-heading"
          style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            margin: '0 0 20px 0',
          }}
        >
          Choose Your <span className="text-accent-gold">Golden</span> Plan
        </h2>
        <p
          className="fade-in-up fade-in-up-delay-2"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.6)',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.6
          }}
        >
          Select the layout that works best for you. <br />
          Experience the luxury of AI-powered video creation.
        </p>

        {/* Monthly/Yearly Toggle - Kimi UI Style */}
        <div 
          className="fade-in-up fade-in-up-delay-3"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '4px',
            borderRadius: '999px',
            background: 'rgba(255, 215, 0, 0.05)',
            border: '1px solid rgba(255, 215, 0, 0.1)',
            marginBottom: '40px',
          }}
        >
          <button
            onClick={() => setIsYearly(false)}
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              border: 'none',
              background: !isYearly ? 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)' : 'transparent',
              color: !isYearly ? '#000' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              border: 'none',
              background: isYearly ? 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)' : 'transparent',
              color: isYearly ? '#000' : 'rgba(255, 255, 255, 0.6)',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: 'var(--font-heading)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Yearly
            <span style={{ 
              fontSize: '10px', 
              background: 'rgba(255, 215, 0, 0.2)', 
              color: isYearly ? '#000' : '#FFD700', 
              padding: '2px 8px', 
              borderRadius: '999px' 
            }}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      {isMobile ? (
        <div
          ref={scrollRef}
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            padding: '20px 16px 40px',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            position: 'relative',
            zIndex: 1
          }}
        >
          {PLANS.map((plan, idx) => (
            <div key={idx} style={{ scrollSnapAlign: 'center', flexShrink: 0 }}>
              <PricingCard plan={plan} delay={(idx % 4) + 1} isMobile={isMobile} isYearly={isYearly} />
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            maxWidth: '1400px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1
          }}
        >
          {PLANS.map((plan, idx) => (
            <PricingCard key={idx} plan={plan} delay={(idx % 4) + 1} isMobile={isMobile} isYearly={isYearly} />
          ))}
        </div>
      )}
    </section>
  );
}

export default memo(PricingSection);

