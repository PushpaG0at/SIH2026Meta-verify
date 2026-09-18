import React from 'react';

/**
 * State Emblem of India (Lion Capital of Ashoka)
 * Styled for official Government of India portal headers and footers
 */
export const EmblemIndia = ({ className = "w-10 h-12", variant = "dark" }) => {
  const isLight = variant === "light";
  const strokeColor = isLight ? "#ffffff" : "#1f2937";
  const fillColor = isLight ? "#f8fafc" : "#374151";

  return (
    <svg
      viewBox="0 0 100 125"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Emblem of India"
    >
      {/* Central Lion Head */}
      <path
        d="M50 12 C44 12 39 16 38 22 C37 28 41 33 44 35 C42 38 41 42 41 47 C41 53 44 57 50 57 C56 57 59 53 59 47 C59 42 58 38 56 35 C59 33 63 28 62 22 C61 16 56 12 50 12 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Left Lion Head */}
      <path
        d="M36 24 C31 22 25 24 23 30 C21 35 23 41 27 44 C26 48 26 52 28 56 C31 60 36 61 40 59 C39 53 38 47 38 42 C35 40 33 36 34 31 C35 28 36 26 36 24 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Right Lion Head */}
      <path
        d="M64 24 C69 22 75 24 77 30 C79 35 77 41 73 44 C74 48 74 52 72 56 C69 60 64 61 60 59 C61 53 62 47 62 42 C65 40 67 36 66 31 C65 28 64 26 64 24 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      {/* Lion Facial details */}
      <circle cx="46" cy="24" r="1.5" fill={strokeColor} />
      <circle cx="54" cy="24" r="1.5" fill={strokeColor} />
      <path d="M48 29 Q50 31 52 29" stroke={strokeColor} strokeWidth="1.2" fill="none" />
      <path d="M45 35 Q50 39 55 35" stroke={strokeColor} strokeWidth="1.5" fill="none" />
      
      {/* Abacus Base */}
      <rect x="20" y="60" width="60" height="14" rx="2" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
      
      {/* Ashoka Dharma Chakra in center of abacus */}
      <circle cx="50" cy="67" r="5" stroke={isLight ? "#38bdf8" : "#0284c7"} strokeWidth="1.2" fill="none" />
      <circle cx="50" cy="67" r="1" fill={isLight ? "#38bdf8" : "#0284c7"} />
      <line x1="50" y1="62" x2="50" y2="72" stroke={isLight ? "#38bdf8" : "#0284c7"} strokeWidth="0.8" />
      <line x1="45" y1="67" x2="55" y2="67" stroke={isLight ? "#38bdf8" : "#0284c7"} strokeWidth="0.8" />
      <line x1="46.5" y1="63.5" x2="53.5" y2="70.5" stroke={isLight ? "#38bdf8" : "#0284c7"} strokeWidth="0.8" />
      <line x1="46.5" y1="70.5" x2="53.5" y2="63.5" stroke={isLight ? "#38bdf8" : "#0284c7"} strokeWidth="0.8" />
      
      {/* Bull on right, Horse on left silhouettes */}
      <path d="M26 65 Q28 63 32 66 Q34 68 31 70 Z" fill={strokeColor} />
      <path d="M74 65 Q72 63 68 66 Q66 68 69 70 Z" fill={strokeColor} />
      
      {/* Lotus Bell Base */}
      <path
        d="M24 74 C30 84 70 84 76 74 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1.5"
      />
      <path d="M35 74 Q50 82 65 74" stroke={strokeColor} strokeWidth="1" fill="none" />

      {/* Motto Pedestal Base */}
      <rect x="22" y="86" width="56" height="5" rx="1" fill={fillColor} stroke={strokeColor} strokeWidth="1.2" />
      
      {/* Satyameva Jayate */}
      <text
        x="50"
        y="100"
        textAnchor="middle"
        fontSize="8"
        fontFamily="serif"
        fontWeight="bold"
        fill={strokeColor}
        letterSpacing="0.5"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
};

export default EmblemIndia;
