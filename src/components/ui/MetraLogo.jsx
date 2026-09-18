import React from 'react';

export const MetraLogo = ({
  variant = 'dark',
  showTagline = true,
  className = '',
  iconSize = 52
}) => {
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center gap-3.5 select-none ${className}`}>
      {/* Weighing Scale Icon with Certified Checkmark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize * 0.95}
          viewBox="0 0 120 114"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
        >
          {/* Top Weighing Pan */}
          <rect
            x="24"
            y="6"
            width="72"
            height="11"
            rx="5.5"
            fill={isDark ? '#F1F5F9' : '#FFFFFF'}
            stroke="#0A2558"
            strokeWidth="5"
          />

          {/* Scale Column / Neck */}
          <rect
            x="48"
            y="17"
            width="24"
            height="13"
            fill={isDark ? '#E2E8F0' : '#F8FAFC'}
            stroke="#0A2558"
            strokeWidth="5"
          />

          {/* Left and Right Feet */}
          <rect
            x="14"
            y="94"
            width="14"
            height="8"
            rx="4"
            fill="#0A2558"
          />
          <rect
            x="92"
            y="94"
            width="14"
            height="8"
            rx="4"
            fill="#0A2558"
          />

          {/* Scale Base (Trapezoid Body with Rounded Corners) */}
          <path
            d="M 37 30 L 83 30 C 86.5 30 89.5 32 91 35.5 L 109 82 C 111.5 88 107 94 100.5 94 L 19.5 94 C 13 94 8.5 88 11 82 L 29 35.5 C 30.5 32 33.5 30 37 30 Z"
            fill={isDark ? '#F8FAFC' : '#FFFFFF'}
            stroke="#0A2558"
            strokeWidth="5.5"
            strokeLinejoin="round"
          />

          {/* Digital LCD Screen Window */}
          <rect
            x="32"
            y="56"
            width="56"
            height="26"
            rx="5"
            fill="#0056B3"
            stroke="#0A2558"
            strokeWidth="3.5"
          />

          {/* Digital LCD Screen Inner Glow */}
          <rect
            x="34"
            y="58"
            width="52"
            height="22"
            rx="3"
            fill="#0066CC"
          />

          {/* Screen Digits 0.00 */}
          <text
            x="60"
            y="74"
            fill="#FFFFFF"
            fontSize="14.5"
            fontFamily="'JetBrains Mono', 'Courier New', monospace"
            fontWeight="bold"
            textAnchor="middle"
            letterSpacing="0.8"
          >
            0.00
          </text>

          {/* Overlapping Certified Checkmark Circle Badge */}
          {/* White border knockout */}
          <circle
            cx="93"
            cy="82"
            r="22"
            fill="#FFFFFF"
          />
          {/* Vibrant Green Badge */}
          <circle
            cx="93"
            cy="82"
            r="18.5"
            fill="#00B074"
          />
          {/* Crisp White Checkmark */}
          <path
            d="M 85 82 L 91 88 L 102 76"
            stroke="#FFFFFF"
            strokeWidth="4.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Brand Text Stack */}
      <div className="flex flex-col justify-center text-left">
        {/* METRA */}
        <span
          className={`text-2xl sm:text-3xl font-black tracking-tight leading-none font-heading ${
            isDark ? 'text-white' : 'text-[#0A2558]'
          }`}
          style={{ letterSpacing: '-0.02em' }}
        >
          METRA
        </span>

        {/* VERIFY */}
        <span
          className="text-2xl sm:text-3xl font-black tracking-tight leading-none text-[#00B074] font-heading mt-0.5"
          style={{ letterSpacing: '-0.02em' }}
        >
          VERIFY
        </span>

        {/* Tagline */}
        {showTagline && (
          <span
            className={`text-[11px] sm:text-xs font-medium tracking-normal mt-1.5 leading-tight ${
              isDark ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            Trusted Weights. Verified Always.
          </span>
        )}
      </div>
    </div>
  );
};

export default MetraLogo;
