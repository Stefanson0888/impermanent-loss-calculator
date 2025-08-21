import React, { createContext, useContext, useState } from 'react';
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';

const LanguageContext = createContext();

const translations = {
  en: enTranslations,
  es: esTranslations
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Спробувати отримати мову з localStorage або браузера
    const saved = localStorage.getItem('ilc_language');
    if (saved && translations[saved]) return saved;
    
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en';
  });

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
    }
    
    return value;
  };

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
      localStorage.setItem('ilc_language', newLang);
    }
  };

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      t,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};