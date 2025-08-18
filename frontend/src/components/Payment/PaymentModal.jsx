import React, { useState } from 'react';

const PaymentModal = ({ isOpen, onClose, darkMode, selectedPlan }) => {
  const [loading, setLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(selectedPlan || 'pro');

  const handleWayForPayment = () => {
    setLoading(true);
    
    const plan = plans[currentPlan];
    const orderReference = `ILC_${Date.now()}_${currentPlan}`;
    
    const wayforpay = new Wayforpay();
    wayforpay.run({
      merchantAccount: "test_merch_n1", // Тестовий merchant
      merchantDomainName: "ilcalculator.pro",
      orderReference: orderReference,
      orderDate: Math.floor(Date.now() / 1000),
      amount: plan.price,
      currency: "USD",
      productName: [`ILCalculator.pro ${plan.name} Plan`],
      productCount: [1],
      productPrice: [plan.price],
      language: "EN",
      returnUrl: "https://ilcalculator.pro/success",
      serviceUrl: "https://ilcalculator.pro/webhook"
    }, 
    function (response) {
      // Success callback
      setLoading(false);
      alert("🎉 Payment successful! Welcome to Pro!");
      onClose();
    },
    function (response) {
      // Error callback  
      setLoading(false);
      alert("❌ Payment failed. Please try again.");
    });
  };


  const plans = {
    pro: {
      name: 'Pro',
      price: 9.99,
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
      price: 39.99,
      currency: 'USD',
      features: [
        '✅ Everything in Pro',
        '✅ Portfolio dashboard',
        '✅ Smart alerts', 
        '✅ Wallet integration',
        '✅ API access',
        '✅ Priority support'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 'Custom',
      currency: '',
      features: [
        '✅ Everything in Pro+',
        '✅ White-label solution',
        '✅ Custom integrations',
        '✅ Dedicated support',
        '✅ SLA guarantee',
        '✅ On-premise deployment'
      ]
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border transition-colors duration-300 ${
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
          <div className="grid grid-cols-1 gap-4 mb-6">
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
                onClick={() => {
                    if (currentPlan === 'enterprise') {
                    // Відкриваємо email для запиту рахунку
                    window.open('mailto:billing@ilcalculator.pro?subject=Enterprise Plan - Request Invoice&body=Hello,%0D%0A%0D%0AI am interested in the Enterprise plan for ILCalculator.pro.%0D%0A%0D%0ACompany: %0D%0AContact person: %0D%0AEmail: %0D%0AExpected users: %0D%0ASpecial requirements: %0D%0A%0D%0APlease send me a custom quote.%0D%0A%0D%0AThank you!');
                     } else {
                        // WayForPay для інших планів
                        handleWayForPayment();
                    }
                }}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                    currentPlan === 'enterprise'
                    ? darkMode
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                    : darkMode
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
                } shadow-lg hover:shadow-xl`}
                style={{ fontFamily: 'Orbitron, monospace' }}
                >
                {loading ? 'Processing...' : 
                currentPlan === 'enterprise' 
                    ? '📧 Request Invoice & Custom Quote'
                    : `💳 Pay $${plans[currentPlan].price} - Start ${plans[currentPlan].name}`
                }
            </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;