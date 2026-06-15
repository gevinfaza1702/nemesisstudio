"use client";

import AppNavbar from "./AppNavbar";
import "./AppNavbar.css";

export default function VideoLayout({ children }) {
  return (
    <div className="video-layout">
      <AppNavbar />
      <main 
        className="video-main-content"
        style={{
          marginLeft: 0,
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          paddingTop: "61px",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {children}
      </main>
    </div>
  );
}
