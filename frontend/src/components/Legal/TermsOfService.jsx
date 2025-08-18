import React from 'react';

const TermsOfService = ({ darkMode }) => {
  return (
    <div className={`max-w-4xl mx-auto p-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
      
      <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`} 
          style={{ fontFamily: 'Orbitron, monospace' }}>
        Terms of Service
      </h1>
      
      <div className="space-y-6">
        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using ILCalculator.pro ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            2. Description of Service
          </h2>
          <p>
            ILCalculator.pro provides DeFi analytics tools, specifically impermanent loss calculations for liquidity providers. 
            The service includes real-time price data, protocol analysis, and portfolio management features.
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            3. User Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You must not use the service for any illegal or unauthorized purpose</li>
            <li>You understand that cryptocurrency investments carry inherent risks</li>
            <li>All investment decisions are made at your own risk</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            4. Payment Terms
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pro subscription: $9.99/month, billed monthly</li>
            <li>Pro+ subscription: $39.99/month, billed monthly</li>
            <li>Enterprise: Custom pricing, billed according to agreement</li>
            <li>All payments are processed securely through WayForPay</li>
            <li>Subscriptions automatically renew unless cancelled</li>
          </ul>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            5. Disclaimer
          </h2>
          <p className="bg-yellow-100 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-300 dark:border-yellow-700">
            <strong>Important:</strong> The information provided by ILCalculator.pro is for educational and informational purposes only. 
            It should not be considered as financial advice. Cryptocurrency investments are highly volatile and risky. 
            Past performance does not guarantee future results. Always do your own research and consult with financial professionals.
          </p>
        </section>

        <section>
          <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
              style={{ fontFamily: 'Orbitron, monospace' }}>
            6. Contact Information
          </h2>
          <p>
            For questions about these Terms of Service, please contact us at: 
            <a href="mailto:legal@ilcalculator.pro" className="text-blue-500 hover:text-blue-600 ml-1">
              legal@ilcalculator.pro
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

export default TermsOfService;