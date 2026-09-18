import React from 'react';

/**
 * Official Digital India Logo representation
 * Styled with iconic tricolor swirls and "Power To Empower" tagline
 */
export const DigitalIndiaLogo = ({ className = "h-8", light = false }) => {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 160 60"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Digital India Logo"
      >
        {/* Tricolor digital spiral icon */}
        <g transform="translate(5, 5)">
          {/* Orange/Saffron arc */}
          <path
            d="M 25,5 A 20,20 0 0,1 45,25 A 20,20 0 0,1 35,42"
            stroke="#f97316"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Blue central spiral */}
          <path
            d="M 25,12 A 13,13 0 0,1 38,25 A 13,13 0 0,1 30,36"
            stroke="#0284c7"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Green lower swirl */}
          <path
            d="M 25,19 A 6,6 0 0,1 31,25 A 6,6 0 0,1 25,31 A 6,6 0 0,1 19,25"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cyan connection ray */}
          <path
            d="M 10,25 C 10,12 18,5 25,5"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* Text "Digital India" */}
        <text
          x="58"
          y="28"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="17"
          fill={light ? "#ffffff" : "#0f172a"}
          letterSpacing="-0.3"
        >
          Digital India
        </text>
        
        {/* Tagline "Power To Empower" */}
        <text
          x="58"
          y="42"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="500"
          fontSize="8.5"
          fill={light ? "#94a3b8" : "#64748b"}
          letterSpacing="0.2"
        >
          Power To Empower
        </text>
      </svg>
    </div>
  );
};

export default DigitalIndiaLogo;
