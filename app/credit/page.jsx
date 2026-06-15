"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  IconCheck, 
  IconX, 
  IconCrown, 
  IconDiamond, 
  IconCreditCard, 
  IconStarFilled 
} from "@tabler/icons-react";
import AppNavbar from "../components/AppNavbar";

export default function LanggananPage() {
  const [isFree, setIsFree] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [plan, setPlan] = useState("free");
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    try {
      document.title = "Langganan | Nemesis Studio";
    } catch (_) {}
  }, []);

  const refreshCredits = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = String(session?.access_token || "");
      if (!token) return;
      const rMe = await fetch("/api/me/credits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dM = await rMe.json();
      if (rMe.ok) {
        setCredits(Number(dM?.credits || 0));
      }
    } catch (_) {}
  };
  
  useEffect(() => {
    refreshCredits();
  }, []);
  
  useEffect(() => {
    if (plan === "veo_sora_unlimited") refreshCredits();
  }, [plan]);

  useEffect(() => {
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/login";
          return;
        }
      } catch (_) {}
    })();
    try {
      const m = document.cookie.match(/(?:^|; )plan=([^;]+)/);
      const p = (m && m[1] ? decodeURIComponent(m[1]) : "").toLowerCase();
      setIsFree(p === "free");
      setPlan(p || "free");
    } catch (_) {}
  }, []);

  // Realtime sinkron plan dari PlanSync (SSE)
  useEffect(() => {
    const handler = (e) => {
      try {
        const p = String(e.detail?.plan || "").toLowerCase();
        if (!p) return;
        setPlan(p);
        setIsFree(p === "free");
      } catch (_) {}
    };
    try {
      window.addEventListener("plan-updated", handler);
    } catch (_) {}
    return () => {
      try {
        window.removeEventListener("plan-updated", handler);
      } catch (_) {}
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowLogoutModal(false);
    };
    if (showLogoutModal) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showLogoutModal]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="app-shell" style={{ padding: 0, minHeight: '100vh', width: '100%', maxWidth: '100%', margin: 0 }}>
      <AppNavbar />

      <div style={{ padding: '0 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
        className="card" 
        style={{ padding: 28, gap: 24, marginTop: 24 }}
      >
        {/* Current Plan Overview Hero */}
        <motion.div variants={itemVariants} className={`feature-card glass-card-gold ${plan === 'veo_sora_unlimited' ? 'neon-border-gold glow-gold' : ''}`} style={{ gap: 16, padding: '24px 32px', position: 'relative', overflow: 'hidden' }}>
          {plan === 'veo_sora_unlimited' && (
            <div className="mesh-glow" style={{ opacity: 0.15, pointerEvents: 'none' }} />
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, zIndex: 1, position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div className="feature-title" style={{ fontSize: 14, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Current Subscription Status
              </div>
              <div className="page-title" style={{ fontSize: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
                {plan === "free" ? "Free (Trial)" 
               : plan === "veo_lifetime" ? "Veo 3.1 Lifetime"
               : plan === "veo_sora_unlimited" ? <><IconCrown size={28} color="#FFD700" fill="#FFD700" stroke={1} /> Veo & Sora Unlimited</>
               : "Monthly Subscription"}
              </div>
              <div className="feature-sub" style={{ fontSize: 15, marginTop: 4 }}>
                {plan === "free"
                  ? "You are currently on the initial free trial plan."
                  : plan === "veo_lifetime"
                  ? "Lifetime premium access. Create without limits."
                  : plan === "veo_sora_unlimited"
                  ? "Thank you! You have the highest level of access in Nemesis Studio."
                  : "Flexible premium access. Renewals are securely managed."}
              </div>
            </div>
            
            {plan === "veo_sora_unlimited" && (
              <div style={{ padding: '16px 24px', background: 'rgba(0,0,0,0.4)', borderRadius: 16, border: '1px solid rgba(212,175,55,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#9A8B4F', textTransform: 'uppercase', fontWeight: 600 }}>Available Sora Credits</span>
                <div style={{ fontSize: 24, fontWeight: 800, background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconDiamond size={20} color="#FFD700" />
                  {new Intl.NumberFormat("id-ID").format(credits)}
                </div>
              </div>
            )}
            
          </div>
        </motion.div>

        {/* Pricing Selection Grid */}
        {plan !== "veo_sora_unlimited" && (
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 16 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#FDFDFD', display: 'flex', alignItems: 'center', gap: 8 }}>
              <IconStarFilled size={18} color="#D4AF37" /> Upgrade Your Access
            </h3>
            <div
              className="features-grid"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: 20
              }}
            >
              {(() => {
                const pk = {
                  lifetime: {
                    title: "Veo 3.1 — Lifetime",
                    price: "Rp 300.000",
                    sub: "Pay once, unlimited video generation access forever.",
                    features: [
                      "Full Dashboard Access",
                      "Generate Video (Unlimited)",
                      "Generate Image (Unlimited)",
                      "Generate Music (Unlimited)",
                      "Exclusive Veo 3.1 Model",
                    ],
                    exclude: ["Sora 2 Beta Access"],
                    href: "https://lynk.id/fokusai17",
                    ctaClass: "btn-secondary-gold",
                  },
                  unlimited: {
                    title: "Veo + Sora — Unlimited",
                    price: "Rp 370.000",
                    sub: "The highest tier package. Full access to all our latest AI.",
                    features: [
                      "Full Dashboard Access",
                      "Generate Video (Unlimited)",
                      "Generate Image (Unlimited)",
                      "Generate Music (Unlimited)",
                      "Exclusive Veo 3.1 Model",
                      "Priority Sora 2 Servers",
                    ],
                    exclude: [],
                    href: "https://lynk.id/fokusai17",
                    ctaClass: "btn-primary-gold",
                  },
                  monthly: {
                    title: "Monthly Access",
                    price: "Rp 70.000",
                    sub: "Try our features with flexible month-to-month subscription.",
                    features: [
                      "Premium UI Access",
                      "Limited Video Generation",
                      "Limited Image Generation",
                      "Limited Music Generation",
                      "Veo 3.1 & Sora 2 Models",
                    ],
                    exclude: ["Unlimited Generations"],
                    href: "https://lynk.id/fokusai17",
                    ctaClass: "btn-secondary-gold",
                  },
                };
                
                const visible =
                  plan === "free"
                    ? ["lifetime", "unlimited", "monthly"]
                    : plan === "veo_lifetime"
                    ? ["unlimited"]
                    : plan === "monthly"
                    ? ["unlimited", "lifetime"]
                    : [];
                
                return visible.map((key) => {
                  const v = pk[key];
                  const isTopTier = key === 'unlimited';
                  return (
                    <div 
                      key={key} 
                      className={`feature-card ${isTopTier ? 'glass-card-gold neon-border-gold' : ''}`} 
                      style={{ 
                        gap: 16, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        padding: 32, 
                        position: 'relative',
                        transform: 'translateZ(0)',
                        overflow: 'hidden'
                      }}
                    >
                      {isTopTier && <div className="shimmer" style={{position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.1), transparent)', animation: 'shimmer 4s infinite'}} />}
                      
                      {isTopTier && <div style={{ position: 'absolute', top: 12, right: 12, background: 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)', color: '#000', padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Best Value</div>}
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div className="feature-title" style={{ fontSize: 18, color: isTopTier ? '#FFD700' : '#E2E8F0' }}>
                          {v.title}
                        </div>
                        <div className="feature-title" style={{ fontSize: 36, letterSpacing: '-0.02em', background: isTopTier ? 'linear-gradient(135deg, #FFD700 0%, #D4AF37 100%)' : '#FFF', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          {v.price}
                        </div>
                        <div className="feature-sub" style={{ fontSize: 14, minHeight: 42 }}>
                          {v.sub}
                        </div>
                      </div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16, flex: 1 }}>
                        {v.features.map((text) => (
                          <div
                            key={text}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              color: "#FDFDFD",
                              fontSize: 14
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.15)', color: '#FFD700' }}>
                              <IconCheck size={14} stroke={3} />
                            </div>
                            <span style={{opacity: 0.9}}>{text}</span>
                          </div>
                        ))}
                        {v.exclude.map((text) => (
                          <div
                            key={text}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              color: "#94a3b8",
                              fontSize: 14
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', color: '#64748b' }}>
                              <IconX size={14} stroke={3} />
                            </div>
                            <span>{text}</span>
                          </div>
                        ))}
                      </div>
                      
                      <a
                        href={v.href}
                        className={v.ctaClass}
                        style={{ marginTop: 24, width: '100%', textAlign: 'center', display: 'block' }}
                      >
                        Select Plan
                      </a>
                    </div>
                  );
                });
              })()}
            </div>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="feature-card glass-gold" style={{ gap: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: 8, background: 'rgba(212, 175, 55, 0.1)', borderRadius: 10 }}>
               <IconCreditCard size={20} color="#FFD700" />
            </div>
            <div className="feature-title" style={{ fontSize: 18, color: '#D4AF37' }}>
              Extra Add-ons & Sora Credits
            </div>
          </div>
          
          <div
            className="feature-sub"
            style={{ fontSize: 15 }}
          >
            Need higher-priority server video generation quota? Top up your Sora 2 credit balance anytime so the creation process never stops.
          </div>
          
          {plan === "veo_sora_unlimited" && (
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <a
                href="https://lynk.id/fokusai17/j4qmne076wok"
                className="btn-secondary-gold hover-lift-gold"
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '12px 24px', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <IconDiamond size={16} /> Top Up Access Credit
              </a>
            </div>
          )}
        </motion.div>
      </motion.div>

      {showLogoutModal && (
        <div
          className="modal show"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
          style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-content glass-card-gold" style={{ maxWidth: 420 }}>
            <div className="modal-header" style={{ borderBottomColor: "rgba(212,175,55,0.15)" }}>
              <div style={{ fontWeight: 700, color: "#D4AF37", display: "flex", alignItems: "center", gap: 8 }}>
                <IconLogout size={20} /> Logout Confirmation
              </div>
              <button
                className="btn ghost"
                style={{color: "#9A8B4F"}}
                onClick={() => setShowLogoutModal(false)}
              >
                Close
              </button>
            </div>
            <div
              className="modal-body"
              style={{ flexDirection: "column", gap: 12, padding: "24px 20px" }}
            >
              <div style={{ color: "#FDFDFD", fontWeight: 600, fontSize: 16 }}>
                Are you sure you want to log out?
              </div>
              <div style={{ color: "#9A8B4F", fontSize: 14, lineHeight: 1.6 }}>
                This active session will be securely terminated and you will be returned to the main entrance.
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ justifyContent: "flex-end", gap: 12, borderTopColor: "rgba(212,175,55,0.15)", padding: "16px 20px" }}
            >
              <button
                className="btn-secondary-gold"
                style={{ padding: '10px 20px', fontSize: 14 }}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary-gold"
                style={{ padding: '10px 20px', fontSize: 14 }}
                onClick={() => {
                  (async () => {
                    try {
                      if (supabase) await supabase.auth.signOut();
                    } catch {}
                    try {
                      await fetch("/api/session/logout", { method: "POST" });
                    } catch (_) {}
                    try {
                      document.cookie = "plan=; path=/; max-age=0";
                      document.cookie = "uid=; path=/; max-age=0";
                      document.cookie = "email=; path=/; max-age=0";
                      document.cookie = "name=; path=/; max-age=0";
                      document.cookie = "username=; path=/; max-age=0";
                    } catch (_) {}
                    window.location.href = "/login";
                  })();
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
