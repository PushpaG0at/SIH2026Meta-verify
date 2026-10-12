import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import MetraLogo from '../components/ui/MetraLogo';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/common/LanguageSelector';

export const AuthLayout = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen w-full bg-[#030718] flex flex-col items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden select-none font-sans">
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
      {/* Left Teal-Emerald Ambient Glow */}
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

      {/* Top Floating Utility Bar with Back Link & Language Selector */}
      <div className="absolute top-4 left-4 right-4 max-w-5xl mx-auto flex items-center justify-between z-20">
        <Link
          to="/"
          className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/60 backdrop-blur-md transition-colors"
        >
          <span>←</span>
          <span>{t.backToHome || 'Back to Home'}</span>
        </Link>
        <LanguageSelector variant="dark" />
      </div>

      {/* Header (Above the Panel): Official METRA VERIFY Logo */}
      <div className="w-full max-w-[500px] text-center mb-6 z-10 flex flex-col items-center mt-8 sm:mt-4">
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
      <div className="mt-6 text-center z-10 text-[11px] text-slate-400 font-medium tracking-wide">
        {t.legalNotice || 'Legal Metrology Statutory Verification Portal • Govt. of India'}
      </div>
    </div>
  );
};

export default AuthLayout;
