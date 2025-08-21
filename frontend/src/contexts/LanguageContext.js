import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    header: {
      title: "Impermanent Loss Calculator",
      subtitle: "Professional DeFi analysis tool for liquidity providers"
    },
    footer: {
      terms: "Terms of Service",
      privacy: "Privacy Policy", 
      refund: "Refund Policy",
      contact: "Contact Us"
    }
  },
  es: {
    header: {
      title: "Calculadora de Pérdida Impermanente",
      subtitle: "Herramienta profesional de análisis DeFi para proveedores de liquidez"
    },
    footer: {
      terms: "Términos de Servicio",
      privacy: "Política de Privacidad",
      refund: "Política de Reembolso", 
      contact: "Contáctanos"
    }
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        return key;
      }
    }
    
    return value;
  };

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
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