"use client";

import { memo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import "../landing-animations.css";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isFirstRender = useRef(true);

  // Mount and mobile detection
  useEffect(() => {
    setMounted(true);
    // Mark first render complete after mount
    requestAnimationFrame(() => {
      isFirstRender.current = false;
    });
    const checkMobile = () => setIsMobile(window.innerWidth < 900);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#fitur", label: "Features" },
    { href: "#showcase", label: "Showcase" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  if (!mounted) return null;

  // Mobile Navbar - Pure CSS transitions
  if (isMobile) {
    return (
      <>
        <div
          style={{
            position: 'fixed',
            top: '12px',
            left: '12px',
            right: '12px',
            zIndex: 5000,
            transform: 'translate3d(0, 0, 0)',
            transition: 'none',
          }}
        >
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 16px',
              background: 'rgba(5, 5, 5, 0.9)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              borderRadius: '24px',
              border: '1px solid var(--glass-border)',
            }}
          >
            <div 
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--white-pure)',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </div>

            <Link href="/landing" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <Image
                src="/images/nemesisstudio.png"
                alt="Nemesis Studio"
                width={28}
                height={28}
                style={{ borderRadius: '6px' }}
                priority
              />
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '16px',
                  fontWeight: 900,
                  color: 'var(--white-pure)',
                  letterSpacing: '-0.03em'
                }}
              >
                Nemesis
              </span>
            </Link>

            <Link
              href="/login"
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gold-primary)',
                borderRadius: '50%',
                color: 'var(--black-deep)',
                textDecoration: 'none'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: '12px',
            right: '12px',
            zIndex: 4999,
            background: 'rgba(10, 10, 10, 0.98)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '24px',
            borderRadius: '24px',
            border: '1px solid var(--glass-border)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
            transform: menuOpen ? 'translate3d(0, 0, 0)' : 'translate3d(0, -20px, 0)',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '16px',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'var(--white-pure)',
                  textDecoration: 'none',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
            <Link href="/register" className="btn-nemesis" style={{ padding: '16px', textAlign: 'center', textDecoration: 'none' }}>
              Create Account
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Desktop Navbar - Pure CSS transitions (no flip on reload)
  return (
    <div
      style={{
        position: 'fixed',
        top: isScrolled ? '12px' : '24px',
        left: 0,
        right: 0,
        zIndex: 5000,
        display: 'flex',
        justifyContent: 'center',
        transform: 'translate3d(0, 0, 0)',
        transition: 'top 0.3s ease',
      }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 6px 6px 20px',
          gap: '40px',
          background: isScrolled ? 'rgba(0, 0, 0, 0.8)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderRadius: '999px',
          border: '1px solid',
          borderColor: isScrolled ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
          transition: 'all 0.5s ease',
          boxShadow: isScrolled ? '0 8px 30px rgba(0, 0, 0, 0.4)' : 'none',
        }}
      >
        <Link href="/landing" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Image
            src="/images/nemesisstudio.png"
            alt="Nemesis Studio"
            width={32}
            height={32}
            style={{ 
              borderRadius: '8px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}
            priority
          />
          <span
            className="text-gradient-gold"
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.03em'
            }}
          >
            Nemesis Studio
          </span>
        </Link>

        <div style={{ display: 'flex', gap: '32px' }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                position: 'relative',
                fontFamily: 'var(--font-heading)',
                fontSize: '13px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255, 255, 255, 0.7)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#FFD700';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link
            href="/login"
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'color 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#FFD700';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-primary-gold"
            style={{
              padding: '10px 24px',
              borderRadius: '999px',
              fontFamily: 'var(--font-heading)',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Get Started
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default memo(Navbar);

