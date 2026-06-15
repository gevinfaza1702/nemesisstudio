"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [bearer, setBearer] = useState("");
  const [activationToken, setActivationToken] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [statusTone, setStatusTone] = useState("info"); // info, success, error
  const [userPlan, setUserPlan] = useState("");

  // Helper to set temporary status message
  const setStatus = useCallback((text, tone = "info") => {
    setStatusText(text);
    setStatusTone(tone);
    if (text) {
      setTimeout(() => {
        setStatusText((prev) => (prev === text ? "" : prev));
      }, tone === "error" ? 5000 : 3000);
    }
  }, []);

  // Load initial settings
  useEffect(() => {
    const loadSettings = async () => {
      setBusy(true);
      try {
        // 1. Check Bearer
        const resp = await fetch("/api/settings");
        if (resp.ok) {
          const data = await resp.json();
          setBearer(data?.labsBearer || "");
        }

        // 2. Check Plan from Cookie (simple check)
        const planMatch = document.cookie.match(/(?:^|; )plan=([^;]+)/);
        setUserPlan(planMatch ? planMatch[1].toLowerCase() : "free");

        // 3. Check Activation Token (if saved locally)
        const savedToken = localStorage.getItem("licenseActivationToken");
        if (savedToken) setActivationToken(savedToken);

        setLoaded(true);
      } catch (err) {
        console.error("Failed to load settings:", err);
        setStatus("Gagal memuat pengaturan.", "error");
      } finally {
        setBusy(false);
      }
    };

    loadSettings();
  }, [setStatus]);

  // Save Bearer
  const saveBearer = async (newBearer) => {
    setBusy(true);
    setStatus("Menyimpan bearer...", "info");
    try {
      const resp = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ labsBearer: newBearer }),
      });
      
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      
      setBearer(newBearer);
      setStatus("Bearer berhasil disimpan.", "success");
      return true;
    } catch (err) {
      setStatus(`Gagal menyimpan: ${err.message}`, "error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  // Activate License
  const activateLicense = async (token) => {
    if (!token) {
      setStatus("Token aktivasi tidak boleh kosong.", "error");
      return false;
    }
    setBusy(true);
    setStatus("Memverifikasi token...", "info");
    try {
      const resp = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activationToken: token }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${resp.status}`);
      }

      localStorage.setItem("licenseActivationToken", token);
      setActivationToken(token);
      setStatus("Aktivasi berhasil!", "success");
      return true;
    } catch (err) {
      setStatus(`Aktivasi gagal: ${err.message}`, "error");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("licenseActivationToken");
    setActivationToken("");
    document.cookie = "plan=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/login";
  };

  return (
    <SettingsContext.Provider
      value={{
        bearer,
        activationToken,
        loaded,
        busy,
        statusText,
        statusTone,
        userPlan,
        saveBearer,
        activateLicense,
        logout,
        setStatus,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
