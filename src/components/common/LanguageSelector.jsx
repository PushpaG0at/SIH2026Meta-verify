import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const LanguageSelector = ({ variant = 'dark', className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = variant === 'dark';

  return (
    <div className={`relative inline-block text-xs ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer select-none border ${
          isDark
            ? 'bg-slate-800/90 hover:bg-slate-700/90 text-white border-slate-700 shadow-xs'
            : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
        }`}
        title="Select Language / भाषा चुनें"
      >
        <span className={`font-semibold ${isDark ? 'text-sky-300' : 'text-blue-700'}`}>
          {language}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1.5 w-32 rounded-xl shadow-2xl py-1 z-50 border backdrop-blur-md animate-in fade-in duration-150 ${
            isDark
              ? 'bg-slate-900/95 border-slate-700 text-slate-200'
              : 'bg-white/95 border-slate-200 text-slate-800'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setLanguage('English');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
              language === 'English'
                ? isDark
                  ? 'bg-blue-600/25 text-sky-300 font-bold'
                  : 'bg-blue-50 text-blue-700 font-bold'
                : isDark
                ? 'hover:bg-slate-800 text-slate-300'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span>English</span>
            {language === 'English' && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setLanguage('हिन्दी');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
              language === 'हिन्दी'
                ? isDark
                  ? 'bg-blue-600/25 text-sky-300 font-bold'
                  : 'bg-blue-50 text-blue-700 font-bold'
                : isDark
                ? 'hover:bg-slate-800 text-slate-300'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span>हिन्दी</span>
            {language === 'हिन्दी' && (
              <CheckCircle2 className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-blue-600'}`} />
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
