import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = ({ darkMode = false }) => {
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
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                ← Back to Calculator
              </Link>
              
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                Refund Policy
              </h1>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Link
              to="/terms"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/refund"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
              }`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Refund Policy
            </Link>
            <Link
              to="/contacts"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`rounded-2xl shadow-xl border transition-colors duration-300 max-w-6xl mx-auto mt-8 mb-8 ${
        darkMode 
          ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' 
          : 'bg-white/90 backdrop-blur-md border-gray-200'
      }`}>
        <div className={`max-w-4xl mx-auto p-8 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          
          <h1 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`} 
              style={{ fontFamily: 'Orbitron, monospace' }}>
            Refund Policy
          </h1>
          
          <div className="space-y-6">
            <section>
              <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                1. Refund Eligibility
              </h2>
              <p className="mb-4">
                We offer refunds under the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>7-day money-back guarantee:</strong> Full refund if requested within 7 days of purchase</li>
                <li><strong>Technical issues:</strong> If our service is unavailable for more than 24 hours</li>
                <li><strong>Billing errors:</strong> Incorrect charges or duplicate payments</li>
                <li><strong>Subscription cancellation:</strong> Unused portion of annual subscriptions</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                2. Non-Refundable Items
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Partial months of service already used</li>
                <li>Enterprise consulting services (custom agreements apply)</li>
                <li>Refunds requested after 30 days from purchase</li>
                <li>Violations of Terms of Service</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                3. How to Request a Refund
              </h2>
              <div className={`p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-blue-900/20 border-blue-700' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className="mb-3"><strong>To request a refund:</strong></p>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Email us at <a href="mailto:Ilcalculator.pro@gmail.com" className="text-blue-500 hover:text-blue-600">Ilcalculator.pro@gmail.com</a></li>
                  <li>Include your order reference number</li>
                  <li>Specify the reason for refund request</li>
                  <li>We'll respond within 24 hours</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                4. Refund Processing Time
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Credit/Debit Cards:</strong> 3-5 business days</li>
                <li><strong>PayPal:</strong> 1-2 business days</li>
                <li><strong>Bank Transfer:</strong> 5-7 business days</li>
              </ul>
              <p className="mt-3 text-sm italic">
                Processing times may vary depending on your bank or payment provider.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                5. Subscription Cancellation
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You can cancel your subscription anytime from your account settings</li>
                <li>Cancellation takes effect at the end of current billing period</li>
                <li>No refund for the current month unless within 7-day guarantee period</li>
                <li>Your data will be retained for 30 days after cancellation</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                6. Disputes and Chargebacks
              </h2>
              <p>
                Before initiating a chargeback with your bank, please contact us directly. 
                We're committed to resolving any issues quickly and fairly. 
                Chargebacks may result in account suspension pending resolution.
              </p>
            </section>

            <section>
              <h2 className={`text-xl font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                7. Contact Information
              </h2>
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <p><strong>Refund Support:</strong></p>
                <p>Email: <a href="mailto:ilcalculator.pro@gmail.com" className="text-blue-500 hover:text-blue-600">ilcalculator.pro@gmail.com</a></p>
                <p>Response time: Within 24 hours</p>
                <p>Business hours: Monday-Friday, 9 AM - 6 PM (UTC+2)</p>
              </div>
            </section>

            <div className={`text-sm mt-8 pt-4 border-t ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;