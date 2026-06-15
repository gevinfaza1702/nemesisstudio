"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  IconUser,
  IconLayoutDashboard,
  IconUsers,
  IconLogout,
  IconCreditCard,
  IconMovie,
  IconBolt,
  IconCrown,
  IconMenu2,
  IconPhoto,
  IconRocket
} from "@tabler/icons-react";
import "./admin-dashboard.css";

export default function AdminDashboardPage() {
  const [plan, setPlan] = useState("admin");
  const [userName, setUserName] = useState("Admin");
  const [now, setNow] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [soraCredits, setSoraCredits] = useState(0);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditStatus, setCreditStatus] = useState("");
  const [creditBusy, setCreditBusy] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySmall, setIsVerySmall] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      document.title = "Admin Dashboard | Nemesis Studio";
    } catch (_) { }

    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsVerySmall(window.innerWidth < 500);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/login";
          return;
        }
        const nm = String(session.user.user_metadata?.name || "").trim();
        if (nm) setUserName(nm);
        try {
          const token = String(session.access_token || "");
          if (token) {
            const r = await fetch("/api/admin/credits", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const d = await r.json();
            const n = Number(d?.credits?.sora2 || 0);
            if (Number.isFinite(n)) setSoraCredits(n);
          }
        } catch (_) { }
        try {
          const m = document.cookie.match(/(?:^|; )plan=([^;]+)/);
          const p = (m && m[1] ? decodeURIComponent(m[1]) : "").toLowerCase();
          setPlan(p || "admin");
          if (p !== "admin") window.location.href = "/dashboard";
        } catch (_) { }
      } catch (_) { }
    })();
    try {
      setNow(new Date().toISOString());
    } catch (_) { }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setShowLogoutModal(false);
        setShowCreditModal(false);
      }
    };
    if (showLogoutModal || showCreditModal) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showLogoutModal, showCreditModal]);

  const handleLogout = async () => {
    try {
      if (supabase) await supabase.auth.signOut();
    } catch { }
    try {
      await fetch("/api/session/logout", { method: "POST" });
    } catch (_) { }
    try {
      document.cookie = "plan=; path=/; max-age=0";
      document.cookie = "uid=; path=/; max-age=0";
      document.cookie = "email=; path=/; max-age=0";
      document.cookie = "name=; path=/; max-age=0";
      document.cookie = "username=; path=/; max-age=0";
    } catch (_) { }
    window.location.href = "/login";
  };

  const handleAddCredits = async () => {
    try {
      setCreditBusy(true);
      setCreditStatus("Memproses...");
      const amt = Number(creditAmount || 0);
      if (!Number.isFinite(amt)) {
        setCreditStatus("Jumlah tidak valid");
        setCreditBusy(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      const token = String(session?.access_token || "");
      const resp = await fetch("/api/admin/credits/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: amt }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setCreditStatus(String(data?.error || "Gagal"));
        setCreditBusy(false);
        return;
      }
      const n = Number(data?.credits?.sora2 || 0);
      setSoraCredits(Number.isFinite(n) ? n : 0);
      setCreditStatus("Berhasil ditambahkan");
      setCreditAmount("");
    } catch (e) {
      setCreditStatus(String(e?.message || e || ""));
    } finally {
      setCreditBusy(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="app-shell admin-dashboard" style={{ padding: 0, minHeight: '100vh', width: '100%', maxWidth: '100%', margin: 0 }}>
      {/* Navbar */}
      <nav className="admin-navbar" style={isVerySmall ? { flexDirection: 'column', padding: '10px 12px' } : {}}>
        {/* Row 1 for very small screens: Brand + Profile */}
        {isVerySmall ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '10px'
            }}>
              {/* Brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image
                  src="/images/nemesisstudio.png"
                  alt="Nemesis Studio"
                  className="admin-navbar-logo"
                  width={36}
                  height={36}
                  priority
                />
                <h1 className="admin-navbar-title" style={{ fontSize: '12px', margin: 0 }}>
                  Admin Dashboard
                  <span className="admin-navbar-badge" style={{ fontSize: '8px', padding: '2px 5px', marginLeft: '4px' }}>Admin</span>
                </h1>
              </div>

              {/* Profile button */}
              <div className="admin-navbar-user" ref={userMenuRef}>
                <button
                  className="admin-navbar-user-btn"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowMobileMenu(false);
                  }}
                  style={{ padding: '6px 8px' }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1c0-3.866 3.582-7 8-7s8 3.134 8 7v1" />
                  </svg>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div className={`admin-navbar-dropdown ${showUserMenu ? 'show' : ''}`}>
                  <div style={{
                    padding: '10px 12px',
                    color: '#D4AF37',
                    fontSize: '13px',
                    fontWeight: 600,
                    borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <IconUser size={16} /> {userName}
                  </div>
                  {pathname !== "/admin/dashboard" && (
                    <a href="/admin/dashboard" className="admin-navbar-dropdown-item">
                      <IconLayoutDashboard size={18} /> Dashboard
                    </a>
                  )}
                  <a href="/admin/users" className="admin-navbar-dropdown-item">
                    <IconUsers size={18} /> Manage Users
                  </a>
                  <div className="admin-navbar-dropdown-divider" />
                  <button
                    className="admin-navbar-dropdown-item"
                    onClick={() => {
                      setShowLogoutModal(true);
                      setShowUserMenu(false);
                    }}
                  >
                    <IconLogout size={18} /> Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Row 2: Hamburger left, Credits right */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%'
            }}>
              {/* Hamburger */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    setShowUserMenu(false);
                  }}
                  style={{
                    width: '34px',
                    height: '34px',
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
                  <IconMenu2 size={20} />
                </button>

                {showMobileMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
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
                    <a href="/prompt-tunggal" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#9A8B4F', textDecoration: 'none', fontSize: '13px', borderRadius: '8px' }}>
                      <IconMovie size={16} /> Video Generator
                    </a>
                    <a href="/image-generator" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#9A8B4F', textDecoration: 'none', fontSize: '13px', borderRadius: '8px' }}>
                      <IconPhoto size={16} /> Image
                    </a>
                    <a href="/prompt-tunggal" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#9A8B4F', textDecoration: 'none', fontSize: '13px', borderRadius: '8px' }}>
                      <IconBolt size={16} /> Sora 2
                    </a>
                  </div>

                )}
              </div>

              {/* Credits - far right */}
              <button
                className="admin-navbar-credit"
                onClick={() => setShowCreditModal(true)}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                <IconCreditCard size={16} /> {new Intl.NumberFormat("id-ID").format(soraCredits)}
              </button>
            </div>
          </>
        ) : (
          /* Original layout for screens >= 500px */
          <>
            <div className="admin-navbar-brand">
              <Image
                src="/images/nemesisstudio.png"
                alt="Nemesis Studio"
                className="admin-navbar-logo"
                width={44}
                height={44}
                priority
              />
              <h1 className="admin-navbar-title">
                Admin Dashboard
                <span className="admin-navbar-badge">Admin</span>
              </h1>
            </div>

            {/* Nav Links - HIDDEN ON MOBILE */}
            {!isMobile && (
              <div className="admin-navbar-links">
                <a href="/prompt-tunggal" className="admin-navbar-link">
                  <IconMovie size={18} />
                  Video Generator
                </a>
                <a href="/image-generator" className="admin-navbar-link">
                  <IconPhoto size={18} />
                  Image
                </a>
                <a href="/prompt-tunggal" className="admin-navbar-link">
                  <IconBolt size={18} />
                  Sora 2
                </a>
              </div>

            )}

            {/* Actions */}
            <div className="admin-navbar-actions" ref={userMenuRef}>
              {/* Mobile Hamburger Menu - LEFT SIDE */}
              {isMobile && (
                <div style={{ position: 'relative', marginRight: '8px' }}>
                  <button
                    onClick={() => {
                      setShowMobileMenu(!showMobileMenu);
                      setShowUserMenu(false);
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
                      fontSize: '20px',
                      color: '#D4AF37',
                    }}
                  >
                    <IconMenu2 size={24} />
                  </button>

                  {showMobileMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        marginTop: '8px',
                        background: 'rgba(20, 20, 20, 0.98)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        padding: '8px',
                        minWidth: '200px',
                        zIndex: 9999,
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <a href="/prompt-tunggal" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', color: '#9A8B4F', textDecoration: 'none', fontSize: '14px', borderRadius: '8px' }}>
                        <IconMovie size={18} /> Video Generator
                      </a>
                      <a href="/image-generator" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', color: '#9A8B4F', textDecoration: 'none', fontSize: '14px', borderRadius: '8px' }}>
                        <IconPhoto size={18} /> Image
                      </a>
                      <a href="/prompt-tunggal" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', color: '#9A8B4F', textDecoration: 'none', fontSize: '14px', borderRadius: '8px' }}>
                        <IconBolt size={18} /> Sora 2
                      </a>
                    </div>

                  )}
                </div>
              )}

              <div className="admin-navbar-user">
                <button
                  className="admin-navbar-user-btn"
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowMobileMenu(false);
                  }}
                  style={isMobile ? { padding: '8px 10px' } : {}}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1c0-3.866 3.582-7 8-7s8 3.134 8 7v1" />
                  </svg>
                  {!isMobile && userName}
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div className={`admin-navbar-dropdown ${showUserMenu ? 'show' : ''}`}>
                  {isMobile && (
                    <div style={{
                      padding: '12px 14px',
                      color: '#D4AF37',
                      fontSize: '14px',
                      fontWeight: 600,
                      borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                      marginBottom: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}>
                      <IconUser size={18} /> {userName}
                    </div>
                  )}
                  {pathname !== "/admin/dashboard" && (
                    <a href="/admin/dashboard" className="admin-navbar-dropdown-item">
                      <IconLayoutDashboard size={18} /> Dashboard
                    </a>
                  )}
                  <a href="/admin/users" className="admin-navbar-dropdown-item">
                    <IconUsers size={18} /> Manage Users
                  </a>
                  <div className="admin-navbar-dropdown-divider" />
                  <button
                    className="admin-navbar-dropdown-item"
                    onClick={() => {
                      setShowLogoutModal(true);
                      setShowUserMenu(false);
                    }}
                  >
                    <IconLogout size={18} /> Logout
                  </button>
                </div>
              </div>

              <button
                className="admin-navbar-credit"
                onClick={() => setShowCreditModal(true)}
              >
                <IconCreditCard size={18} /> {new Intl.NumberFormat("id-ID").format(soraCredits)}
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Main Content */}
      <main className="admin-main">
        <motion.div 
          className="admin-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Account Card */}
          <motion.div variants={itemVariants} className="admin-card glass-card-gold">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <IconCrown size={22} color="#D4AF37" stroke={1.5} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Akun Admin
              </h2>
              <span className="admin-card-date" suppressHydrationWarning>
                {now ? new Date(now).toLocaleString("id-ID") : "—"}
              </span>
            </div>
            <div className="admin-card-content">
              <div className="admin-card-row">
                <span className="admin-card-label">Nama</span>
                <span className="admin-card-value">{userName}</span>
              </div>
              <div className="admin-card-row">
                <span className="admin-card-label">Peran</span>
                <span className="admin-card-value">Admin</span>
              </div>
              <div className="admin-card-row">
                <span className="admin-card-label">Sora Credits</span>
                <span className="admin-card-value">{new Intl.NumberFormat("id-ID").format(soraCredits)}</span>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <a href="/admin/users" className="admin-btn-primary-gold hover-lift-gold" style={{ padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 10 }}>
                <IconUsers size={18} /> Kelola Users
              </a>
            </div>
          </motion.div>

          {/* System Summary Card */}
          <motion.div variants={itemVariants} className="admin-card glass-card-gold">
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <IconLayoutDashboard size={22} color="#D4AF37" stroke={1.5} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Status Sistem
              </h2>
            </div>
            <div className="admin-card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gold-muted)', fontSize: '14px' }}>Server Status</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="status-pulse-green" />
                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: '14px' }}>Operational</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gold-muted)', fontSize: '14px' }}>Database</span>
                  <span style={{ color: '#FDFDFD', fontWeight: 600, fontSize: '14px' }}>Connected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gold-muted)', fontSize: '14px' }}>API Gateway</span>
                  <span style={{ color: '#FDFDFD', fontWeight: 600, fontSize: '14px' }}>Ready</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Admin Navigation Card */}
          <motion.div variants={itemVariants} className="admin-card glass-card-gold" style={{ gridColumn: '1 / -1' }}>
            <div className="admin-card-header">
              <h2 className="admin-card-title">
                <IconRocket size={22} color="#D4AF37" stroke={1.5} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Navigasi Admin
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <a href="/admin/users" className="admin-quick-action-square hover-lift-gold">
                <div className="icon-wrapper" style={{ background: 'rgba(212, 175, 55, 0.1)', padding: '16px', borderRadius: '16px', marginBottom: '12px' }}>
                  <IconUsers size={32} color="#D4AF37" stroke={1.5} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#FDFDFD' }}>Kelola User</span>
                <span style={{ fontSize: '13px', color: 'var(--gold-muted)', marginTop: '4px' }}>Update status & paket user</span>
              </a>
              
              <a href="/prompt-tunggal" className="admin-quick-action-square hover-lift-gold">
                <div className="icon-wrapper" style={{ background: 'rgba(188, 208, 255, 0.1)', padding: '16px', borderRadius: '16px', marginBottom: '12px' }}>
                  <IconMovie size={32} color="#bcd0ff" stroke={1.5} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#FDFDFD' }}>Video Generator</span>
                <span style={{ fontSize: '13px', color: 'var(--gold-muted)', marginTop: '4px' }}>Input prompt AI secara massal</span>
              </a>

              <a href="/image-generator" className="admin-quick-action-square hover-lift-gold">
                <div className="icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '16px', marginBottom: '12px' }}>
                  <IconPhoto size={32} color="#10b981" stroke={1.5} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#FDFDFD' }}>Image Tools</span>
                <span style={{ fontSize: '13px', color: 'var(--gold-muted)', marginTop: '4px' }}>Pantau output gambar sistem</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowLogoutModal(false)}
        >
          <div className="admin-modal">
            <h3 className="admin-modal-title">Konfirmasi Logout</h3>
            <p className="admin-modal-text">
              Apakah Anda yakin ingin logout? Sesi Anda akan diakhiri.
            </p>
            <div className="admin-modal-actions">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleLogout}
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credit Modal */}
      {showCreditModal && (
        <div
          className="admin-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowCreditModal(false)}
        >
          <div className="admin-modal">
            <h3 className="admin-modal-title">Tambah Credits Sora 2</h3>
            <p className="admin-modal-text">
              Saldo saat ini: {new Intl.NumberFormat("id-ID").format(soraCredits)}
            </p>
            <input
              type="number"
              className="admin-modal-input"
              placeholder="Masukkan jumlah credit"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
            />
            {creditStatus && (
              <p style={{ color: 'var(--gold-muted)', fontSize: 13, margin: '0 0 16px' }}>
                {creditStatus}
              </p>
            )}
            <div className="admin-modal-actions">
              <button
                className="admin-btn admin-btn-ghost"
                onClick={() => setShowCreditModal(false)}
              >
                Batal
              </button>
              <button
                className="admin-btn admin-btn-primary"
                disabled={creditBusy}
                onClick={handleAddCredits}
              >
                {creditBusy ? "Memproses..." : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
