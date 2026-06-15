"use client";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../lib/supabaseClient";
import { usePathname } from "next/navigation";
import Image from "next/image";
import "../dashboard/admin-dashboard.css";
import "./admin-users.css";

const PLANS = [
  "free",
  "veo_lifetime",
  "veo_sora_unlimited",
  "monthly",
  "admin",
];

export default function AdminUsersPage() {
  const [items, setItems] = useState([]);
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [detailUser, setDetailUser] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPlan, setFilterPlan] = useState("all");
  const [soraCredits, setSoraCredits] = useState(0);
  const [showCreditModal, setShowCreditModal] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditStatus, setCreditStatus] = useState("");
  const [creditBusy, setCreditBusy] = useState(false);
  const [grantAmount, setGrantAmount] = useState(0);
  const [grantStatus, setGrantStatus] = useState("");
  const [revokeAmount, setRevokeAmount] = useState(0);
  const [revokeStatus, setRevokeStatus] = useState("");
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [isVerySmall, setIsVerySmall] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const PAGE_SIZE = 10;
  const pathname = usePathname();

  useEffect(() => {
    try {
      document.title = "Manage Users | Nemesis Studio";
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
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          window.location.href = "/login";
          return;
        }
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
      } catch (_) { }
    })();
    (async () => {
      try {
        const s = localStorage.getItem("adminSecret") || "";
        if (s) {
          setSecret(s);
          await loadUsers(s);
        }
      } catch (_) { }
    })();
  }, []);

  const loadUsers = async (sec) => {
    try {
      setStatus("Memuat...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = String(session?.access_token || "");
      const resp = await fetch("/api/admin/users", {
        headers: {
          "x-admin-secret": sec || secret,
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await resp.json();
      if (!resp.ok) {
        setStatus(String(data?.error || "Gagal memuat"));
        return;
      }
      setItems(Array.isArray(data?.users) ? data.users : []);
      setPage(1);
      setStatus("");
    } catch (e) {
      setStatus(String(e?.message || e));
    }
  };

  const updatePlan = async (id, plan) => {
    try {
      setStatus("Menyimpan...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = String(session?.access_token || "");
      const resp = await fetch(`/api/admin/users/${id}/plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": secret,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setStatus(String(data?.error || "Gagal menyimpan"));
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === id ? data.user : x)));
      setStatus("Berhasil.");
    } catch (e) {
      setStatus(String(e?.message || e));
    }
  };

  const deleteUser = async (user) => {
    if (!user || !user.id) return;
    if (String(user.plan || "").toLowerCase() === "admin") {
      setStatus("Tidak dapat menghapus akun admin.");
      return;
    }
    const ok = window.confirm(
      `Hapus akun untuk ${user.email || "user"
      }? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!ok) return;
    try {
      setStatus("Menghapus akun...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = String(session?.access_token || "");
      const resp = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "x-admin-secret": secret,
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        setStatus(String(data?.error || "Gagal menghapus akun"));
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== user.id));
      setDetailUser(null);
      setStatus("Akun dihapus.");
    } catch (e) {
      setStatus(String(e?.message || e));
    }
  };

  const formatExpiry = (u) => {
    const plan = String(u.plan || "").toLowerCase();
    const exp = u.plan_expiry;
    if (plan !== "monthly" || !exp) return "—";
    const now = Date.now();
    const diff = exp - now;
    if (diff <= 0) return "Expired";
    const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
    return `${days} hari lagi`;
  };

  const filteredItems = items.filter((u) => {
    const q = search.trim().toLowerCase();
    if (q) {
      const email = String(u.email || "").toLowerCase();
      const name = String(u.full_name || "").toLowerCase();
      if (!email.includes(q) && !name.includes(q)) return false;
    }
    if (filterPlan !== "all") {
      const p = String(u.plan || "free").toLowerCase();
      if (p !== filterPlan) return false;
    }
    return true;
  });

  useEffect(() => {
    setPage(1);
  }, [search, filterPlan]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (detailUser || showLogoutModal || showCreditModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => document.body.classList.remove("modal-open");
  }, [detailUser, showLogoutModal, showCreditModal]);

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

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filteredItems.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div className="app-shell admin-dashboard" style={{ padding: 0, minHeight: '100vh', width: '100%', maxWidth: '100%', margin: 0 }}>
      {/* Navbar */}
      <nav className="admin-navbar" style={isVerySmall ? { flexDirection: 'column', padding: '10px 12px' } : {}}>
        {isVerySmall ? (
          <>
            {/* Row 1: Brand + Profile */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Image src="/images/nemesisstudio.png" alt="Nemesis Studio" className="admin-navbar-logo" width={36} height={36} priority />
                <h1 className="admin-navbar-title" style={{ fontSize: '12px', margin: 0 }}>
                  Manage Users
                  <span className="admin-navbar-badge" style={{ fontSize: '8px', padding: '2px 5px', marginLeft: '4px' }}>Admin</span>
                </h1>
              </div>

              <div className="admin-navbar-user" ref={userMenuRef}>
                <button className="admin-navbar-user-btn" onClick={() => { setShowUserMenu(!showUserMenu); setShowMobileMenu(false); }} style={{ padding: '6px 8px' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21v-1c0-3.866 3.582-7 8-7s8 3.134 8 7v1" />
                  </svg>
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div className={`admin-navbar-dropdown ${showUserMenu ? 'show' : ''}`}>
                  <div style={{ padding: '10px 12px', color: '#D4AF37', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid rgba(212, 175, 55, 0.2)', marginBottom: '4px' }}>
                    👤 Admin
                  </div>
                  <a href="/admin/dashboard" className="admin-navbar-dropdown-item">🏛️ Dashboard</a>
                  <div className="admin-navbar-dropdown-divider" />
                  <button className="admin-navbar-dropdown-item" onClick={() => { setShowLogoutModal(true); setShowUserMenu(false); }}>🚪 Logout</button>
                </div>
              </div>
            </div>

            {/* Row 2: Hamburger + Credits */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ position: 'relative' }}>
                <button onClick={() => { setShowMobileMenu(!showMobileMenu); setShowUserMenu(false); }} style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '18px', color: '#D4AF37' }}>
                  ☰
                </button>

                {showMobileMenu && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'rgba(20, 20, 20, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '8px', minWidth: '180px', zIndex: 9999, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}>
                    <a href="/admin/dashboard" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#9A8B4F', textDecoration: 'none', fontSize: '13px', borderRadius: '8px' }}>🏛️ Dashboard</a>
                    <a href="/prompt-tunggal" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#9A8B4F', textDecoration: 'none', fontSize: '13px', borderRadius: '8px' }}>🎬 Video</a>
                    <a href="/prompt-tunggal" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#9A8B4F', textDecoration: 'none', fontSize: '13px', borderRadius: '8px' }}>⚡ Sora 2</a>
                    <a href="/image-generator" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', color: '#9A8B4F', textDecoration: 'none', fontSize: '13px', borderRadius: '8px' }}>🖼️ Image</a>

                  </div>
                )}
              </div>

              <button className="admin-navbar-credit" onClick={() => setShowCreditModal(true)} style={{ fontSize: '12px', padding: '6px 12px' }}>
                💳 {new Intl.NumberFormat("id-ID").format(soraCredits)}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="admin-navbar-brand">
              <Image src="/images/nemesisstudio.png" alt="Nemesis Studio" className="admin-navbar-logo" width={44} height={44} priority />
              <h1 className="admin-navbar-title">
                Manage Users
                <span className="admin-navbar-badge">Admin</span>
              </h1>
            </div>

            {!isMobile && (
              <div className="admin-navbar-links">
                <a href="/admin/dashboard" className="admin-navbar-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                  Dashboard
                </a>
                <a href="/prompt-tunggal" className="admin-navbar-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="2" /><path d="M7 10l5 4 5-4" />
                  </svg>
                  Video
                </a>
                <a href="/prompt-tunggal" className="admin-navbar-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  Sora 2
                </a>
                <a href="/image-generator" className="admin-navbar-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" />
                  </svg>
                  Image
                </a>

              </div>
            )}

            <div className="admin-navbar-actions" ref={userMenuRef}>
              {isMobile && (
                <div style={{ position: 'relative', marginRight: '8px' }}>
                  <button onClick={() => { setShowMobileMenu(!showMobileMenu); setShowUserMenu(false); }} style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '8px', cursor: 'pointer', fontSize: '20px', color: '#D4AF37' }}>
                    ☰
                  </button>

                  {showMobileMenu && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: '8px', background: 'rgba(20, 20, 20, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '12px', border: '1px solid rgba(212, 175, 55, 0.2)', padding: '8px', minWidth: '200px', zIndex: 9999, boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}>
                      <a href="/admin/dashboard" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', color: '#9A8B4F', textDecoration: 'none', fontSize: '14px', borderRadius: '8px' }}>🏛️ Dashboard</a>
                      <a href="/prompt-tunggal" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', color: '#9A8B4F', textDecoration: 'none', fontSize: '14px', borderRadius: '8px' }}>🎬 Video</a>
                      <a href="/prompt-tunggal" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', color: '#9A8B4F', textDecoration: 'none', fontSize: '14px', borderRadius: '8px' }}>⚡ Sora 2</a>
                      <a href="/image-generator" onClick={() => setShowMobileMenu(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', color: '#9A8B4F', textDecoration: 'none', fontSize: '14px', borderRadius: '8px' }}>🖼️ Image</a>

                    </div>
                  )}
                </div>
              )}

              <div className="admin-navbar-user">
                <button className="admin-navbar-user-btn" onClick={() => { setShowUserMenu(!showUserMenu); setShowMobileMenu(false); }} style={isMobile ? { padding: '8px 10px' } : {}}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="8" r="4" /><path d="M4 21v-1c0-3.866 3.582-7 8-7s8 3.134 8 7v1" />
                  </svg>
                  {!isMobile && 'Admin'}
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                <div className={`admin-navbar-dropdown ${showUserMenu ? 'show' : ''}`}>
                  {isMobile && (
                    <div style={{ padding: '12px 14px', color: '#D4AF37', fontSize: '14px', fontWeight: 600, borderBottom: '1px solid rgba(212, 175, 55, 0.2)', marginBottom: '4px' }}>
                      👤 Admin
                    </div>
                  )}
                  <a href="/admin/dashboard" className="admin-navbar-dropdown-item">🏛️ Dashboard</a>
                  <div className="admin-navbar-dropdown-divider" />
                  <button className="admin-navbar-dropdown-item" onClick={() => { setShowLogoutModal(true); setShowUserMenu(false); }}>🚪 Logout</button>
                </div>
              </div>

              <button className="admin-navbar-credit" onClick={() => setShowCreditModal(true)}>
                💳 {new Intl.NumberFormat("id-ID").format(soraCredits)}
              </button>
            </div>
          </>
        )}
      </nav>

      <main className="admin-main">
        {/* Toolbar */}
        <div className="admin-users-toolbar">
          <input
            className="admin-users-secret-input"
            type="password"
            placeholder="🔑 Admin Secret Key"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
          <button
            className="admin-users-load-btn"
            type="button"
            onClick={async () => {
              localStorage.setItem("adminSecret", secret);
              await loadUsers(secret);
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            Load Users
          </button>
          {status && <span className="admin-users-status">{status}</span>}
        </div>

        {/* Filters */}
        <div className="admin-users-filters">
          <input
            type="text"
            className="admin-users-search"
            placeholder="🔍 Cari email atau nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="admin-users-filter-group">
            <span className="admin-users-filter-label">Filter plan</span>
            <select
              className="admin-users-select"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
            >
              <option value="all">Semua plan</option>
              {PLANS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="admin-users-table-wrap">
          <table className="admin-users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nama</th>
                <th>Plan</th>
                <th>Expire</th>
                <th>Credits</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((u) => (
                <tr key={u.id}>
                  <td className="email">{u.email}</td>
                  <td>{u.full_name || "-"}</td>
                  <td>
                    <select
                      className="admin-users-plan-select"
                      value={u.plan || "free"}
                      onChange={(e) => updatePlan(u.id, e.target.value)}
                    >
                      {PLANS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <div className="admin-users-plan-badge">
                      {String(u.plan || "").toLowerCase() === "monthly"
                        ? formatExpiry(u)
                        : String(u.plan || "free")}
                    </div>
                  </td>
                  <td className="admin-users-muted">{formatExpiry(u)}</td>
                  <td className="admin-users-muted">
                    {(() => {
                      const plan = String(u.plan || "").toLowerCase();
                      if (plan === "veo_sora_unlimited") {
                        const n = Number(u.sora2_credits || 0);
                        const v = Number.isFinite(n) ? n : 0;
                        return new Intl.NumberFormat("id-ID").format(v);
                      } else if (plan === "admin") {
                        return new Intl.NumberFormat("id-ID").format(soraCredits);
                      }
                      return "tidak tersedia";
                    })()}
                  </td>
                  <td>
                    <button
                      className="admin-users-detail-btn"
                      type="button"
                      onClick={() => setDetailUser(u)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {filteredItems.length > 0 && (
            <div className="admin-users-pagination">
              <div className="admin-users-pagination-info">
                Menampilkan {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, filteredItems.length)} dari {filteredItems.length} user
              </div>
              <div className="admin-users-pagination-controls">
                <button
                  type="button"
                  className="admin-users-pagination-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Sebelumnya
                </button>
                <span className="admin-users-pagination-info">
                  Halaman {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  className="admin-users-pagination-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Berikutnya →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      {showLogoutModal && (
        <div
          className="modal show"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="modal-content" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <div style={{ fontWeight: 700, color: "#f4d03f" }}>
                Konfirmasi Logout
              </div>
              <button
                className="btn ghost"
                onClick={() => setShowLogoutModal(false)}
              >
                Tutup
              </button>
            </div>
            <div
              className="modal-body"
              style={{ flexDirection: "column", gap: 10 }}
            >
              <div style={{ color: "#e2e8f0", fontWeight: 600 }}>
                Apakah Anda yakin ingin logout?
              </div>
              <div style={{ color: "#94a3b8", fontSize: 14 }}>
                Sesi Anda akan diakhiri dan Anda akan kembali ke halaman login.
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ justifyContent: "flex-end", gap: 10 }}
            >
              <button
                className="btn ghost"
                onClick={() => setShowLogoutModal(false)}
              >
                Batal
              </button>
              <button
                className="btn primary"
                onClick={() => {
                  (async () => {
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
                  })();
                }}
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {detailUser && typeof document !== 'undefined' && createPortal(
        <div
          className="admin-users-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailUser(null);
          }}
        >
          <div className="admin-users-modal">
            <div className="admin-users-modal-header">
              <h3 className="admin-users-modal-title">👤 Detail User</h3>
              <button
                className="admin-users-modal-close"
                onClick={() => setDetailUser(null)}
              >
                ✕
              </button>
            </div>

            <div className="admin-users-modal-body">
              {/* Email */}
              <div className="admin-users-modal-row">
                <span className="admin-users-modal-label">Email</span>
                <span className="admin-users-modal-value email">{detailUser.email}</span>
              </div>

              {/* Name & Plan */}
              <div className="admin-users-modal-grid">
                <div className="admin-users-modal-row">
                  <span className="admin-users-modal-label">Nama</span>
                  <span className="admin-users-modal-value">{detailUser.full_name || "-"}</span>
                </div>
                <div className="admin-users-modal-row">
                  <span className="admin-users-modal-label">Plan</span>
                  <span className="admin-users-modal-badge">{detailUser.plan}</span>
                </div>
              </div>

              {/* Expire */}
              <div className="admin-users-modal-row">
                <span className="admin-users-modal-label">Status Expire</span>
                <span className="admin-users-modal-value">{formatExpiry(detailUser)}</span>
              </div>

              {/* Usage Stats */}
              <div className="admin-users-modal-section">
                <span className="admin-users-modal-label">Status Pemakaian</span>
                <div className="admin-users-usage-stats">
                  {(() => {
                    const veo = Number(detailUser.veo_count || 0);
                    const sora = Number(detailUser.sora2_count || 0);
                    const img = Number(detailUser.image_count || 0);
                    const max = Math.max(1, veo, sora, img);
                    const pct = (v) => `${(v / max) * 100}%`;
                    return (
                      <>
                        <div className="admin-users-usage-row">
                          <span className="admin-users-usage-label">Veo</span>
                          <div className="admin-users-usage-bar">
                            <div className="admin-users-usage-fill veo" style={{ width: pct(veo) }} />
                          </div>
                          <span className="admin-users-usage-count">{veo}</span>
                        </div>
                        <div className="admin-users-usage-row">
                          <span className="admin-users-usage-label">Sora 2</span>
                          <div className="admin-users-usage-bar">
                            <div className="admin-users-usage-fill sora" style={{ width: pct(sora) }} />
                          </div>
                          <span className="admin-users-usage-count">{sora}</span>
                        </div>
                        <div className="admin-users-usage-row">
                          <span className="admin-users-usage-label">Image</span>
                          <div className="admin-users-usage-bar">
                            <div className="admin-users-usage-fill image" style={{ width: pct(img) }} />
                          </div>
                          <span className="admin-users-usage-count">{img}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Credits Management for veo_sora_unlimited */}
              {String(detailUser.plan || "").toLowerCase() === "veo_sora_unlimited" && (
                <div className="admin-users-modal-section">
                  <div className="admin-users-credit-box">
                    <span className="admin-users-modal-label">Tambah Credits ke User</span>
                    <div className="admin-users-credit-row">
                      <input
                        type="number"
                        className="admin-users-credit-input"
                        placeholder="Jumlah"
                        value={grantAmount}
                        onChange={(e) => setGrantAmount(Number(e.target.value || 0))}
                      />
                      <button
                        className="admin-users-btn-grant"
                        disabled={creditBusy}
                        onClick={() => {
                          (async () => {
                            try {
                              setGrantStatus("Memproses...");
                              setCreditBusy(true);
                              const amt = Number(grantAmount || 0);
                              if (!Number.isFinite(amt) || amt <= 0) {
                                setGrantStatus("Jumlah tidak valid");
                                setCreditBusy(false);
                                return;
                              }
                              const { data: { session } } = await supabase.auth.getSession();
                              const token = String(session?.access_token || "");
                              const resp = await fetch(`/api/admin/users/${detailUser.id}/credits/grant`, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                  "x-admin-secret": secret,
                                },
                                body: JSON.stringify({ amount: amt }),
                              });
                              const data = await resp.json();
                              if (!resp.ok) {
                                setGrantStatus(String(data?.error || "Gagal"));
                                setCreditBusy(false);
                                return;
                              }
                              const a = Number(data?.admin_credits || 0);
                              const uc = Number(data?.user_credits || 0);
                              setSoraCredits(Number.isFinite(a) ? a : 0);
                              setItems((prev) => prev.map((x) => x.id === detailUser.id ? { ...x, sora2_credits: uc } : x));
                              setDetailUser((prev) => ({ ...prev, sora2_credits: uc }));
                              setGrantStatus("✓ Berhasil");
                              setGrantAmount(0);
                            } catch (e) {
                              setGrantStatus(String(e?.message || e || ""));
                            } finally {
                              setCreditBusy(false);
                            }
                          })();
                        }}
                      >
                        + Tambah
                      </button>
                    </div>
                    {grantStatus && <div className="admin-users-credit-status">{grantStatus}</div>}
                  </div>

                  <div className="admin-users-credit-box revoke">
                    <span className="admin-users-modal-label">Kurangi Credits dari User</span>
                    <div className="admin-users-credit-row">
                      <input
                        type="number"
                        className="admin-users-credit-input"
                        placeholder="Jumlah"
                        value={revokeAmount}
                        onChange={(e) => setRevokeAmount(Number(e.target.value || 0))}
                      />
                      <button
                        className="admin-users-btn-revoke"
                        disabled={creditBusy}
                        onClick={() => {
                          (async () => {
                            try {
                              setRevokeStatus("Memproses...");
                              setCreditBusy(true);
                              const amt = Number(revokeAmount || 0);
                              if (!Number.isFinite(amt) || amt <= 0) {
                                setRevokeStatus("Jumlah tidak valid");
                                setCreditBusy(false);
                                return;
                              }
                              const { data: { session } } = await supabase.auth.getSession();
                              const token = String(session?.access_token || "");
                              const resp = await fetch(`/api/admin/users/${detailUser.id}/credits/revoke`, {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${token}`,
                                  "x-admin-secret": secret,
                                },
                                body: JSON.stringify({ amount: amt }),
                              });
                              const data = await resp.json();
                              if (!resp.ok) {
                                setRevokeStatus(String(data?.error || "Gagal"));
                                setCreditBusy(false);
                                return;
                              }
                              const a = Number(data?.admin_credits || 0);
                              const uc = Number(data?.user_credits || 0);
                              setSoraCredits(Number.isFinite(a) ? a : 0);
                              setItems((prev) => prev.map((x) => x.id === detailUser.id ? { ...x, sora2_credits: uc } : x));
                              setDetailUser((prev) => ({ ...prev, sora2_credits: uc }));
                              setRevokeStatus("✓ Dikurangi");
                              setRevokeAmount(0);
                            } catch (e) {
                              setRevokeStatus(String(e?.message || e || ""));
                            } finally {
                              setCreditBusy(false);
                            }
                          })();
                        }}
                      >
                        − Kurangi
                      </button>
                    </div>
                    {revokeStatus && <div className="admin-users-credit-status">{revokeStatus}</div>}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="admin-users-modal-footer">
              <div className="admin-users-modal-warning">
                ⚠️ Hapus akun akan menghapus data user dari sistem.
              </div>
              <button
                className="admin-users-btn-delete"
                type="button"
                onClick={() => deleteUser(detailUser)}
                disabled={String(detailUser.plan || "").toLowerCase() === "admin"}
              >
                🗑️ Delete Akun
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
      {showCreditModal && (
        <div
          className="modal show"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCreditModal(false);
          }}
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="modal-content" style={{ maxWidth: 420 }}>
            <div className="modal-header">
              <div style={{ fontWeight: 700, color: "#f4d03f" }}>
                Tambah Credits Sora 2
              </div>
              <button
                className="btn ghost"
                onClick={() => setShowCreditModal(false)}
              >
                Tutup
              </button>
            </div>
            <div
              className="modal-body"
              style={{ flexDirection: "column", gap: 10 }}
            >
              <div style={{ color: "#e2e8f0", fontWeight: 600 }}>
                Isi jumlah credit yang ingin ditambahkan.
              </div>
              <input
                type="number"
                className="dropdown"
                placeholder="Masukkan angka"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
              />
              <div style={{ color: "#94a3b8", fontSize: 13 }}>
                Saldo saat ini:{" "}
                {new Intl.NumberFormat("id-ID").format(soraCredits)}
              </div>
              <div style={{ color: "#94a3b8", fontSize: 13 }}>
                {creditStatus}
              </div>
            </div>
            <div
              className="modal-footer"
              style={{ justifyContent: "flex-end", gap: 10 }}
            >
              <button
                className="btn ghost"
                onClick={() => setShowCreditModal(false)}
              >
                Batal
              </button>
              <button
                className="btn primary"
                disabled={creditBusy}
                onClick={() => {
                  (async () => {
                    try {
                      setCreditBusy(true);
                      setCreditStatus("Memproses...");
                      const amt = Number(creditAmount || 0);
                      if (!Number.isFinite(amt)) {
                        setCreditStatus("Jumlah tidak valid");
                        setCreditBusy(false);
                        return;
                      }
                      const {
                        data: { session },
                      } = await supabase.auth.getSession();
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
                  })();
                }}
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
