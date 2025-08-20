import React, { useState, createContext, useContext } from 'react';
import axios from 'axios';
import { useAnalytics } from './hooks/useAnalytics';
import { CoinGeckoAPI, DefiLlamaAPI } from './services/api';

import { TOKEN_ID_MAPPING, POPULAR_TOKENS } from './data/tokens';
import { POPULAR_POOLS } from './data/pools';
import { EXPANDED_PROTOCOLS } from './data/protocols';

import { calculateILAdvanced } from './services/calculations/impermanentLoss';

import AllPoolsSelector from './components/Pools/AllPoolsSelector';
import ScenarioTable from './components/Analysis/ScenarioTable';
import EducationalTabs from './components/Education/EducationalTabs';

import useLocalStorage from './hooks/useLocalStorage';
import LandingPage from './components/Landing/LandingPage';

import PaymentModal from './components/Payment/PaymentModal';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import TermsOfService from './components/Legal/TermsOfService';
import PrivacyPolicy from './components/Legal/PrivacyPolicy';
import RefundPolicy from './components/Legal/RefundPolicy';
import ContactUs from './components/Legal/ContactUs';

const ThemeContext = createContext();
export const useTheme = () => useContext(ThemeContext);

const googleFontsLink = document.createElement('link');
googleFontsLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap';
googleFontsLink.rel = 'stylesheet';
document.head.appendChild(googleFontsLink);

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
  const [darkMode] = useLocalStorage('ilc_darkMode', false);

  const [tokenPrice, setTokenPrice] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [livePools, setLivePools] = useState([]);
  const [loadingPools, setLoadingPools] = useState(false);
  const [showPools, setShowPools] = useState(false);

  const [hasVisited, setHasVisited] = useLocalStorage('ilc_hasVisited', false);
  const showLanding = !hasVisited;
  const [showToast, setShowToast] = useState(false);
  const [showThemeToast, setShowThemeToast] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const handleTokenSelect = async (token) => {
    setSelectedToken(token);
    trackTokenSelect(`${token}/USDT`);

    if (token && TOKEN_ID_MAPPING[token]) {
      try {
        const priceData = await CoinGeckoAPI.getTokenPrice(TOKEN_ID_MAPPING[token]);
        setTokenPrice(priceData);

        if (priceData.price > 0) {
          setNewPrice(priceData.price.toString());
        }

        setLastUpdated(priceData.lastUpdated);

        setLoadingPools(true);
        const pools = await DefiLlamaAPI.findPoolsForPair(token, 'USDT');
        setLivePools(pools);
        setLoadingPools(false);

        if (pools.length > 0) {
          setShowPools(true);
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
      }
    } else {
      setTokenPrice(null);
      setLivePools([]);
    }
  };

  const handleGetStarted = () => {
    setHasVisited(true);
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

  return (
    <>
      {showLanding ? (
        <LandingPage darkMode={darkMode} onGetStarted={handleGetStarted} />
      ) : (
        <div className={`min-h-screen transition-colors duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900' 
            : 'bg-gradient-to-br from-slate-50 via-white to-blue-50'
        }`}>
          <AllPoolsSelector 
            darkMode={darkMode}
            selectedPool={selectedPool}
            setSelectedPool={setSelectedPool}
            selectedProtocol={selectedProtocol}
            setSelectedProtocol={setSelectedProtocol}
            selectedToken={selectedToken}
            handleTokenSelect={handleTokenSelect}
            tokenPrice={tokenPrice}
            loadingPrice={loading}
            livePools={livePools}
            loadingPools={loadingPools}
            lastUpdated={lastUpdated}
          />

          <ScenarioTable 
            darkMode={darkMode}
            result={result}
            handleSubmit={handleSubmit}
            loading={loading}
            oldPrice={oldPrice}
            setOldPrice={setOldPrice}
            newPrice={newPrice}
            setNewPrice={setNewPrice}
            initialInvestment={initialInvestment}
            setInitialInvestment={setInitialInvestment}
            poolAPY={poolAPY}
            setPoolAPY={setPoolAPY}
            selectedProtocol={selectedProtocol}
            selectedToken={selectedToken}
          />

          <EducationalTabs darkMode={darkMode} />

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
                  <Link to="/terms" className={`hover:underline transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Terms of Service
                  </Link>
                  <Link to="/privacy" className={`hover:underline transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Privacy Policy
                  </Link>
                  <Link to="/refund" className={`hover:underline transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    Refund Policy
                  </Link>
                  <Link to="/contacts" className={`hover:underline transition-colors ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
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
        </div>
      )}

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        darkMode={darkMode}
        selectedPlan={selectedPlan}
      />
    </>
  );
}

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
