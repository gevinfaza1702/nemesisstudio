"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const cookies = document.cookie;
      const hasPlan = cookies.includes("plan=");
      const hasUid = cookies.includes("uid=");
      const isLoggedIn = hasPlan || hasUid;
      setIsAuthenticated(isLoggedIn);

      if (isLoggedIn) {
        const nameMatch = cookies.match(/name=([^;]+)/);
        if (nameMatch) {
          setUserName(decodeURIComponent(nameMatch[1]));
        }
      }
    };

    checkAuth();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/session/logout", { method: "POST" });
      const cookieNames = ["plan", "planExpiry", "uid", "email", "name", "username", "sessionExpiry"];
      for (const name of cookieNames) {
        document.cookie = `${name}=; path=/; max-age=0`;
      }
      router.push("/login");
    } catch (error) {
      router.push("/login");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Link href="/login" className="btn ghost">Masuk</Link>
        <Link href="/register" className="btn primary">Daftar</Link>
      </>
    );
  }

  return (
    <div className="user-dropdown-wrap" ref={dropdownRef}>
      <button className="user-btn" onClick={() => setIsOpen(!isOpen)} aria-label="User menu">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
          <path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu">
          <Link href="/dashboard" className="menu-item" onClick={() => setIsOpen(false)}>
            <span className="menu-icon">🏠</span>
            <span className="menu-text">Dashboard</span>
          </Link>
          <Link href="/profile" className="menu-item" onClick={() => setIsOpen(false)}>
            <span className="menu-icon">👤</span>
            <span className="menu-text">User Profile</span>
          </Link>
          <Link href="/credit" className="menu-item" onClick={() => setIsOpen(false)}>
            <span className="menu-icon">💳</span>
            <span className="menu-text">Credit</span>
          </Link>
          <Link href="/profile" className="menu-item" onClick={() => setIsOpen(false)}>
            <span className="menu-icon">⚙️</span>
            <span className="menu-text">Pengaturan</span>
          </Link>
          <div className="menu-divider" />
          <button className="menu-item menu-logout" onClick={handleLogout}>
            <span className="menu-icon">🚪</span>
            <span className="menu-text">Logout</span>
          </button>
        </div>
      )}

      <style jsx>{`
        .user-dropdown-wrap {
          position: relative;
        }
        .user-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 215, 0, 0.1);
          border: 2px solid #ffd700;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-btn:hover {
          background: rgba(255, 215, 0, 0.2);
          transform: scale(1.05);
        }
        .user-btn svg {
          width: 22px;
          height: 22px;
          color: #ffd700;
        }
        .user-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 200px;
          background: rgba(20, 20, 20, 0.98);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          padding: 8px;
          z-index: 1000;
          backdrop-filter: blur(12px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          color: #e0e0e0;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.15s;
          cursor: pointer;
          border: none;
          background: transparent;
          width: 100%;
          font-size: 14px;
        }
        .menu-item:hover {
          background: rgba(255, 215, 0, 0.12);
          color: #ffd700;
        }
        .menu-icon {
          font-size: 16px;
          width: 22px;
          text-align: center;
        }
        .menu-text {
          flex: 1;
        }
        .menu-divider {
          height: 1px;
          background: rgba(255, 215, 0, 0.15);
          margin: 6px 0;
        }
        .menu-logout {
          color: #ff6b6b;
        }
        .menu-logout:hover {
          background: rgba(255, 80, 80, 0.12);
          color: #ff6b6b;
        }
      `}</style>
    </div>
  );
}
