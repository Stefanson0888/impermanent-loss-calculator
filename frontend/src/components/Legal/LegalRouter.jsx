import React, { useState } from 'react';
import TermsOfService from './TermsOfService';
import PrivacyPolicy from './PrivacyPolicy';
import RefundPolicy from './RefundPolicy';
import ContactUs from './ContactUs';

const LegalRouter = ({ darkMode, onBack }) => {
  const [currentPage, setCurrentPage] = useState('terms');

  const pages = {
    terms: { component: TermsOfService, title: 'Terms of Service' },
    privacy: { component: PrivacyPolicy, title: 'Privacy Policy' },
    refund: { component: RefundPolicy, title: 'Refund Policy' },
    contact: { component: ContactUs, title: 'Contact Us' }
  };

  const CurrentComponent = pages[currentPage].component;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }`}>
      
      {/* Header */}
      <div className={`border-b shadow-sm transition-colors duration-300 ${
        darkMode 
          ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' 
          : 'bg-white/90 backdrop-blur-md border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                ← Back to Calculator
              </button>
              
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                {pages[currentPage].title}
              </h1>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex flex-wrap gap-2 mt-4">
            {Object.entries(pages).map(([key, page]) => (
              <button
                key={key}
                onClick={() => setCurrentPage(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  currentPage === key
                    ? darkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-600 text-white'
                    : darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {page.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`rounded-2xl shadow-xl border transition-colors duration-300 max-w-6xl mx-auto mt-8 mb-8 ${
        darkMode 
          ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' 
          : 'bg-white/90 backdrop-blur-md border-gray-200'
      }`}>
        <CurrentComponent darkMode={darkMode} />
      </div>
    </div>
  );
};

export default LegalRouter;