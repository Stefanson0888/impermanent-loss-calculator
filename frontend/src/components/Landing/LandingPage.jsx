import React, { useState } from 'react';

function LandingPage({ darkMode, onGetStarted }) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // TODO: Інтеграція з email сервісом
    console.log('Email submitted:', email);
    setIsSubmitted(true);
    
    // Автоматично переходимо до калькулятора через 2 секунди
    setTimeout(() => {
      onGetStarted();
    }, 2000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
    }`}>
      
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Stop Losing Money on 
            <span className="text-gradient bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"> DeFi</span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 transition-colors duration-300 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Calculate Impermanent Loss before you invest in liquidity pools
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              <span>✅</span>
              <span>Real-time data</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
            }`}>
              <span>🚀</span>
              <span>15+ Protocols</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'
            }`}>
              <span>💯</span>
              <span>Free forever</span>
            </div>
          </div>
        </div>

        {/* Problem Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div>
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Are You Losing Money in DeFi Pools?
            </h2>
            <div className="space-y-4">
            <div className={`flex items-start gap-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="text-red-500 mt-1">❌</span>
                <span>Entered a pool at ETH $2000, exited when ETH hit $4000, but still lost money?</span>
            </div>
            <div className={`flex items-start gap-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="text-red-500 mt-1">❌</span>
                <span>Confused by complex APY calculations and "impermanent loss" warnings?</span>
            </div>
            <div className={`flex items-start gap-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <span className="text-red-500 mt-1">❌</span>
                <span>Wish you could predict LP performance before investing your money?</span>
            </div>
            </div>
        </div>
        
        <div className={`p-8 rounded-2xl ${darkMode ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
            <div className="text-center">
            <div className="text-4xl mb-4">😱</div>
            <div className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                $2.4 Billion Lost
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Amount lost to impermanent loss in 2023 across all DeFi protocols
            </div>
            </div>
        </div>
        </div>

        {/* Solution Section */}
        <div className="mb-24">
        <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Calculate Before You Invest
            </h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our calculator shows exact IL scenarios across 15+ protocols
            </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-3xl mb-4">📊</div>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Real-Time Data
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Live prices from CoinGecko and pool data from DefiLlama
            </p>
            </div>
            
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-3xl mb-4">🔧</div>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Multi-Protocol
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Uniswap V2/V3, Curve, Balancer, PancakeSwap and more
            </p>
            </div>
            
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="text-3xl mb-4">💡</div>
            <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Learn DeFi
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Comprehensive guides and educational content
            </p>
            </div>
        </div>
        </div>
        
        {/* CTA Section */}
        <div className={`text-center py-16 px-8 rounded-2xl ${
          darkMode ? 'bg-gray-800/50' : 'bg-white/50'
        } backdrop-blur-md border ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          
          <h2 className={`text-3xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to Calculate Your Risk?
          </h2>
          
          <p className={`text-lg mb-8 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Get updates on new features and DeFi strategies
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                  }`}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="text-green-500 text-2xl mb-2">✅</div>
              <p className="text-green-500 font-semibold">Thanks! Redirecting to calculator...</p>
            </div>
          )}
          
          <button
            onClick={onGetStarted}
            className={`mt-4 text-sm underline ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            } transition-colors duration-300`}
          >
            Skip and go directly to calculator →
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;