"use client";

import { memo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "../landing-animations.css";

function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <footer
      style={{
        padding: '120px 24px 48px',
        position: 'relative',
        zIndex: 1,
        background: '#000',
        borderTop: '1px solid rgba(212, 175, 55, 0.08)',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.03) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: -1,
        pointerEvents: 'none'
      }} />
      
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* CTA Section */}
        <div
          className="lux-card"
          style={{
            textAlign: 'center',
            padding: '88px 32px',
            marginBottom: '80px',
            background: 'linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, rgba(8, 8, 8, 0.6) 100%)',
            position: 'relative',
            overflow: 'hidden',
            borderColor: 'rgba(212, 175, 55, 0.25)'
          }}
        >
          {/* Floating decorative elements */}
          <div 
            className="animate-float"
            style={{
              position: 'absolute',
              top: '30px',
              left: '10%',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '1px solid rgba(212, 175, 55, 0.12)',
            }}
          />
          <div 
            className="animate-float-slow"
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '15%',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid rgba(212, 175, 55, 0.1)',
              animationDelay: '1s'
            }}
          />
          <div 
            className="animate-pulse-glow-gold"
            style={{
              position: 'absolute',
              top: '50%',
              right: '8%',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#FFD700',
            }}
          />
          <div 
            className="animate-pulse-glow-gold"
            style={{
              position: 'absolute',
              top: '25%',
              left: '20%',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#D4AF37',
              animationDelay: '0.5s'
            }}
          />

          {/* Central glow */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: -1,
            pointerEvents: 'none'
          }} />

          <h3
            className="lux-heading"
            style={{
              fontSize: 'clamp(32px, 5vw, 46px)',
              margin: '0 0 20px 0',
              position: 'relative',
              zIndex: 1
            }}
          >
            Ready to Create <span className="text-accent-gold">Golden</span> Videos?
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.55)',
              margin: '0 0 48px 0',
              maxWidth: '600px',
              marginInline: 'auto',
              position: 'relative',
              zIndex: 1
            }}
          >
            Join thousands of creators who have transformed the way they tell stories with AI.
          </p>
          <Link
            href="/prompt-tunggal"
            className="btn-primary-gold"
            style={{
              padding: '20px 56px',
              fontSize: '16px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              position: 'relative',
              zIndex: 1
            }}
          >
            Start Your Journey
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {/* Footer content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '48px',
            paddingBottom: '64px',
            borderBottom: '1px solid rgba(212, 175, 55, 0.08)',
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: isMobile ? '100%' : '280px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                  <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zM3 20h18" />
                </svg>
              </div>
              <span
                className="text-gradient-gold"
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '-0.02em'
                }}
              >
                Nemesis Studio
              </span>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'rgba(255, 255, 255, 0.5)',
                margin: 0,
              }}
            >
              The leading AI video generator platform in Indonesia. Empowering unlimited imagination through cutting-edge visual technology.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '13px', 
              fontWeight: 700,
              color: 'var(--gold-primary)',
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.12em'
            }}>
              Product
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/prompt-tunggal" className="link-nemesis" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none', color: 'rgba(255, 255, 255, 0.6)' }}>AI Video</Link>
              <Link href="/image-generator" className="link-nemesis" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none', color: 'rgba(255, 255, 255, 0.6)' }}>AI Image</Link>
              <Link href="/musik" className="link-nemesis" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none', color: 'rgba(255, 255, 255, 0.6)' }}>AI Music</Link>
              <Link href="#showcase" className="link-nemesis" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none', color: 'rgba(255, 255, 255, 0.6)' }}>Showcase</Link>
            </div>
          </div>

          {/* Links 2 */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '13px', 
              fontWeight: 700,
              color: 'var(--gold-primary)',
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.12em'
            }}>
              Resources
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#fitur" className="link-nemesis" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none', color: 'rgba(255, 255, 255, 0.6)' }}>Features</a>
              <a href="#pricing" className="link-nemesis" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none', color: 'rgba(255, 255, 255, 0.6)' }}>Pricing</a>
              <a href="#faq" className="link-nemesis" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none', color: 'rgba(255, 255, 255, 0.6)' }}>FAQ</a>
              <a href="mailto:support@nemesisstudio.ai" className="link-nemesis" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', textDecoration: 'none', color: 'rgba(255, 255, 255, 0.6)' }}>Support</a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ 
              fontFamily: 'var(--font-heading)', 
              fontSize: '13px', 
              fontWeight: 700,
              color: 'var(--gold-primary)',
              margin: '0 0 24px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.12em'
            }}>
              Stay Updated
            </h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '16px', lineHeight: 1.5 }}>
              Get the latest feature updates from Nemesis Studio directly in your inbox.
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Email address"
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'var(--font-body)'
                }}
              />
              <button style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '0 16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>


        {/* Bottom section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            paddingTop: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                color: 'rgba(255, 255, 255, 0.4)',
                margin: 0,
              }}
            >
              © 2025 Nemesis Studio. All Rights Reserved.
            </p>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.3)' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.4)', margin: 0 }}>Built with Passion & AI</p>
          </div>

          {/* Social - kimi_UI style */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a
              href="#"
              className="glass-gold"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="18" cy="6" r="1" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              className="glass-gold"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
            <a
              href="#"
              className="glass-gold"
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                transition: 'all 0.3s ease',
                textDecoration: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.2)';
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);

