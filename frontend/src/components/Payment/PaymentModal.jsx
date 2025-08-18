import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, darkMode, selectedPlan }) => {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(selectedPlan || 'pro');

  const plans = {
    pro: {
      name: 'Pro',
      price: 12,
      currency: 'USD',
      features: [
        '✅ All 15+ popular tokens',
        '✅ Live price data',
        '✅ Advanced protocols (V3, Curve)',
        '✅ Historical IL data',
        '✅ Scenario analysis',
        '✅ Email support'
      ]
    },
    pro_plus: {
      name: 'Pro+',
      price: 25,
      currency: 'USD', 
      features: [
        '✅ Everything in Pro',
        '✅ Portfolio dashboard',
        '✅ Smart alerts',
        '✅ Wallet integration',
        '✅ API access',
        '✅ Priority support'
      ]
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`max-w-2xl w-full rounded-2xl shadow-xl border transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`} 
                  style={{ fontFamily: 'Orbitron, monospace' }}>
                ⭐ Upgrade to Pro
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Unlock advanced DeFi analytics
              </p>
            </div>
            <button
              onClick={onClose}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                onClick={() => setCurrentPlan(key)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  currentPlan === key
                    ? darkMode 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-purple-500 bg-purple-50'
                    : darkMode
                      ? 'border-gray-600 hover:border-gray-500'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}
                      style={{ fontFamily: 'Orbitron, monospace' }}>
                    {plan.name}
                  </h4>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ${plan.price}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      /month
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Button */}
          <button
            onClick={() => {/* WayForPay буде тут */}}
            disabled={loading}
            className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
            } shadow-lg hover:shadow-xl`}
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            {loading ? 'Processing...' : `Pay ${plans[currentPlan].price} USD - Start ${plans[currentPlan].name}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;