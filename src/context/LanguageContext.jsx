import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../translations/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('metra_verify_lang');
      return saved === 'हिन्दी' ? 'हिन्दी' : 'English';
    } catch {
      return 'English';
    }
  });

  const setLanguage = (lang) => {
    const validLang = lang === 'हिन्दी' ? 'हिन्दी' : 'English';
    setLanguageState(validLang);
    try {
      localStorage.setItem('metra_verify_lang', validLang);
    } catch {
      // ignore localStorage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'English' ? 'हिन्दी' : 'English');
  };

  const t = translations[language] || translations.English;
  const isHindi = language === 'हिन्दी';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        isHindi
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      language: 'English',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: translations.English,
      isHindi: false
    };
  }
  return context;
};

export default LanguageContext;
