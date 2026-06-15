"use client";

import Link from "next/link";
import AppNavbar from "../../components/AppNavbar";
import "../ugc-generator.css";

export default function MagicWriterPage() {
  return (
    <div className="ugc-layout workspace-active">
      <AppNavbar />
      <div className="ugc-container">
        <div className="ugc-workspace-wrapper">
          <div className="workspace-header">
            <Link href="/ugc-generator" className="btn-back-ugc">
              ← Back to Tools
            </Link>
          </div>
          <div className="ugc-workspace-content">
            <div className="ugc-tool-placeholder">
              <h2>✍️ Magic Script Writer</h2>
              <p>Advanced script editor with SEO optimization and viral hooks coming soon.</p>
              <div className="coming-soon-badge-large">UNDER CONSTRUCTION</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
