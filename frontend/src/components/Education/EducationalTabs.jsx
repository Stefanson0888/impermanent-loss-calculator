import React, { useState } from 'react';
import LearnSection from './LearnSection';
import FAQSection from './FAQSection';
import GlossarySection from './GlossarySection';

function EducationalTabs({ darkMode }) {
    const [activeTab, setActiveTab] = useState('learn');
  
    const tabs = [
      { id: 'learn', name: 'Learn', icon: '📚' },
      { id: 'faq', name: 'FAQ', icon: '❓' },
      { id: 'glossary', name: 'Glossary', icon: '📖' }
    ];
  
    return (
      <div className="p-8">
        
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? darkMode
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-purple-600 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
  
        
        <div className="space-y-6">
          {activeTab === 'learn' && <LearnSection darkMode={darkMode} />}
          {activeTab === 'faq' && <FAQSection darkMode={darkMode} />}
          {activeTab === 'glossary' && <GlossarySection darkMode={darkMode} />}
        </div>
      </div>
    );
}

export default EducationalTabs;