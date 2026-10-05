import React from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

interface CoffeeFillCupProps {
  fillPercentage: number; // 0 to 100
  customerName?: string;
  itemName?: string;
}

export default function CoffeeFillCup({
  fillPercentage,
  customerName,
  itemName = "Artisan Brew",
}: CoffeeFillCupProps) {
  // Clamp between 10 and 100 so there's always at least a little coffee visible at the bottom
  const clamped = Math.max(10, Math.min(100, fillPercentage));
  const isComplete = fillPercentage >= 100;

  // Cup interior coordinate calculations
  // In the SVG viewBox="0 0 200 240":
  // Cup bottom interior: y = 180
  // Cup top interior (brim): y = 60
  // Liquid height range = 180 - 60 = 120px
  const liquidHeight = (clamped / 100) * 120;
  const liquidTopY = 180 - liquidHeight;

  // Dynamic brewing status description
  const getStatusText = () => {
    if (fillPercentage < 30) return "Grinding Single-Estate Beans...";
    if (fillPercentage < 55) return "Extracting Rich Crema & Aroma...";
    if (fillPercentage < 80) return "Pouring & Crafting Customer Details...";
    if (fillPercentage < 100) return "Almost Ready — Finalizing Order...";
    return "Freshly Brewed & Ready to Order!";
  };

  return (
    <div className={`coffee-cup-container ${isComplete ? "cup-is-full" : ""}`}>
      <div className="cup-header">
        <div className="cup-badge">
          <span className="cup-badge-dot" />
          <span className="cup-badge-text">
            {isComplete ? "CUP IS FULL" : "LIVE BREW PROGRESS"}
          </span>
        </div>
        <span className="cup-percentage-number">{Math.round(fillPercentage)}%</span>
      </div>

      {/* SVG Canvas for the Coffee Cup */}
      <div className="cup-visual-wrapper">
        <svg
          viewBox="0 0 200 240"
          className="coffee-cup-svg"
          aria-hidden="true"
        >
          <defs>
            {/* Liquid Linear Gradient */}
            <linearGradient id="espressoLiquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8a4f24" />
              <stop offset="35%" stopColor="#512a14" />
              <stop offset="100%" stopColor="#210f08" />
            </linearGradient>

            {/* Crema Top Layer Gradient */}
            <linearGradient id="cremaGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c58d53" />
              <stop offset="50%" stopColor="#e8b982" />
              <stop offset="100%" stopColor="#b97c40" />
            </linearGradient>

            {/* Cup Ceramic Shading */}
            <linearGradient id="cupCeramic" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#24201c" />
              <stop offset="25%" stopColor="#352e27" />
              <stop offset="70%" stopColor="#201b17" />
              <stop offset="100%" stopColor="#14110e" />
            </linearGradient>

            {/* Gold Rim Gradient */}
            <linearGradient id="goldRim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d4af37" />
              <stop offset="50%" stopColor="#f7e8b6" />
              <stop offset="100%" stopColor="#aa820a" />
            </linearGradient>

            {/* Clip Path conforming to inner cup contour */}
            <clipPath id="innerCupClip">
              <path d="M 45 60 L 155 60 L 144 175 Q 140 188 100 188 Q 60 188 56 175 Z" />
            </clipPath>
          </defs>

          {/* Steam Elements - float higher as fill increases */}
          <g className={`steam-trails ${clamped > 25 ? "active" : ""}`}>
            <path
              d="M 85 52 Q 80 32 90 18 T 85 2"
              className="steam-path steam-1"
            />
            <path
              d="M 100 50 Q 110 30 100 14 T 105 0"
              className="steam-path steam-2"
            />
            <path
              d="M 115 54 Q 122 34 112 20 T 120 4"
              className="steam-path steam-3"
            />
          </g>

          {/* Saucer / Plate at the bottom */}
          <ellipse
            cx="100"
            cy="198"
            rx="75"
            ry="11"
            fill="url(#cupCeramic)"
            stroke="url(#goldRim)"
            strokeWidth="1.2"
          />
          <ellipse
            cx="100"
            cy="197"
            rx="58"
            ry="7"
            fill="#12100d"
            opacity="0.8"
          />

          {/* Cup Handle (Right side) */}
          <path
            d="M 148 85 C 182 88 185 142 140 148"
            fill="none"
            stroke="url(#cupCeramic)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 148 85 C 182 88 185 142 140 148"
            fill="none"
            stroke="url(#goldRim)"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Main Cup Body Exterior */}
          <path
            d="M 40 58 L 160 58 L 148 178 Q 144 192 100 192 Q 56 192 52 178 Z"
            fill="url(#cupCeramic)"
            stroke="url(#goldRim)"
            strokeWidth="1.5"
          />

          {/* Cup Interior Hollow / Cavity Background */}
          <path
            d="M 45 60 L 155 60 L 144 175 Q 140 188 100 188 Q 60 188 56 175 Z"
            fill="#140f0c"
          />

          {/* Coffee Liquid & Crema clipped inside the cup */}
          <g clipPath="url(#innerCupClip)">
            {/* Liquid Fill Body */}
            <rect
              x="30"
              y={liquidTopY}
              width="140"
              height={190 - liquidTopY}
              fill="url(#espressoLiquid)"
              className="coffee-liquid-rect"
            />

            {/* Animated Liquid Wave / Crema Top */}
            <g
              transform={`translate(0, ${liquidTopY})`}
              className="liquid-surface-group"
            >
              {/* Crema froth layer */}
              <ellipse
                cx="100"
                cy="0"
                rx="52"
                ry="7.5"
                fill="url(#cremaGradient)"
                className="crema-oval"
              />

              {/* Liquid surface wave ripple */}
              <path
                d="M 45 0 Q 72 -3 100 0 T 155 0"
                fill="none"
                stroke="rgba(255, 230, 180, 0.45)"
                strokeWidth="2"
                className="crema-wave-line"
              />
            </g>

            {/* Latte Art Heart - emerges when near 100% */}
            {isComplete && (
              <g
                transform={`translate(100, ${liquidTopY - 1}) scale(0.9)`}
                className="latte-art-heart"
              >
                <path
                  d="M 0 4 C -4 -4 -13 -4 -13 2 C -13 8 0 14 0 14 C 0 14 13 8 13 2 C 13 -4 4 -4 0 4 Z"
                  fill="#fff4e0"
                  opacity="0.95"
                />
              </g>
            )}

            {/* Inner glass highlight / sheen */}
            <path
              d="M 50 62 L 62 175"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </g>

          {/* Inner Rim Top Oval (Open mouth of the cup) */}
          <ellipse
            cx="100"
            cy="59"
            rx="56"
            ry="8.5"
            fill="none"
            stroke="url(#goldRim)"
            strokeWidth="2"
          />

          {/* Golden Badge Accent on Cup Center */}
          <circle
            cx="100"
            cy="135"
            r="11"
            fill="#1c1815"
            stroke="url(#goldRim)"
            strokeWidth="1"
          />
          <text
            x="100"
            y="139"
            textAnchor="middle"
            fill="#d4af37"
            fontSize="8"
            fontWeight="bold"
            letterSpacing="0.5"
          >
            AB
          </text>
        </svg>
      </div>

      {/* Progress & Live Brewing Status */}
      <div className="cup-status-card">
        <div className="status-progress-track">
          <div
            className="status-progress-bar"
            style={{ width: `${clamped}%` }}
          />
        </div>

        <div className="status-details">
          <div className="status-message">
            {isComplete ? (
              <span className="complete-msg">
                <CheckCircle2 size={13} className="cup-icon-emerald" />
                {getStatusText()}
              </span>
            ) : (
              <span className="brewing-msg">
                <Sparkles size={12} className="cup-icon-amber" />
                {getStatusText()}
              </span>
            )}
          </div>
          <span className="status-cup-item">
            {itemName} {customerName?.trim() ? `• For ${customerName.trim()}` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
