import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const LanguageContext = createContext();

const RTL_LANGUAGES = ['ku', 'ar'];

function detectBrowserLanguage() {
  const lang = navigator.language || navigator.languages?.[0] || 'en';
  const code = lang.split('-')[0].toLowerCase();
  if (code === 'ku' || code === 'ckb') return 'ku';
  if (code === 'ar') return 'ar';
  return 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('workinger_lang');
    if (saved && translations[saved]) return saved;
    return detectBrowserLanguage();
  });

  const isRTL = RTL_LANGUAGES.includes(lang);

  useEffect(() => {
    localStorage.setItem('workinger_lang', lang);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRTL]);

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const changeLang = (newLang) => {
    if (translations[newLang]) setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
