"use client";

import { useEffect, useMemo, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";
import {
  IconUser,
  IconSettings,
  IconCreditCard,
  IconChartBar,
  IconMovie,
  IconBolt,
  IconSparkles,
  IconWand,
  IconPhoto,
  IconRocket
} from "@tabler/icons-react";
import "./user-dashboard.css";

const PLAN_LABEL = {
  free: "Free",
  veo_lifetime: "Veo 3.1 — Lifetime",
  veo_sora_unlimited: "Veo 3.1 + Sora 2 — Unlimited",
  monthly: "Monthly",
};

export default function DashboardPage() {
  const [plan, setPlan] = useState("free");
  const [userName, setUserName] = useState("Pengguna FokusAI");
  const [expiryText, setExpiryText] = useState("");
  const [stats, setStats] = useState({
    veoVideo: 0,
    soraVideo: 0,
    veoImage: 0,
    nanoBanana: 0,
    nanoBananaPro: 0,
    imagen4: 0,
  });
  const [now, setNow] = useState("");

  useEffect(() => {
    try {
      document.title = "Dashboard | Fokus AI";
    } catch (_) { }
  }, []);

  useEffect(() => {
    try {
      const m = document.cookie.match(/(?:^|; )plan=([^;]+)/);
      const p = (m && m[1] ? decodeURIComponent(m[1]) : "").toLowerCase();
      setPlan(p || "free");
    } catch (_) { }
    try {
      const u = document.cookie.match(/(?:^|; )username=([^;]+)/);
      const name = u && u[1] ? decodeURIComponent(u[1]) : "";
      setUserName(name || "FokusAI User");
    } catch (_) { }
    try {
      const read = (k) => parseInt(localStorage.getItem(k) || "0", 10) || 0;
      setStats({
        veoVideo: read("stat.veo.video.success"),
        soraVideo: read("stat.sora.video.success"),
        veoImage: read("stat.veo.image.success"),
        nanoBanana: read("stat.image.model.nano-banana"),
        nanoBananaPro: read("stat.image.model.nano-banana-pro"),
        imagen4: read("stat.image.model.imagen-4"),
      });
    } catch (_) { }
    try {
      setNow(new Date().toISOString());
    } catch (_) { }
  }, []);

  useEffect(() => {
    const handler = (e) => {
      try {
        const p = String(e.detail?.plan || "").toLowerCase();
        if (p) setPlan(p);
      } catch (_) { }
    };
    try {
      window.addEventListener("plan-updated", handler);
    } catch (_) { }
    return () => {
      try {
        window.removeEventListener("plan-updated", handler);
      } catch (_) { }
    };
  }, []);

  useEffect(() => {
    let timer = null;
    const updateText = (expMs) => {
      try {
        const now = Date.now();
        const diff = Math.max(0, Number(expMs || 0) - now);
        const d = Math.floor(diff / (24 * 60 * 60 * 1000));
        const h = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const m = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        setExpiryText(
          d > 0
            ? `${d} days left`
            : h > 0
              ? `${h}h ${m}m left`
              : `${m} mins left`
        );
      } catch (_) { }
    };
    const init = async () => {
      try {
        if (plan !== "monthly") {
          setExpiryText("");
          return;
        }
        const ce = document.cookie.match(/(?:^|; )planExpiry=([^;]+)/);
        let exp = ce && ce[1] ? Number(decodeURIComponent(ce[1])) : 0;
        if (!exp || !isFinite(exp)) {
          if (supabase) {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            const token = String(session?.access_token || "");
            if (token) {
              const r = await fetch("/api/me/plan", {
                headers: { Authorization: `Bearer ${token}` },
              });
              const d = await r.json();
              const pe = Number(d?.expiry || 0);
              if (isFinite(pe) && pe > 0) {
                exp = pe;
                document.cookie = `planExpiry=${encodeURIComponent(
                  String(pe)
                )}; path=/; max-age=${60 * 60 * 24 * 30}`;
              }
            }
          }
        }
        updateText(exp);
        timer = setInterval(() => updateText(exp), 60000);
      } catch (_) { }
    };
    init();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [plan]);

  useEffect(() => {
    (async () => {
      try {
        if (!supabase) return;
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/login";
          return;
        }
        const nm = String(session.user.user_metadata?.name || "").trim();
        if (nm) setUserName(nm);
      } catch (_) { }
    })();
  }, []);

  const planText = useMemo(() => PLAN_LABEL[plan] || PLAN_LABEL.free, [plan]);
  const totalVideo = useMemo(() => stats.veoVideo + stats.soraVideo, [stats]);
  const totalImage = useMemo(
    () => stats.nanoBanana + stats.nanoBananaPro + stats.imagen4,
    [stats]
  );
  const totalAll = useMemo(
    () => totalVideo + totalImage,
    [totalVideo, totalImage]
  );
  const fmt = (n) => new Intl.NumberFormat("id-ID").format(n);
  const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);

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
    <div className="app-shell user-dashboard" style={{ padding: 0, minHeight: '100vh', width: '100%', maxWidth: '100%', margin: 0 }}>
      {/* Navbar handled separately or inside if needed */}
      <AppNavbar />

      <main className="user-main">
        <motion.div 
          className="user-grid"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Account Card */}
          <motion.div variants={itemVariants} className="user-card glass-card-gold">
            <div className="user-card-header">
              <h2 className="user-card-title">
                <IconUser size={22} color="#D4AF37" stroke={1.5} /> Account
              </h2>
              <span className="user-card-date" suppressHydrationWarning>
                {now ? new Date(now).toLocaleString("id-ID") : "—"}
              </span>
            </div>
            <div className="user-card-content">
              <div className="user-card-row">
                <span className="user-card-label">Name</span>
                <span className="user-card-value">{userName}</span>
              </div>
              <div className="user-card-row">
                <span className="user-card-label">Active Plan</span>
                <span className="user-card-value">{planText}</span>
              </div>
              {plan === "monthly" && expiryText && (
                <div className="user-card-row">
                  <span className="user-card-label">Expiry Date</span>
                  <span className="user-card-value" style={{ color: '#D4AF37' }}>{expiryText}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px', flexWrap: 'wrap' }}>
              <a
                href="/profile"
                className="btn-secondary-gold hover-lift-gold"
                style={{ padding: '10px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <IconSettings size={18} /> Manage Profile
              </a>
              <a
                href="/credit"
                className="btn-primary-gold hover-lift-gold"
                style={{ padding: '10px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <IconCreditCard size={18} /> Manage Plan
              </a>
            </div>
          </motion.div>

          {/* Stats Card - Expands to fill remaining width */}
          <motion.div variants={itemVariants} className="user-card glass-card-gold" style={{ gridColumn: 'span 1' }}>
            <div className="user-card-header">
              <h2 className="user-card-title">
                <IconChartBar size={22} color="#D4AF37" stroke={1.5} /> Activity Summary
              </h2>
            </div>

            <div className="user-stats-grid">
              {/* Total */}
              <div className="user-stat-card highlight">
                <div className="user-stat-label">Total Generations</div>
                <div className="user-stat-value">{fmt(totalAll)}</div>
                <div className="user-stat-sub">
                  Video {fmt(totalVideo)} · Image {fmt(totalImage)}
                </div>
              </div>

              {/* Veo Video */}
              <div className="user-stat-card">
                <div className="user-stat-label"><IconMovie size={16} color="#bcd0ff" /> Veo Video</div>
                <div className="user-stat-value" style={{ color: '#bcd0ff' }}>{fmt(stats.veoVideo)}</div>
                <div className="user-progress-bar">
                  <div
                    className="user-progress-fill blue"
                    style={{ width: `${pct(stats.veoVideo, Math.max(1, totalVideo))}%` }}
                  />
                </div>
              </div>

              {/* Sora Video */}
              <div className="user-stat-card">
                <div className="user-stat-label"><IconBolt size={16} color="#f59e0b" /> Sora Video</div>
                <div className="user-stat-value" style={{ color: '#f59e0b' }}>{fmt(stats.soraVideo)}</div>
                <div className="user-progress-bar">
                  <div
                    className="user-progress-fill purple"
                    style={{ width: `${pct(stats.soraVideo, Math.max(1, totalVideo))}%` }}
                  />
                </div>
              </div>

              {/* Nano Banana */}
              <div className="user-stat-card">
                <div className="user-stat-label"><IconSparkles size={16} color="#10b981" /> Nano Banana</div>
                <div className="user-stat-value" style={{ color: '#10b981' }}>{fmt(stats.nanoBanana)}</div>
              </div>

              {/* Nano Banana Pro */}
              <div className="user-stat-card">
                <div className="user-stat-label"><IconWand size={16} color="#10b981" /> Nano Banana Pro</div>
                <div className="user-stat-value" style={{ color: '#10b981' }}>{fmt(stats.nanoBananaPro)}</div>
              </div>

              {/* Imagen 4 */}
              <div className="user-stat-card">
                <div className="user-stat-label"><IconPhoto size={16} color="#10b981" /> Imagen 4</div>
                <div className="user-stat-value" style={{ color: '#10b981' }}>{fmt(stats.imagen4)}</div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div variants={itemVariants} className="user-card glass-card-gold" style={{ gridColumn: '1 / -1' }}>
            <div className="user-card-header">
              <h2 className="user-card-title">
                <IconRocket size={22} color="#D4AF37" stroke={1.5} /> Quick Access
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <a
                href="/prompt-tunggal"
                className="user-quick-action-square hover-lift-gold"
              >
                <div className="icon-wrapper" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.2) 0%, rgba(181,142,0,0.1) 100%)', padding: '16px', borderRadius: '16px', display: 'inline-flex', marginBottom: '12px' }}>
                  <IconMovie size={32} color="#D4AF37" stroke={1.5} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#FDFDFD' }}>Video Generator</span>
                <span style={{ fontSize: '13px', color: '#9A8B4F', marginTop: '6px' }}>Create stunning AI videos</span>
              </a>

              <a
                href="/image-generator"
                className="user-quick-action-square hover-lift-gold"
              >
                <div className="icon-wrapper" style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', display: 'inline-flex', marginBottom: '12px' }}>
                  <IconPhoto size={32} color="#E0E0E0" stroke={1.5} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#FDFDFD' }}>Image Generator</span>
                <span style={{ fontSize: '13px', color: '#9A8B4F', marginTop: '6px' }}>Convert ideas into visuals</span>
              </a>

              <a
                href="/prompt-tunggal"
                className="user-quick-action-square hover-lift-gold"
              >
                <div className="icon-wrapper" style={{ background: 'rgba(245,158,11,0.1)', padding: '16px', borderRadius: '16px', display: 'inline-flex', marginBottom: '12px' }}>
                  <IconBolt size={32} color="#f59e0b" stroke={1.5} />
                </div>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#FDFDFD' }}>Sora 2</span>
                <span style={{ fontSize: '13px', color: '#9A8B4F', marginTop: '6px' }}>Access fastest video model</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
