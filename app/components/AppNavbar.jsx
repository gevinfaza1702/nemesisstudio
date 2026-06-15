"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import "./AppNavbar.css";
import { supabase } from "../lib/supabaseClient";
import { usePrefetchRoutes } from "../hooks/usePrefetchRoutes";

// --- PROMAX SVG ICONS ---
const IconVideo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 7l-7 5 7 5V7z" />
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
  </svg>
);

const IconImage = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const IconCamera = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconUGC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const IconBrowser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconCredits = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#fbbf24" }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
    <line x1="12" y1="6" x2="12" y2="18" />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconCreditCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const IconAdmin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconLogout = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconHome = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export default function AppNavbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState(0);
  const [username, setUsername] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Prefetch common routes for faster navigation
  usePrefetchRoutes();

  // Ensure modal renders in body to avoid stacking context issues
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Mobile detection
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check if user is admin from cookie
    const plan = (document.cookie.match(/(?:^|; )plan=([^;]+)/)?.[1] || "").toLowerCase();
    setIsAdmin(plan === "admin");

    // Get username from cookie
    const userMatch = document.cookie.match(/(?:^|; )username=([^;]+)/);
    if (userMatch) {
      setUsername(decodeURIComponent(userMatch[1]));
    }

    // Fetch credits
    const fetchCredits = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          const r = await fetch("/api/me/credits", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          const d = await r.json();
          if (r.ok) setCredits(Number(d?.credits || 0));
        }
      } catch (err) { }
    };
    fetchCredits();

    // Listen for global credit updates
    window.addEventListener("creditsUpdated", fetchCredits);
    return () => {
      window.removeEventListener("creditsUpdated", fetchCredits);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setShowLogoutModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Dynamic Page Title
  const getPageTitle = () => {
    if (pathname?.includes("/dashboard")) return "Dashboard";
    if (pathname?.includes("/image-generator")) return "Image Generator";

    if (pathname?.includes("/ugc-generator")) return "UGC Generator";
    if (pathname?.includes("/prompt-tunggal")) return "Video Generator";

    if (pathname?.includes("/profile")) return "Profile";
    if (pathname?.includes("/credit")) return "Manage Plan";
    if (pathname?.includes("/admin/dashboard")) return "Admin Dashboard";
    if (pathname?.includes("/admin/users")) return "Manage Users";
    return "Nemesis Studio";
  };

  const isVideoGeneratorPage = pathname?.includes("/prompt-tunggal");

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      document.cookie = "plan=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "planExpiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      window.location.href = "/login";
    }
  };

  const menuItems = isAdmin
    ? [
      { href: "/prompt-tunggal", icon: <IconVideo />, label: "Video" },
      { href: "/image-generator", icon: <IconImage />, label: "Image" },
      { href: "/ugc-generator", icon: <IconUGC />, label: "UGC" },
    ]
    : [
      { href: "/prompt-tunggal", icon: <IconVideo />, label: "Video Generator" },
      { href: "/image-generator", icon: <IconImage />, label: "Image Generator" },
      { href: "/ugc-generator", icon: <IconUGC />, label: "UGC Generator" },
    ];

  const renderNavbar = (className, leftContent) => (
    <>
      <nav className={className}>
        <div className="nav-left">
          <img src="/images/nemesisstudio.png" alt="Nemesis Studio" className="nav-logo" />
          {leftContent}
        </div>

        <div className="nav-center">
          {menuItems.filter(item => !item.hideIf).map(item => (
            <Link key={item.href} href={item.href} className={`nav-link ${pathname === item.href ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="credits-display">
            <span className="credit-icon"><IconCredits /></span>
            <span className="credit-amount">{credits.toLocaleString('id-ID')}</span>
          </div>
          <div className="user-menu-container">
            <button
              ref={buttonRef}
              className="user-btn"
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                setIsMobileMenuOpen(false); // Close hamburger when opening user dropdown
              }}
            >
              <span className="nav-icon"><IconUser /></span>
            </button>

            {isDropdownOpen && (
              <div ref={dropdownRef} className="user-dropdown">
                {!isAdmin && (
                  <>
                    {pathname !== "/dashboard" && (
                      <Link href="/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconHome /></span>
                        Dashboard
                      </Link>
                    )}
                    {pathname !== "/profile" && (
                      <Link href="/profile" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconUser /></span>
                        Profile
                      </Link>
                    )}
                    {pathname !== "/credit" && (
                      <Link href="/credit" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconCreditCard /></span>
                        Manage Plan
                      </Link>
                    )}
                  </>
                )}


                {isAdmin && (
                  <>
                    {pathname !== "/admin/dashboard" && (
                      <Link href="/admin/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconAdmin /></span>
                        Admin Dashboard
                      </Link>
                    )}
                    {pathname !== "/admin/users" && (
                      <Link href="/admin/users" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                        <span className="dropdown-icon"><IconUser /></span>
                        Manage Users
                      </Link>
                    )}
                  </>
                )}

                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item logout"
                  onClick={() => {
                    setShowLogoutModal(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <span className="dropdown-icon"><IconLogout /></span>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          {isMobile && (
            <div className="mobile-menu-container" style={{ position: 'relative', marginLeft: '8px' }}>
              <button
                className="mobile-menu-btn"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  setIsDropdownOpen(false); // Close user dropdown when opening hamburger
                }}
                style={{
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#D4AF37',
                }}
              >
                ☰
              </button>

              {isMobileMenuOpen && (
                <div
                  className="mobile-dropdown"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    background: 'rgba(20, 20, 20, 0.98)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    padding: '8px',
                    minWidth: '180px',
                    zIndex: 9999,
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                  }}
                >
                  {menuItems.filter(item => !item.hideIf).map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="dropdown-item"
                      onClick={() => setIsMobileMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 14px',
                        color: pathname === item.href ? '#D4AF37' : '#9A8B4F',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderRadius: '8px',
                        transition: 'background 0.2s',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Render Modal via Portal if mounted */}
      {mounted && showLogoutModal && createPortal(
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Logout Confirmation</h3>
            <p>Are you sure you want to log out of Nemesis Studio?</p>
            <div className="logout-modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
              <button className="btn-confirm" onClick={handleLogout}>Log Out</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );

  if (isAdmin) {
    return renderNavbar("admin-navbar", (
      <div className="nav-brand">
        <h1 className="nav-title">{getPageTitle()}</h1>
      </div>
    ));
  }

  return renderNavbar("app-navbar", (
    <div className="nav-brand">
      <span className="nav-badge">Nemesis Studio</span>
      <h1 className="nav-title">{getPageTitle()}</h1>
    </div>
  ));
}
