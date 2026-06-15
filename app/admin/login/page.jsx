"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "./admin-login.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    try {
      document.title = "Admin Login | Nemesis Studio";
    } catch (_) {}
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session) {
          const token = String(session.access_token || "");
          const resp = await fetch("/api/me/plan", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await resp.json();
          const plan = String(data?.plan || "").toLowerCase();
          if (plan === "admin") {
            router.push("/admin/dashboard");
            return;
          }
        }
      } catch (_) {}
    })();
  }, [router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setStatus("");
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setStatus(error.message || "Gagal login");
        return;
      }
      let plan = "";
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = String(session?.access_token || "");
        if (token) {
          const resp = await fetch("/api/me/plan", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const d = await resp.json();
          plan = String(d?.plan || "").toLowerCase();
        }
      } catch (_) {}
      if (plan !== "admin") {
        setStatus("Akun bukan admin.");
        try {
          await supabase.auth.signOut();
        } catch (_) {}
        return;
      }
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = String(session?.access_token || "");
        if (token) {
          await fetch("/api/session/establish", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      } catch (_) {}
      try {
        document.cookie = `plan=admin; path=/; max-age=${60 * 60 * 24 * 30}`;
      } catch (_) {}
      try {
        document.cookie = `sessionExpiry=1; path=/; max-age=${60 * 60 * 5}`;
      } catch (_) {}
      try {
        router.push("/admin/dashboard");
      } catch (_) {
        window.location.href = "/admin/dashboard";
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Brand */}
        <div className="admin-login-brand">
          <Image
            src="/images/nemesisstudio.png"
            alt="Nemesis Studio"
            className="admin-login-logo"
            width={56}
            height={56}
            priority
          />
          <span className="admin-login-badge">Admin Panel</span>
        </div>

        {/* Title */}
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-subtitle">Masuk untuk mengelola sistem.</p>

        {/* Form */}
        <form onSubmit={onSubmit} className="admin-login-form">
          {/* Email Input */}
          <div>
            <label className="admin-login-label">Email</label>
            <div className="admin-login-input-wrap">
              <svg className="admin-login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="3" />
                <path d="M2 7l10 7 10-7" />
              </svg>
              <input
                type="email"
                className="admin-login-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="admin-login-label">Password</label>
            <div className="admin-login-input-wrap">
              <svg className="admin-login-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="11" width="14" height="10" rx="2" />
                <path d="M8 11V7a4 4 0 018 0v4" />
              </svg>
              <input
                type={showPwd ? "text" : "password"}
                className="admin-login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: '48px' }}
              />
              <button
                type="button"
                className="admin-login-eye-toggle"
                onClick={() => setShowPwd((v) => !v)}
              >
                {showPwd ? (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button className="admin-login-submit" type="submit" disabled={busy}>
            {busy ? "Memproses..." : "Masuk ke Admin"}
          </button>

          {/* Status Message */}
          {status && <div className="admin-login-status">{status}</div>}
        </form>

        {/* Back Link */}
        <a href="/landing" className="admin-login-back">
          ← Kembali ke halaman utama
        </a>
      </div>
    </div>
  );
}
