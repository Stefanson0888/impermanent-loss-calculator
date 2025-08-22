import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useLanguage } from '../contexts/LanguageContext';

const LanguagePicker = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, availableLanguages } = useLanguage();
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const currentLanguage = availableLanguages.find(lang => lang.code === language);

  // Обчислюємо позицію дропдауну при відкритті
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY + 8, // 8px відступ вниз
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Закриття по кліку поза дропдауном
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      <div className="relative">
        <button
          ref={buttonRef}
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
      </div>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className={`absolute border rounded-lg shadow-lg overflow-hidden ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            minWidth: `${Math.max(coords.width, 150)}px`,
            zIndex: 9999
          }}
        >
          {availableLanguages.map((lang, idx) => (
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
              } ${idx === 0 ? 'rounded-t-lg' : ''} ${
                idx === availableLanguages.length - 1 ? 'rounded-b-lg' : ''
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-sm">✓</span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </>
  );
};

export default LanguagePicker;
