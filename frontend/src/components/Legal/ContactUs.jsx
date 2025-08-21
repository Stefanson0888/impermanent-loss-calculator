import React from 'react';
import { Link } from 'react-router-dom';

const ContactUs = ({ darkMode = false }) => {
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
                Contact Us
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
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Refund Policy
            </Link>
            <Link
              to="/contacts"
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
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
            Contact Us
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Contact Information */}
            <div className="space-y-6">
              <section>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    style={{ fontFamily: 'Orbitron, monospace' }}>
                  📧 General Support
                </h2>
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <p><strong>Email:</strong> <a href="mailto:Ilcalculator.pro@gmail.com" className="text-blue-500 hover:text-blue-600">Ilcalculator.pro@gmail.com</a></p>
                  <p><strong>Response time:</strong> Within 24 hours</p>
                  <p><strong>Languages:</strong> English, Ukrainian</p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    style={{ fontFamily: 'Orbitron, monospace' }}>
                  💼 Business & Enterprise
                </h2>
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <p><strong>Email:</strong> <a href="mailto:Ilcalculator.pro@gmail.com" className="text-blue-500 hover:text-blue-600">Ilcalculator.pro@gmail.com</a></p>
                  <p><strong>For:</strong> Enterprise plans, custom quotes, partnerships</p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    style={{ fontFamily: 'Orbitron, monospace' }}>
                  🔒 Privacy & Legal
                </h2>
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <p><strong>Email:</strong> <a href="mailto:Ilcalculator.pro@gmail.com" className="text-blue-500 hover:text-blue-600">Ilcalculator.pro@gmail.com</a></p>
                  <p><strong>For:</strong> Privacy requests, legal questions, GDPR</p>
                </div>
              </section>

              <section>
                <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                    style={{ fontFamily: 'Orbitron, monospace' }}>
                  🌍 Company Information
                </h2>
                <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                  <p><strong>Company:</strong> ILCalculator Pro</p>
                  <p><strong>Location:</strong> Ukraine</p>
                  <p><strong>Website:</strong> <a href="https://ilcalculator.pro" className="text-blue-500 hover:text-blue-600">ilcalculator.pro</a></p>
                </div>
              </section>
            </div>

            {/* Quick Contact Form */}
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                📝 Quick Message
              </h2>
              
              <div className={`p-6 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Subject
                    </label>
                    <select className={`w-full px-3 py-2 rounded-lg border ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}>
                      <option>General Question</option>
                      <option>Technical Support</option>
                      <option>Billing Issue</option>
                      <option>Feature Request</option>
                      <option>Partnership Inquiry</option>
                      <option>Bug Report</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Your Email
                    </label>
                    <input 
                      type="email" 
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Message
                    </label>
                    <textarea 
                      rows="4"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`}
                      placeholder="Describe your question or issue..."
                    ></textarea>
                  </div>

                  <button
                    onClick={() => {
                      // Тимчасово просто відкриваємо email
                      window.open('mailto:ilcalculator.pro@gmail.com?subject=Contact Form Message');
                    }}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    style={{ fontFamily: 'Orbitron, monospace' }}
                  >
                    📧 Send Message
                  </button>
                </div>
              </div>

              <div className={`mt-6 p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-blue-900/20 border-blue-500/50' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                  <strong>💡 Pro Tip:</strong> For faster support, include your subscription plan and order reference if applicable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;