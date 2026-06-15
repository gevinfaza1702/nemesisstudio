"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AppNavbar from "../components/AppNavbar";
import { motion } from "framer-motion";
import { IconUser, IconMail, IconLock, IconShieldCheck } from "@tabler/icons-react";
import "./ProfileClient.css";

export default function ProfileClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

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
        const uid = session.user.id;
        const uemail = session.user.email || "";
        setEmail(uemail);
        const { data: profile } = await supabase
          .from("users")
          .select("full_name,email")
          .eq("id", uid)
          .single();
        if (profile) {
          setName(profile.full_name || "");
          setEmail(profile.email || uemail);
        }
      } catch (_) {}
    })();
  }, []);

  const handleSave = async () => {
    try {
      if (busy) return;
      setBusy(true);
      setStatus("");
      
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setStatus("Must be logged in.");
        return;
      }

      if ((name || "").trim()) {
        await supabase
          .from("users")
          .update({ full_name: String(name).trim() })
          .eq("id", user.id);
        
        try {
          await supabase.auth.updateUser({
            data: { name: String(name).trim() },
          });
        } catch (_) {}
        
        try {
          document.cookie = `username=${encodeURIComponent(String(name).trim())}; path=/; max-age=${60 * 60 * 24 * 30}`;
          document.cookie = `name=${encodeURIComponent(String(name).trim())}; path=/; max-age=${60 * 60 * 24 * 30}`;
        } catch (_) {}
      }

      if ((newPassword || confirmPassword).trim()) {
        if (newPassword !== confirmPassword) {
          setStatus("Password confirmation does not match.");
          return;
        }
        await supabase.auth.updateUser({ password: newPassword });
      }

      setStatus("Changes successfully saved! 🚀");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setStatus(String(e?.message || e || "Failed to save"));
    } finally {
      setBusy(false);
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="app-shell profile-page-container" style={{ padding: 0, minHeight: '100vh', width: '100%', maxWidth: '100%', margin: 0 }}>
      <AppNavbar />
      
      <div className="profile-content">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="profile-header">
            <h1 className="profile-title text-gradient-gold">User Profile</h1>
            <p className="profile-subtitle">Manage your account information and security preferences.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="profile-card glass-card-gold">
            {/* Soft decorative glow */}
            <div className="mesh-glow" style={{ opacity: 0.15, pointerEvents: 'none' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              <div className="profile-section">
                <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconUser size={18} stroke={2} /> Personal Information
                </span>
                
                <div className="input-group">
                <label className="input-label">Display Name</label>
                <div style={{ position: 'relative' }}>
                  <IconUser size={20} className="input-icon" stroke={1.5} />
                  <input
                    className="premium-input with-icon"
                    type="text"
                    placeholder="Enter your display name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Registered Email</label>
                <div style={{ position: 'relative' }}>
                  <IconMail size={20} className="input-icon" stroke={1.5} />
                  <input
                    className="premium-input with-icon"
                    type="email"
                    value={email}
                    readOnly
                  />
                </div>
                <p className="helper-text" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
                  <IconShieldCheck size={14} color="#22c55e" /> Your email is locked for account security.
                </p>
              </div>
            </div>

              <div className="profile-section">
                <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <IconLock size={18} stroke={2} /> Security & Password
                </span>
                
                <div className="password-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  <div className="input-group">
                    <label className="input-label">New Password</label>
                    <div style={{ position: 'relative' }}>
                      <IconLock size={20} className="input-icon" stroke={1.5} />
                      <input
                        className="premium-input with-icon"
                        type="password"
                        placeholder="Minimum 8 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <label className="input-label">Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <IconLock size={20} className="input-icon" stroke={1.5} />
                      <input
                        className="premium-input with-icon"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <p className="helper-text">Leave blank if you don't want to change your password.</p>
              </div>
            </div>

            {status && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="status-message"
              >
                {status}
              </motion.div>
            )}

            <div className="action-buttons">
              <button 
                className="btn-secondary-gold hover-lift-gold"
                onClick={() => {
                  setNewPassword("");
                  setConfirmPassword("");
                  setStatus("");
                }}
                disabled={busy}
              >
                Cancel
              </button>
              <button 
                className="btn-primary-gold hover-lift-gold"
                onClick={handleSave}
                disabled={busy}
              >
                {busy ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
