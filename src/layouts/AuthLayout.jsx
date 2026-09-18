import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import MetraLogo from '../components/ui/MetraLogo';

export const AuthLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen w-full bg-[#030718] flex flex-col items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden select-none font-sans">
      {/* Authoritative Sovereign Space-Blue Base Gradient */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 110% 90% at 50% 15%, #0a1b42 0%, #050c24 50%, #020512 100%)'
        }}
      />

      {/* Subtle Digital Security Grid (GovTech & Statutory Registry Infrastructure) */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '44px 44px'
        }}
      />

      {/* Refined, Simple Professional Ambient Light Flares */}
      {/* Left Teal-Emerald Ambient Glow (complementing Verified green logo) */}
      <div 
        className="absolute -left-28 top-1/4 w-[480px] h-[480px] rounded-full pointer-events-none blur-[140px] opacity-25 z-0"
        style={{ background: 'radial-gradient(circle, #00b074 0%, #0284c7 45%, transparent 70%)' }}
      />

      {/* Bottom-Left Deep Royal Blue Ambient Glow */}
      <div 
        className="absolute -left-16 bottom-0 w-[520px] h-[520px] rounded-full pointer-events-none blur-[150px] opacity-30 z-0"
        style={{ background: 'radial-gradient(circle, #1d4ed8 0%, #1e3a8a 50%, transparent 70%)' }}
      />

      {/* Right Soft Blue Institutional Aura */}
      <div 
        className="absolute -right-24 top-1/3 w-[460px] h-[460px] rounded-full pointer-events-none blur-[150px] opacity-20 z-0"
        style={{ background: 'radial-gradient(circle, #0284c7 0%, #0f172a 55%, transparent 70%)' }}
      />

      {/* Subtle Center Bottom Reflection */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-[560px] h-[260px] rounded-full pointer-events-none blur-[130px] opacity-20 z-0"
        style={{ background: 'radial-gradient(ellipse, #38bdf8 0%, #0284c7 40%, transparent 70%)' }}
      />

      {/* Subtle Clean Star Accent on Lower Right */}
      <div className="absolute right-[16%] sm:right-[20%] bottom-[15%] sm:bottom-[17%] pointer-events-none z-0 opacity-30 hidden sm:block">
        <svg 
          className="w-6 h-6 text-sky-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6L12 0Z" />
        </svg>
      </div>

      {/* Header (Above the Panel): Official METRA VERIFY Logo */}
      <div className="w-full max-w-[500px] text-center mb-6 z-10 flex flex-col items-center">
        <Link 
          to="/" 
          className="inline-flex items-center group transition-transform hover:scale-[1.02]"
          title="METRA-VERIFY Home"
        >
          <MetraLogo variant="dark" showTagline={true} iconSize={64} />
        </Link>
      </div>

      {/* Main Container: Centered frosted-glass panel */}
      <div 
        className={`w-full z-10 rounded-[28px] p-6 sm:p-9 relative transition-all duration-300 ${
          isLoginPage ? 'max-w-[500px]' : 'max-w-[600px]'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.07)',
          backdropFilter: 'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: '0 24px 60px -10px rgba(0, 0, 0, 0.65), inset 0 1px 1px 0 rgba(255, 255, 255, 0.28), 0 0 40px -10px rgba(14, 165, 233, 0.15)'
        }}
      >
        <Outlet />
      </div>

      {/* Subtle Statutory Verification Tagline at the very bottom */}
      <div className="mt-6 text-center z-10 text-[11px] text-slate-500 font-medium tracking-wide">
        Legal Metrology Statutory Verification Portal • Govt. of India
      </div>
    </div>
  );
};

export default AuthLayout;
