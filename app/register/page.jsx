"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    try {
      document.title = "Register | Nemesis Studio";
    } catch (_) {}
  }, []);

  useLayoutEffect(() => {
    document.body.classList.add("route-login");
    return () => {
      document.body.classList.remove("route-login");
    };
  }, []);

  const REGISTER_LIMIT_KEY = "register.limit";
  const todayStr = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const s = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${s}`;
  };

  const checkRegisterLimit = () => {
    try {
      const MIN_INTERVAL_MS = 60 * 1000;
      const MAX_PER_DAY = 5;
      const now = Date.now();
      let raw = "";
      try {
        raw = localStorage.getItem(REGISTER_LIMIT_KEY) || "";
      } catch (_) {}
      let obj = {};
      try {
        obj = raw ? JSON.parse(raw) : {};
      } catch (_) {
        obj = {};
      }
      const today = todayStr();
      if (!obj || obj.date !== today) {
        obj = { date: today, count: 0, lastTs: 0 };
      }
      const lastTs = Number(obj.lastTs || 0);
      const count = Number(obj.count || 0);
      if (count >= MAX_PER_DAY) {
        setStatus("Percobaan registrasi hari ini sudah mencapai batas.");
        return false;
      }
      if (lastTs && now - lastTs < MIN_INTERVAL_MS) {
        setStatus("Terlalu sering mencoba. Tunggu sebentar.");
        return false;
      }
      const next = { date: today, count: count + 1, lastTs: now };
      try {
        localStorage.setItem(REGISTER_LIMIT_KEY, JSON.stringify(next));
      } catch (_) {}
      return true;
    } catch (_) {
      return true;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim() || !confirm.trim()) {
      setStatus("Isi semua field.");
      return;
    }
    if (password !== confirm) {
      setStatus("Konfirmasi password tidak cocok.");
      return;
    }
    if (!checkRegisterLimit()) return;

    try {
      setBusy(true);
      setStatus("");
      if (!supabase) {
        setStatus("Konfigurasi Supabase belum diset.");
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          emailRedirectTo: "https://nemesisstudio.fun/login",
          data: { name: name.trim(), full_name: name.trim(), plan: "free" },
        },
      });

      if (error) {
        const rawMsg = (error.message || "").toLowerCase();
        if (
          rawMsg.includes("already registered") ||
          rawMsg.includes("already exists") ||
          rawMsg.includes("user already exists")
        ) {
          setStatus("Email Sudah Terdaftar");
        } else {
          setStatus(error.message || "Gagal mendaftar");
        }
        return;
      }

      const identities = data?.user?.identities;
      if (Array.isArray(identities) && identities.length === 0) {
        setStatus("Email Sudah Terdaftar");
        return;
      }

      setStatus("Registrasi berhasil. Silakan login.");
      router.push("/login");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="register-page" style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: '#000',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient glows */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
        top: '-100px',
        left: '-100px',
        filter: 'blur(100px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
        bottom: '-200px',
        right: '-100px',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      {/* Floating gold particles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '20%',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#FFD700',
        animation: 'pulse-glow-gold 3s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '15%',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#D4AF37',
        animation: 'pulse-glow-gold 3s ease-in-out infinite 1s',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '8%',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 215, 0, 0.12)',
        animation: 'float 7s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        animation: 'float 9s ease-in-out infinite 1s',
        zIndex: 0
      }} />

      <div className="register-panel" style={{
        width: '100%',
        maxWidth: '520px',
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '32px',
        padding: '32px 40px',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 215, 0, 0.05)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Corner decorations */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '28px',
          height: '28px',
          borderTop: '2px solid rgba(255, 215, 0, 0.3)',
          borderLeft: '2px solid rgba(255, 215, 0, 0.3)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '28px',
          height: '28px',
          borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
          borderRight: '2px solid rgba(255, 215, 0, 0.3)',
          pointerEvents: 'none'
        }} />
        <a href="/landing" className="register-back" style={{
          position: 'absolute',
          top: '32px',
          left: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-dim)',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'color 0.3s'
        }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Back
        </a>

        <div className="register-brand" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <Image
              src="/images/nemesisstudio.png"
              alt="Nemesis Studio"
              width={34}
              height={34}
              priority
            />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '32px',
            fontWeight: 900,
            margin: '0 0 8px 0',
            letterSpacing: '-0.04em'
          }}>
            <span style={{ color: 'var(--white-pure)' }}>Create </span>
            <span style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFE55C 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Account</span>
          </h1>
          <p className="register-subtitle" style={{
            fontSize: '14px',
            color: 'var(--text-dim)',
            margin: 0
          }}>Start generating with Nemesis Studio today.</p>
        </div>

        <form onSubmit={onSubmit} className="register-form" style={{ display: 'grid', gap: '20px' }}>
          {/* Username Input */}
          <div className="register-input-wrap" style={{ position: 'relative' }}>
            <input
              type="text"
              className="register-input"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px 16px 52px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                color: 'var(--white-pure)',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            />
            <svg style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gold-primary)',
              opacity: 0.8
            }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1c0-3.866 3.582-7 8-7s8 3.134 8 7v1" />
            </svg>
          </div>

          {/* Email Input */}
          <div className="register-input-wrap" style={{ position: 'relative' }}>
            <input
              type="email"
              className="register-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px 16px 52px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                color: 'var(--white-pure)',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            />
            <svg style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gold-primary)',
              opacity: 0.8
            }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="M2 7l10 7 10-7" />
            </svg>
          </div>

          {/* Password Input */}
          <div className="register-input-wrap" style={{ position: 'relative' }}>
            <input
              type={showPwd ? "text" : "password"}
              className="register-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 48px 16px 52px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                color: 'var(--white-pure)',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            />
            <svg style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gold-primary)',
              opacity: 0.8
            }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            <button
              type="button"
              className="register-eye-toggle"
              onClick={() => setShowPwd((v) => !v)}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer'
              }}
            >
              {showPwd ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password Input */}
          <div className="register-input-wrap" style={{ position: 'relative' }}>
            <input
              type={showConfirm ? "text" : "password"}
              className="register-input"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 48px 16px 52px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '14px',
                color: 'var(--white-pure)',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            />
            <svg style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gold-primary)',
              opacity: 0.8
            }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            <button
              type="button"
              className="register-eye-toggle"
              onClick={() => setShowConfirm((v) => !v)}
              style={{
                position: 'absolute',
                right: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer'
              }}
            >
              {showConfirm ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>

          <button type="submit" disabled={busy} style={{
            padding: '16px',
            fontSize: '15px',
            fontWeight: 700,
            borderRadius: '14px',
            width: '100%',
            marginTop: '10px',
            cursor: busy ? 'not-allowed' : 'pointer',
            background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%)',
            color: '#000',
            border: 'none',
            fontFamily: 'var(--font-heading)',
            letterSpacing: '0.02em',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(255, 215, 0, 0.25)',
            opacity: busy ? 0.7 : 1
          }}>
            {busy ? "Creating Account..." : "Sign Up"}
          </button>

          <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-dim)', marginTop: '8px' }}>
            Already have an account? <a href="/login" style={{ color: 'var(--white-pure)', textDecoration: 'none', fontWeight: 700 }}>Sign in</a>
          </div>

          {status && (
            <div style={{
              padding: '12px',
              borderRadius: '10px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              color: 'var(--gold-primary)',
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '10px'
            }}>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
