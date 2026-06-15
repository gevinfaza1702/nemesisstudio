import { memo } from "react";

// Lightweight SVG section divider - no JS, pure CSS
function SectionDivider({ flip = false, color = "rgba(255, 215, 0, 0.08)" }) {
  return (
    <div
      className="section-divider"
      style={{
        transform: flip ? "scaleY(-1)" : undefined,
        background: "transparent",
      }}
    >
      <svg
        viewBox="0 0 1440 80"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 40C240 10 480 70 720 40C960 10 1200 70 1440 40V80H0V40Z"
          fill={color}
        />
        <path
          d="M0 60C360 30 720 80 1080 50C1260 35 1380 45 1440 55V80H0V60Z"
          fill="rgba(255, 215, 0, 0.04)"
        />
      </svg>
    </div>
  );
}

export default memo(SectionDivider);
