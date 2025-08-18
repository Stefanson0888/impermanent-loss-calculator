import React from 'react';

const PrivacyPolicy = ({ darkMode }) => {
  return (
    <div className={`max-w-4xl mx-auto p-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      
      <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`} 
          style={{ fontFamily: 'Orbitron, monospace' }}>
        Privacy Policy
      </h1>
      
      <div className="space-y-6">
        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            1. Information We Collect
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Email addresses:</strong> For account creation and communication</li>
            <li><strong>Payment information:</strong> Processed securely by WayForPay (we don't store card details)</li>
            <li><strong>Usage data:</strong> Analytics to improve our service</li>
            <li><strong>Browser data:</strong> Stored locally for preferences (dark mode, saved calculations)</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide and maintain our service</li>
            <li>Process payments and subscriptions</li>
            <li>Send important updates about your account</li>
            <li>Improve our platform based on usage patterns</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            3. Data Security
          </h2>
          <p>
            We implement industry-standard security measures to protect your personal information. 
            All payment processing is handled by WayForPay using secure encryption. 
            We never store credit card information on our servers.
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            4. Third-Party Services
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>WayForPay:</strong> Payment processing</li>
            <li><strong>CoinGecko API:</strong> Cryptocurrency price data</li>
            <li><strong>DefiLlama API:</strong> DeFi protocol data</li>
            <li><strong>Google Analytics:</strong> Website analytics (anonymized)</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            5. Your Rights
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and data</li>
            <li>Export your data</li>
            <li>Opt out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            6. Cookies and Local Storage
          </h2>
          <p>
            We use browser local storage to save your preferences (theme, calculations) for better user experience. 
            No tracking cookies are used. You can clear this data anytime through your browser settings.
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            7. Contact Us
          </h2>
          <p>
            For privacy-related questions or requests, contact us at: 
            <a href="mailto:privacy@ilcalculator.pro" className="text-blue-500 hover:text-blue-600 ml-1">
              privacy@ilcalculator.pro
            </a>
          </p>
        </section>

        <div className={`text-sm mt-8 pt-4 border-t ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;