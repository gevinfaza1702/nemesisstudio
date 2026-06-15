"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    try {
      document.title = "Login | Nemesis Studio";
    } catch (_) {}
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setStatus("Isi email dan password.");
      return;
    }
    try {
      setBusy(true);
      setStatus("Mencoba masuk...");
      if (!supabase) {
        setStatus("Konfigurasi Supabase belum diset.");
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });
      if (error) {
        setStatus(error.message || "Gagal login");
        return;
      }
      setStatus("Berhasil login.");
      let dest = "/dashboard";
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = String(sessionData?.session?.access_token || "");
        let plan = "";
        if (token) {
          try {
            await fetch("/api/session/establish", {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (_) {}
          try {
            const resp = await fetch("/api/me/plan", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const pdata = await resp.json();
            plan = String(pdata?.plan || "").toLowerCase();
            const pe = pdata?.expiry;
            try {
              if (
                plan === "monthly" &&
                (typeof pe === "number" || typeof pe === "string")
              ) {
                const n = Number(pe);
                if (isFinite(n) && n > 0)
                  document.cookie = `planExpiry=${encodeURIComponent(
                    String(n)
                  )}; path=/; max-age=${60 * 60 * 24 * 30}`;
              } else {
                document.cookie = "planExpiry=; path=/; max-age=0";
              }
            } catch (_) {}
          } catch (_) {}
        }
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const uname = String(user?.user_metadata?.name || "").trim();
        if (!plan)
          plan = String(user?.user_metadata?.plan || "free").toLowerCase();
        if (plan === "admin") {
          try {
            await supabase.auth.signOut();
          } catch (_) {}
          try {
            await fetch("/api/session/logout", { method: "POST" });
          } catch (_) {}
          setStatus("Akun admin. Gunakan halaman Admin Login.");
          try {
            router.push("/admin/login");
          } catch (_) {
            window.location.href = "/admin/login";
          }
          return;
        }
        try {
          document.cookie = `plan=${encodeURIComponent(
            plan
          )}; path=/; max-age=${60 * 60 * 24 * 30}`;
        } catch (_) {}
        try {
          if (uname) {
            document.cookie = `username=${encodeURIComponent(
              uname
            )}; path=/; max-age=${60 * 60 * 24 * 30}`;
            document.cookie = `name=${encodeURIComponent(
              uname
            )}; path=/; max-age=${60 * 60 * 24 * 30}`;
          }
        } catch (_) {}
        try {
          const uid = String(user?.id || "");
          const email = String(user?.email || "");
          if (uid)
            document.cookie = `uid=${encodeURIComponent(
              uid
            )}; path=/; max-age=${60 * 60 * 24 * 30}`;
          if (email)
            document.cookie = `email=${encodeURIComponent(
              email
            )}; path=/; max-age=${60 * 60 * 24 * 30}`;
        } catch (_) {}
        dest = "/dashboard";
      } catch (_) {}
      try {
        document.cookie = `sessionExpiry=1; path=/; max-age=${60 * 60 * 5}`;
      } catch (_) {}
      try {
        router.push(dest);
      } catch (_) {
        try {
          window.location.href = dest;
        } catch (_) {}
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page" style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
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
        top: '-200px',
        right: '-100px',
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
        bottom: '-100px',
        left: '-100px',
        filter: 'blur(80px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      
      {/* Floating gold particles */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#FFD700',
        animation: 'pulse-glow-gold 3s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '70%',
        right: '15%',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#D4AF37',
        animation: 'pulse-glow-gold 3s ease-in-out infinite 1s',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 215, 0, 0.15)',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: '25%',
        right: '25%',
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        animation: 'float 8s ease-in-out infinite 2s',
        zIndex: 0
      }} />

      <div className="login-panel" style={{
        width: '100%',
        maxWidth: '480px',
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
          width: '32px',
          height: '32px',
          borderTop: '2px solid rgba(255, 215, 0, 0.3)',
          borderLeft: '2px solid rgba(255, 215, 0, 0.3)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          width: '32px',
          height: '32px',
          borderBottom: '2px solid rgba(255, 215, 0, 0.3)',
          borderRight: '2px solid rgba(255, 215, 0, 0.3)',
          pointerEvents: 'none'
        }} />
        <a href="/landing" className="login-back" style={{
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

        <div className="login-brand" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <Image
              src="/images/nemesisstudio.png"
              alt="Nemesis Studio"
              width={40}
              height={40}
              priority
            />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '36px',
            fontWeight: 900,
            margin: '0 0 8px 0',
            letterSpacing: '-0.04em'
          }}>
            <span style={{ color: 'var(--white-pure)' }}>Welcome </span>
            <span style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFE55C 50%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent'
            }}>Back</span>
          </h1>
          <p className="login-subtitle" style={{
            fontSize: '15px',
            color: 'var(--text-dim)',
            margin: 0
          }}>Sign in to continue your creative journey.</p>
        </div>

        <form onSubmit={onSubmit} className="login-form" style={{ display: 'grid', gap: '24px' }}>
          {/* Email Input */}
          <div className="login-input-wrap" style={{ position: 'relative' }}>
            <input
              type="email"
              className="login-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 24px 18px 56px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                color: 'var(--white-pure)',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            />
            <svg style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gold-primary)',
              opacity: 0.8
            }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="M2 7l10 7 10-7" />
            </svg>
          </div>

          {/* Password Input */}
          <div className="login-input-wrap" style={{ position: 'relative' }}>
            <input
              type={showPwd ? "text" : "password"}
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 56px 18px 56px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                color: 'var(--white-pure)',
                fontSize: '15px',
                transition: 'all 0.3s'
              }}
            />
            <svg style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--gold-primary)',
              opacity: 0.8
            }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 018 0v4" />
            </svg>
            <button
              type="button"
              className="login-eye-toggle"
              onClick={() => setShowPwd((v) => !v)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer'
              }}
            >
              {showPwd ? (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>

          <div style={{ textAlign: 'right', marginTop: '-12px' }}>
            <a href="#" style={{ fontSize: '13px', color: 'var(--gold-primary)', textDecoration: 'none', fontWeight: 600 }}>Forgot password?</a>
          </div>

          <button type="submit" disabled={busy} style={{
            padding: '18px',
            fontSize: '16px',
            fontWeight: 700,
            borderRadius: '16px',
            width: '100%',
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
            {busy ? "Processing..." : "Sign In"}
          </button>

          <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-dim)', marginTop: '8px' }}>
            Don't have an account? <a href="/register" style={{ color: 'var(--white-pure)', textDecoration: 'none', fontWeight: 700 }}>Sign up</a>
          </div>

          {status && (
            <div style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'rgba(212, 175, 55, 0.05)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              color: 'var(--gold-primary)',
              fontSize: '13px',
              textAlign: 'center',
              marginTop: '12px'
            }}>
              {status}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
