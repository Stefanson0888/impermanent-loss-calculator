import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguagePicker = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, availableLanguages } = useLanguage();

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 min-h-[64px] min-w-[64px] rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${
          darkMode
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="Change Language"
      >
        <div className="text-xl">
          {currentLanguage?.flag || '🌍'}
        </div>
        <span 
          className="text-xs font-bold tracking-wider"
          style={{ fontFamily: 'Orbitron, monospace' }}
        >
          {language.toUpperCase()}
        </span>
      </button>

      {isOpen && (
        <div className={`fixed top-20 right-6 z-[9999] rounded-lg shadow-lg border min-w-[150px] ${
          darkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors ${
                language === lang.code
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-500 text-white'
                  : darkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
              } ${lang === availableLanguages[0] ? 'rounded-t-lg' : ''} ${
                lang === availableLanguages[availableLanguages.length - 1] ? 'rounded-b-lg' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-sm">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguagePicker;