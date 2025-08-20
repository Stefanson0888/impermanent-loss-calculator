import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import axios from 'axios';
import { useAnalytics } from './hooks/useAnalytics';
import { CoinGeckoAPI, DefiLlamaAPI } from './services/api';

import { TOKEN_ID_MAPPING, POPULAR_TOKENS } from './data/tokens';
import { POPULAR_POOLS, POPULAR_POOLS_APY, getRiskColor } from './data/pools';
import { EXPANDED_PROTOCOLS } from './data/protocols';

import { calculateILAdvanced } from './services/calculations/impermanentLoss';

// Компоненти
import AllPoolsSelector from './components/Pools/AllPoolsSelector';
import ScenarioTable from './components/Analysis/ScenarioTable';
import EducationalTabs from './components/Education/EducationalTabs';

import useLocalStorage from './hooks/useLocalStorage';
import LandingPage from './components/Landing/LandingPage';

import PaymentModal from './components/Payment/PaymentModal';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import TermsOfService from './components/Legal/TermsOfService';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import RefundPolicy from './components/Legal/RefundPolicy';
import ContactUs from './components/Legal/ContactUs';


// Імпорт Google Fonts
const googleFontsLink = document.createElement('link');
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap';
googleFontsLink.rel = 'stylesheet';
document.head.appendChild(googleFontsLink);

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

function AppContent() {
  const {
    trackCalculation,
    trackTokenSelect,
    trackPriceInput,
    trackDonation,
    trackEvent
  } = useAnalytics();

  const [selectedPool, setSelectedPool] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [oldPrice, setOldPrice] = useLocalStorage('ilc_oldPrice', '');
  const [newPrice, setNewPrice] = useLocalStorage('ilc_newPrice', '');
  const [initialInvestment, setInitialInvestment] = useLocalStorage('ilc_investment', '');
  const [poolAPY, setPoolAPY] = useLocalStorage('ilc_poolAPY', '');
  const [selectedProtocol, setSelectedProtocol] = useLocalStorage('ilc_protocol', 'uniswap-v2');
  const [selectedToken, setSelectedToken] = useLocalStorage('ilc_token', '');
  const { darkMode, setDarkMode } = useTheme();
  
  // Нові стейти для API даних
  const [tokenPrice, setTokenPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [livePools, setLivePools] = useState([]);
  const [loadingPools, setLoadingPools] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showPools, setShowPools] = useState(false);

  const [showCustom, setShowCustom] = useState(false);
  const [hasVisited, setHasVisited] = useLocalStorage('ilc_hasVisited', false);
  const showLanding = !hasVisited;
  const [showToast, setShowToast] = useState(false);
  const [showThemeToast, setShowThemeToast] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro'); // 'pro' або 'pro_plus'
  const [showLegalPages, setShowLegalPages] = useState(false);

  // Автозаповнення ціни при виборі токена
  const handleTokenSelect = async (token) => {
    setSelectedToken(token);
    trackTokenSelect(`${token}/USDT`);
    
    if (token && TOKEN_ID_MAPPING[token]) {
      setLoadingPrice(true);
      try {
        const priceData = await CoinGeckoAPI.getTokenPrice(TOKEN_ID_MAPPING[token]);
        setTokenPrice(priceData);
        
        // Автозаповнення поточної ціни
        if (priceData.price > 0) {
          setNewPrice(priceData.price.toString());
        }
        
        setLastUpdated(priceData.lastUpdated);
        
        // Шукаємо пули для цього токена
        setLoadingPools(true);
        const pools = await DefiLlamaAPI.findPoolsForPair(token, 'USDT');
        setLivePools(pools);
        setLoadingPools(false);
        
      } catch (error) {
        console.error('Error fetching token data:', error);
      } finally {
        setLoadingPrice(false);
      }
    } else {
      setTokenPrice(null);
      setLivePools([]);
    }

    if (pools.length > 0) {
      setShowPools(true);
    }
  };

  const handleGetStarted = () => {
    setHasVisited(true);
  };

  const handleClearAll = () => {
    const confirmed = window.confirm('Clear all saved data? This will reset all fields.');
    
    if (confirmed) {
      // Очищаємо всі збережені дані
      setOldPrice('');
      setNewPrice('');
      setInitialInvestment('');
      setPoolAPY('');
      setSelectedProtocol('uniswap-v2');
      setSelectedToken('');
      
      // Очищаємо живі дані
      setTokenPrice(null);
      setLivePools([]);
      setResult(null);
      setLastUpdated(null);
      
      // Показуємо тост
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000); // Зникне через 2 секунди
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    trackCalculation(
      selectedToken || 'Custom',
      'USDT',
      parseFloat(oldPrice),
      parseFloat(newPrice),
      Math.abs(parseFloat(newPrice) - parseFloat(oldPrice)) / parseFloat(oldPrice) * 100
    );
    
    try {
      const res = await axios.post('https://impermanent-loss-calculator-api.vercel.app/calculate', {
        oldPrice: parseFloat(oldPrice),
        newPrice: parseFloat(newPrice),
        initialInvestment: parseFloat(initialInvestment) || 0,
        poolAPY: parseFloat(poolAPY) || 0,
        protocolType: selectedProtocol
      });
      setResult(res.data);
    } catch (err) {
      alert(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const isLegalPage = location.pathname.includes('/terms') || 
                   location.pathname.includes('/privacy') || 
                   location.pathname.includes('/refund') || 
                   location.pathname.includes('/contacts');

  return (
    <>
      {showLanding ? (
        <LandingPage 
          darkMode={darkMode}
          onGetStarted={handleGetStarted}
        />
      ) : (
        <div className={`min-h-screen transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
            : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
        }`}>
          
          <div className={`border-b shadow-sm transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' 
              : 'bg-white/90 backdrop-blur-md border-gray-200'
          }`}>
            <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:justify-between sm:items-center">
                <div>
                  <h1 className={`text-lg sm:text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`} style={{ fontFamily: 'Orbitron, monospace' }}>
                    Impermanent Loss Calculator
                  </h1>
                  <p className={`text-sm mt-1 transition-colors duration-300 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Professional DeFi analysis tool for liquidity providers
                  </p>
                </div>
                
                <div className="flex items-center justify-center sm:justify-end gap-3">

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className={`p-2 min-h-[64px] min-w-[64px] rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-red-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-red-500'
                  }`}
                  title="Upgrade to Pro - Unlock all features"
                >
                  <div className="w-5 h-5 flex items-center justify-center text-lg text-red-500">
                    ⭐
                  </div>
                  <span className={`text-xs font-bold tracking-wider text-white`} style={{ 
                    fontFamily: 'Orbitron, monospace',
                    textShadow: '0 0 8px rgba(147, 51, 234, 0.8)'
                  }}>
                    PRO
                  </span>
                </button>

                <button
                  onClick={handleClearAll}
                  className={`p-2 min-h-[64px] min-w-[64px] rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-red-400'
                      : 'bg-gray-100 hover:bg-gray-200 text-red-500'
                  }`}
                  title="Clear all saved data - Reset the Force"
                >
                  <div className="w-5 h-5 flex items-center justify-center text-lg">
                  🗲
                  </div>
                  <span className={`text-xs font-bold tracking-wider ${
                    darkMode ? 'text-red-400' : 'text-red-500'
                  }`} style={{ 
                    fontFamily: 'Orbitron, monospace',
                    textShadow: '0 0 8px #ef4444'
                  }}>
                    RESET
                  </span>
                </button>

                  <button
                    className={`p-2 min-h-[64px] min-w-[64px] rounded-xl transition-all duration-300 flex flex-col items-center gap-1 ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400'
                        : 'bg-gray-100 hover:bg-gray-200 text-yellow-500'
                    }`}
                    title={darkMode ? 'Switch to Light Side' : 'Join the Dark Side'}
                    onClick={() => {
                      setDarkMode(!darkMode);
                      
                      if (!darkMode) {
                        setShowThemeToast(true);
                        setTimeout(() => {
                          setShowThemeToast(false);
                        }, 3000);
                      }
                      
                      trackEvent({
                        action: 'toggle_theme',
                        category: 'ui', 
                        label: !darkMode ? 'dark' : 'light'
                      });
                    }}
                  >
                    {darkMode ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                      </svg>
                    )}
                    <span className={`text-xs font-bold tracking-wider ${
                      darkMode ? 'text-blue-400' : 'text-red-400'
                    }`} style={{ 
                      fontFamily: 'Orbitron, monospace',
                      textShadow: darkMode ? '0 0 10px #60a5fa' : '0 0 10px #ef4444'
                    }}>
                      {darkMode ? 'LIGHT' : 'DARK'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
      
          <div className="max-w-6xl mx-auto px-6 py-12">
            <div className={`rounded-2xl shadow-xl border transition-colors duration-300 overflow-hidden ${
              darkMode 
                ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' 
                : 'bg-white/90 backdrop-blur-md border-gray-200'
            }`}>
              
              <div className={`p-8 border-b transition-colors duration-300 ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`} style={{ fontFamily: 'Orbitron, monospace' }}>
                      Parameters
                      <span className="text-green-500 ml-2 text-sm">🌐 LIVE DATA</span>
                    </h2>
                    <p className={`text-sm transition-colors duration-300 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Enter your position details
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className={`block text-sm font-semibold mb-3 h-12 flex items-end transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      🔧 AMM Protocol
                      <span className="text-purple-500 ml-1 text-xs">MULTI-PROTOCOL</span>
                    </label>
                    
                    <select
                      value={selectedProtocol}
                      onChange={(e) => setSelectedProtocol(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      }`}
                    >
                      <optgroup label="🦄 Classic AMM">
                        <option value="uniswap-v2">Uniswap V2</option>
                        <option value="sushiswap">SushiSwap</option>
                      </optgroup>
                      <optgroup label="📊 Concentrated Liquidity">
                        <option value="uniswap-v3">Uniswap V3</option>
                        <option value="pancakeswap-v3">PancakeSwap V3</option>
                        <option value="algebra">Algebra Finance</option>
                      </optgroup>
                      <optgroup label="🌀 Stablecoin AMM">
                        <option value="curve-stable">Curve StableSwap</option>
                        <option value="balancer-stable">Balancer StablePool</option>
                      </optgroup>
                      <optgroup label="⚖️ Weighted Pools">
                        <option value="balancer-weighted">Balancer Weighted</option>
                      </optgroup>
                    </select>
                  </div>

                  <div className="mb-6 relative">
                    <label className={`block text-sm font-semibold mb-3 h-12 flex items-end transition-colors duration-300 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Select Token (Optional)
                      <span className="text-green-500 ml-2 text-xs">🔴 LIVE PRICES</span>
                    </label>
                    
                    <select
                      value={selectedToken}
                      onChange={(e) => handleTokenSelect(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      }`}
                    >
                      <option value="">Choose a token for live price data</option>
                      {Object.entries(POPULAR_TOKENS).map(([symbol, data]) => (
                        <option key={symbol} value={symbol}>
                          {symbol} - {data.name}
                        </option>
                      ))}
                    </select>

                    {/* Live Price Display */}
                    {loadingPrice && (
                      <div className={`mt-3 p-3 rounded-lg border ${
                        darkMode ? 'bg-blue-900/20 border-blue-500/50' : 'bg-blue-50 border-blue-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Fetching live price data...</span>
                        </div>
                      </div>
                    )}
                    
                    {tokenPrice && !loadingPrice && (
                      <div className={`mt-3 p-4 rounded-lg border transition-colors duration-300 ${
                        darkMode ? 'bg-purple-900/20 border-purple-500/50' : 'bg-purple-50 border-purple-300'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">💰</div>
                            <div>
                              <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                ${tokenPrice.price?.toLocaleString() || 'N/A'}
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Current {selectedToken} Price
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-6 text-sm">
                            <div className="text-center">
                              <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                                24h Change
                              </div>
                              <div className={`font-bold ${
                                tokenPrice.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {tokenPrice.change24h >= 0 ? '+' : ''}{tokenPrice.change24h?.toFixed(2)}%
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Market Cap
                              </div>
                              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                ${(tokenPrice.marketCap / 1e9)?.toFixed(1)}B
                              </div>
                            </div>
                            
                            <div className="text-center">
                              <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Updated
                              </div>
                              <div className="text-green-500 font-semibold text-xs">
                                {lastUpdated}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {tokenPrice.error && (
                          <div className="mt-2 text-red-500 text-sm">
                            ⚠️ {tokenPrice.error}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Live Pools */}
                    {loadingPools && selectedToken && (
                      <div className={`mt-3 p-3 rounded-lg border ${
                        darkMode ? 'bg-purple-900/20 border-purple-500/50' : 'bg-purple-50 border-purple-300'
                      }`}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Finding best pools for {selectedToken}...</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedToken && livePools.length > 0 && !loadingPools && showPools && (
                      <div className={`mt-3 absolute top-full left-0 right-0 z-10 p-4 rounded-lg border transition-colors duration-300 ${
                        darkMode ? 'bg-purple-900/20 border-purple-500/50' : 'bg-purple-50 border-purple-300'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="text-lg">🏊‍♂️</div>
                            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                              Top {selectedToken} Pools ({livePools.length} found)
                            </div>
                          </div>
                          <button
                            onClick={() => setShowPools(false)}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                              darkMode 
                                ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                            }`}
                          >
                            ×
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {livePools.slice(0, 6).map((pool, index) => (
                            <div
                              key={index}
                              onClick={() => {
                                setPoolAPY(pool.apy.toFixed(1));
                                setShowPools(false);
                              }}
                              className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                                darkMode
                                  ? 'border-gray-600 bg-gray-700/50 hover:border-purple-500'
                                  : 'border-gray-300 bg-white hover:border-purple-500'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                                    {pool.symbol}
                                  </div>
                                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {pool.protocol} • {pool.chain}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-green-500 font-bold text-sm">
                                    {pool.apy.toFixed(1)}%
                                  </div>
                                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    APY
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex justify-between text-xs">
                                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  TVL: ${(pool.tvl / 1e6).toFixed(1)}M
                                </div>
                                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Click to use APY
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          💡 Click any pool to auto-fill APY. Data from DefiLlama.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Initial Price */}
                    <div>
                      <div className="h-10 flex flex-col justify-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Initial Price ($)
                          </span>
                          {selectedToken && <span className="text-blue-500">[{selectedToken}]</span>}
                        </div>
                        {tokenPrice && (
                          <div className="text-green-500 text-xs animate-pulse">
                            🔴 LIVE
                          </div>
                        )}
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={oldPrice}
                        onChange={(e) => {
                          setOldPrice(e.target.value);
                          if (e.target.value) trackPriceInput('initial_price');
                        }}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        }`}
                        placeholder="0"
                        required
                      />
                    </div>

                    {/* Current Price */}
                    <div>
                      <div className="h-10 flex flex-col justify-end gap-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Current Price ($)
                          </span>
                          {selectedToken && <span className="text-purple-500">[{selectedToken}]</span>}
                        </div>
                        {tokenPrice && (
                          <div className="text-green-500 text-xs animate-pulse">
                            🔴 AUTO-FILLED
                          </div>
                        )}
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={newPrice}
                        onChange={(e) => {
                          setNewPrice(e.target.value);
                          if (e.target.value) trackPriceInput('current_price');
                        }}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-purple-500/20 ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                        }`}
                        placeholder="0"
                        required
                      />
                    </div>

                    {/* Pool APY */}
                    <div>
                      <div className="h-10 flex items-end gap-2">
                        <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Pool APY (%)
                        </span>
                        <span className="text-orange-500 text-xs">✨ NEW</span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        min="0"
                        max="1000"
                        value={poolAPY}
                        onChange={(e) => setPoolAPY(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-orange-500/20 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-orange-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-orange-500'
                        }`}
                        placeholder="0"
                      />
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        💡 Popular pairs: ETH/USDT ~25-45%, BTC/USDT ~15-30%
                      </div>
                    </div>

                    {/* Investment */}
                    <div>
                      <div className="h-10 flex items-end gap-2">
                        <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Investment ($)
                        </span>
                      </div>
                      <input
                        type="number"
                        step="any"
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-green-500/20 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-green-500' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-green-500'
                        }`}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  {/* Refresh Data Button */}
                  {selectedToken && (
                    <div className="mb-6 text-center">
                      <button
                        type="button"
                        onClick={() => handleTokenSelect(selectedToken)}
                        disabled={loadingPrice}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-gray-300'
                            : 'bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700'
                        }`}
                        style={{ fontFamily: 'Orbitron, monospace' }}
                      >
                        {loadingPrice ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Updating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>🔄</span>
                            <span>Refresh Live Data</span>
                          </div>
                        )}
                      </button>
                      
                      {lastUpdated && (
                        <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Last updated: {lastUpdated}
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none ${
                      darkMode
                        ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white'
                    } shadow-lg hover:shadow-xl disabled:shadow-md`}
                    style={{ 
                      fontFamily: 'Orbitron, monospace',
                      textShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Calculating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>Calculate Impermanent Loss</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>

              {result && (
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                        Analysis Results
                      </h2>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Your position performance
                        {selectedPool && (() => {
                          const pool = POPULAR_POOLS.find(p => p.id === selectedPool);
                          return pool ? ` • ${pool.name} on ${pool.protocol}` : '';
                        })()}
                        {result.protocolName && ` • Protocol: ${result.protocolName}`}
                      </p>
                    </div>
                  </div>

                  {selectedPool && (() => {
                    const pool = POPULAR_POOLS.find(p => p.id === selectedPool);
                    if (!pool) return null;
                    
                    return (
                      <div className={`rounded-xl p-4 mb-6 border transition-colors duration-300 ${
                        darkMode ? 'bg-green-900/20 border-green-500/50' : 'bg-green-50 border-green-300'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">🏊‍♂️</div>
                            <div>
                              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                                {pool.name} Pool Analysis
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {pool.protocol} • {pool.fee} trading fee • {getRiskColor(pool.risk, darkMode).replace('text-', '')} risk
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-6 text-sm">
                            <div>
                              <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>APY</div>
                              <div className="text-green-500 font-bold">{pool.apy}%</div>
                            </div>
                            <div>
                              <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>TVL</div>
                              <div className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{pool.tvl}</div>
                            </div>
                            <div>
                              <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>24h Volume</div>
                              <div className={`${darkMode ? 'text-white' : 'text-gray-800'}`}>{pool.volume24h}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  {!selectedPool && result && (() => {
                    const protocol = EXPANDED_PROTOCOLS.find(p => p.id === selectedProtocol);
                    if (!protocol) return null;
                    
                    return (
                      <div className={`rounded-xl p-4 mb-6 border transition-colors duration-300 ${
                        darkMode ? 'bg-purple-900/20 border-purple-500/50' : 'bg-purple-50 border-purple-300'
                      }`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{protocol.icon}</div>
                            <div>
                              <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                                {protocol.name} Analysis
                              </div>
                              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {protocol.description}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {protocol.characteristics.map((char, index) => (
                              <span
                                key={index}
                                className={`text-xs px-2 py-1 rounded-full ${
                                  darkMode ? 'bg-purple-600 text-purple-100' : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className={`rounded-xl p-6 mb-6 ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div>
                        <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                          HODL Strategy
                        </div>
                        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          ${result.hodlValue}
                        </div>
                        <div className={`text-sm ${result.hodlProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.hodlProfit >= 0 ? '+' : ''}${result.hodlProfit} ({result.hodlProfitPercent}%)
                        </div>
                      </div>

                      <div>
                        <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                          LP Strategy {result.poolAPY > 0 && <span className="text-orange-500">+Fees</span>}
                        </div>
                        <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          ${result.poolAPY > 0 ? result.lpValueWithFees : result.lpValue}
                        </div>
                        <div className={`text-sm ${(result.poolAPY > 0 ? result.lpProfitWithFees : result.lpProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(result.poolAPY > 0 ? result.lpProfitWithFees : result.lpProfit) >= 0 ? '+' : ''}${result.poolAPY > 0 ? result.lpProfitWithFees : result.lpProfit} ({result.poolAPY > 0 ? result.lpProfitPercentWithFees : result.lpProfitPercent}%)
                        </div>
                        {result.poolAPY > 0 && (
                          <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Without fees: ${result.lpValue} ({result.lpProfitPercent}%)
                          </div>
                        )}
                      </div>

                      <div>
                        <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                          Impermanent Loss
                        </div>
                        <div className={`text-2xl font-bold ${result.impermanentLossUSD < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ${Math.abs(result.impermanentLossUSD)}
                        </div>
                        <div className={`text-sm ${result.impermanentLossUSD < 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {result.impermanentLossPercent}%
                        </div>
                        {result.poolAPY > 0 && (() => {
                          const ilAfterFees = result.lpValueWithFees - result.hodlValue;
                          const ilAfterFeesPercent = ((ilAfterFees / result.initialInvestment) * 100).toFixed(4);
                          return (
                            <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              After fees: <span className={ilAfterFees < 0 ? 'text-red-500' : 'text-green-500'}>
                                ${Math.abs(ilAfterFees.toFixed(2))} ({ilAfterFeesPercent}%)
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className={`mt-6 pt-6 border-t text-center ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                        🏆 Better Strategy: {result.betterStrategy}
                      </div>
                    </div>
                  </div>

                  {result && (
                    <div className={`rounded-xl p-6 mt-6 border transition-colors duration-300 ${
                      darkMode ? 'bg-blue-900/20 border-blue-500/50' : 'bg-blue-50 border-blue-300'
                    }`}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                              Scenario Analysis
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            "What if" price changes - plan your LP strategy
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {result.poolAPY > 0 && (
                    <div className={`rounded-xl p-6 border-2 border-dashed transition-colors duration-300 ${
                      darkMode ? 'bg-orange-900/20 border-orange-500/50' : 'bg-orange-50 border-orange-300'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          darkMode ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-600'
                        }`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                        <div>
                          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                            Fees Analysis ({result.poolAPY}% APY)
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Trading fees earnings breakdown
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            ${result.feesPerDay}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                            Per Day
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            ${result.feesPerWeek}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                            Per Week
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            ${result.feesPerMonth}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                            Per Month
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            ${result.totalFeesEarned}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                            {result.assumedDays} Days Total
                          </div>
                        </div>
                      </div>

                      <div className={`rounded-lg p-4 ${
                        darkMode ? 'bg-gray-800/50' : 'bg-white/70'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                              💰 Break-even Analysis
                            </div>
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {result.impermanentLossUSD < 0 
                                ? 'Time for fees to compensate IL'
                                : 'No impermanent loss to compensate!'
                              }
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-xl font-bold ${
                              result.breakEvenText === 'Never' ? 'text-red-500' :
                              result.breakEvenText === "No IL to compensate!" ? 'text-green-500' :
                              result.breakEvenDays <= 30 ? 'text-green-500' :
                              result.breakEvenDays <= 90 ? 'text-yellow-500' : 'text-orange-500'
                            }`}>
                              {result.breakEvenText}
                            </div>
                            {result.breakEvenDays && result.breakEvenDays <= 365 && (
                              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                ({result.breakEvenDays} days exactly)
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-12">
              <div className={`rounded-xl p-4 mb-6 border transition-colors duration-300 ${
                darkMode ? 'bg-blue-900/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📡</div>
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`} style={{ fontFamily: 'Orbitron, monospace' }}>
                      Real-Time Pool Data
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      APY rates are sourced from Uniswap V3, PancakeSwap V3, Curve, and other major DEX protocols. 
                      Data is updated every 6 hours to ensure accuracy. Volume and TVL figures reflect current market conditions.
                    </div>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl shadow-xl border transition-colors duration-300 overflow-hidden ${
                darkMode 
                  ? 'bg-gray-800/90 backdrop-blur-md border-gray-700' 
                  : 'bg-white/90 backdrop-blur-md border-gray-200'
              }`}>
                
                <div className={`p-8 border-b transition-colors duration-300 ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                      darkMode 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold transition-colors duration-300 ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`} style={{ fontFamily: 'Orbitron, monospace' }}>
                        Learn DeFi & Impermanent Loss
                      </h2>
                      <p className={`text-sm transition-colors duration-300 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Master the fundamentals of liquidity providing
                      </p>
                    </div>
                  </div>
                </div>

                {result && <EducationalTabs darkMode={darkMode} />}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className={`mt-16 border-t transition-colors duration-300 ${
            darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                
                <div className={`text-center md:text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`} 
                       style={{ fontFamily: 'Orbitron, monospace' }}>
                    ILCalculator.pro
                  </div>
                  <div className="text-sm">
                    Professional DeFi analytics for liquidity providers
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <Link
                    to="/terms"
                    className={`hover:underline transition-colors ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Terms of Service
                  </Link>
                  <Link
                    to="/privacy"
                    className={`hover:underline transition-colors ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    to="/refund"
                    className={`hover:underline transition-colors ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Refund Policy
                  </Link>
                  <Link
                    to="/contacts"
                    className={`hover:underline transition-colors ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Contact Us
                  </Link>
                </div>

                <div className={`text-sm text-center md:text-right ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div>© 2025 ILCalculator.pro</div>
                  <div>Made by Stefanson for DeFi community</div>
                </div>
              </div>
            </div>
          </footer>

          {/* Toast повідомлення */}
          {showToast && (
            <div className="fixed top-4 right-4 z-50 animate-pulse">
              <div className={`px-6 py-4 rounded-lg shadow-lg border-2 ${
                darkMode 
                  ? 'bg-green-800 border-green-600 text-green-100' 
                  : 'bg-green-100 border-green-400 text-green-800'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <span className="font-semibold">All data cleared! 🧹</span>
                </div>
              </div>
            </div>
          )}

          {/* Star Wars Theme Toast */}
          {showThemeToast && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-black border-2 border-red-500 rounded-lg px-8 py-6 shadow-2xl">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚔️</div>
                  <div 
                    className="text-red-500 text-xl font-bold tracking-widest animate-pulse"
                    style={{ 
                      fontFamily: 'Orbitron, monospace',
                      textShadow: '0 0 20px #ef4444, 0 0 40px #ef4444'
                    }}
                  >
                    WELCOME TO THE
                  </div>
                  <div 
                    className="text-red-600 text-2xl font-black tracking-widest mt-2"
                    style={{ 
                      fontFamily: 'Orbitron, monospace',
                      textShadow: '0 0 30px #dc2626, 0 0 60px #dc2626'
                    }}
                  >
                    DARK SIDE
                  </div>
                </div>
              </div>
            </div>
          )}         
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        darkMode={darkMode}
        selectedPlan={selectedPlan}
      />

    </>
  );
}

// Обгортка з Router та Routes
function AppWithRouter() {
  const [darkMode, setDarkMode] = useLocalStorage('ilc_darkMode', false);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
          <Route path="/contacts" element={<ContactUs />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}

export default AppWithRouter;