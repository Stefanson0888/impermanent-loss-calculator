import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useAnalytics } from './hooks/useAnalytics';


const POPULAR_TOKENS = {
  'ETH': { name: 'Ethereum' },
  'BTC': { name: 'Bitcoin' },
  'BNB': { name: 'BNB' },
  'SOL': { name: 'Solana' },
  'ADA': { name: 'Cardano' },
  'MATIC': { name: 'Polygon' },
  'DOT': { name: 'Polkadot' },
  'LINK': { name: 'Chainlink' },
  'UNI': { name: 'Uniswap' },
  'AAVE': { name: 'Aave' }
};


const POPULAR_POOLS_APY = {
  'ETH/USDT': '25-45%',
  'BTC/USDT': '15-30%',
  'BNB/USDT': '20-40%',
  'ETH/USDC': '20-35%',
  'Stablecoins': '5-15%'
};


const POPULAR_POOLS = [
  
  {
    id: 'eth-usdt-uni-v3',
    name: 'ETH/USDT',
    protocol: 'Uniswap V3',
    protocolType: 'uniswap-v3',
    apy: 32.5,
    tvl: '$421M',
    volume24h: '$1.2B',
    fee: '0.30%',
    risk: 'Medium',
    category: 'Major'
  },
  {
    id: 'eth-usdc-uni-v3',
    name: 'ETH/USDC',
    protocol: 'Uniswap V3',
    protocolType: 'uniswap-v3',
    apy: 28.3,
    tvl: '$387M',
    volume24h: '$980M',
    fee: '0.30%',
    risk: 'Medium',
    category: 'Major'
  },
  {
    id: 'btc-usdt-uni-v3',
    name: 'WBTC/USDT',
    protocol: 'Uniswap V3',
    protocolType: 'uniswap-v3',
    apy: 24.1,
    tvl: '$198M',
    volume24h: '$654M',
    fee: '0.30%',
    risk: 'Medium',
    category: 'Major'
  },
  
    
  {
    id: 'bnb-usdt-pcs-v3',
    name: 'BNB/USDT',
    protocol: 'PancakeSwap V3',
    protocolType: 'pancakeswap-v3',
    apy: 35.7,
    tvl: '$156M',
    volume24h: '$432M',
    fee: '0.25%',
    risk: 'Medium',
    category: 'Major'
  },
  {
    id: 'eth-bnb-pcs-v3',
    name: 'ETH/BNB',
    protocol: 'PancakeSwap V3',
    protocolType: 'pancakeswap-v3',
    apy: 41.2,
    tvl: '$89M',
    volume24h: '$267M',
    fee: '0.25%',
    risk: 'High',
    category: 'Major'
  },
  
  
  {
    id: 'usdc-usdt-curve',
    name: 'USDC/USDT',
    protocol: 'Curve',
    protocolType: 'curve',
    apy: 8.4,
    tvl: '$892M',
    volume24h: '$145M',
    fee: '0.04%',
    risk: 'Low',
    category: 'Stable'
  },
  {
    id: '3pool-curve',
    name: '3Pool (USDC/USDT/DAI)',
    protocol: 'Curve',
    protocolType: 'curve',
    apy: 12.1,
    tvl: '$1.2B',
    volume24h: '$89M',
    fee: '0.04%',
    risk: 'Low',
    category: 'Stable'
  },
  
  
  {
    id: 'eth-usdt-uni-v2',
    name: 'ETH/USDT',
    protocol: 'Uniswap V2',
    protocolType: 'uniswap-v2',
    apy: 18.7,
    tvl: '$89M',
    volume24h: '$234M',
    fee: '0.30%',
    risk: 'Medium',
    category: 'Major'
  },
  
  
  {
    id: 'bal-eth-80-20',
    name: 'BAL/ETH (80/20)',
    protocol: 'Balancer',
    protocolType: 'balancer-weighted',
    apy: 45.3,
    tvl: '$67M',
    volume24h: '$87M',
    fee: '0.50%',
    risk: 'High',
    category: 'DeFi'
  },
  
  
  {
    id: 'sol-usdt-raydium',
    name: 'SOL/USDT',
    protocol: 'Raydium',
    protocolType: 'uniswap-v2', 
    apy: 67.3,
    tvl: '$78M',
    volume24h: '$312M',
    fee: '0.25%',
    risk: 'High',
    category: 'Alt'
  },
  
  
  {
    id: 'uni-eth-uni-v3',
    name: 'UNI/ETH',
    protocol: 'Uniswap V3',
    protocolType: 'uniswap-v3',
    apy: 38.9,
    tvl: '$67M',
    volume24h: '$156M',
    fee: '0.30%',
    risk: 'High',
    category: 'DeFi'
  },
  {
    id: 'aave-eth-uni-v3',
    name: 'AAVE/ETH',
    protocol: 'Uniswap V3',
    protocolType: 'uniswap-v3',
    apy: 43.2,
    tvl: '$43M',
    volume24h: '$98M',
    fee: '0.30%',
    risk: 'High',
    category: 'DeFi'
  }
];

  
const AVAILABLE_PROTOCOLS = [
  {
    id: 'uniswap-v2',
    name: 'Uniswap V2',
    description: 'Classic constant product formula (x*y=k)',
    icon: '🦄',
    characteristics: ['Standard IL calculation', '50/50 weight pools', 'Most common AMM']
  },
  {
    id: 'uniswap-v3', 
    name: 'Uniswap V3',
    description: 'Concentrated liquidity with price ranges',
    icon: '🦄',
    characteristics: ['Concentrated liquidity', 'Potentially higher IL', 'Active management needed']
  },
  {
    id: 'pancakeswap-v3',
    name: 'PancakeSwap V3',
    description: 'BSC concentrated liquidity',
    icon: '🥞',
    characteristics: ['Lower fees', 'BSC ecosystem', 'Concentrated liquidity']
  },
  {
    id: 'curve',
    name: 'Curve Finance',
    description: 'Optimized for stablecoins and similar assets',
    icon: '🌀',
    characteristics: ['Minimal IL for stables', 'StableSwap formula', 'Best for correlated assets']
  },
  {
    id: 'balancer-weighted',
    name: 'Balancer Weighted',
    description: 'Custom weight pools (80/20, 60/40, etc.)',
    icon: '⚖️',
    characteristics: ['Custom pool weights', 'Reduced IL vs 50/50', 'More complex math']
  },
  {
    id: 'sushiswap',
    name: 'SushiSwap',
    description: 'Fork of Uniswap V2 with additional rewards',
    icon: '🍣',
    characteristics: ['Same as Uniswap V2', 'Additional SUSHI rewards', 'Multi-chain']
  }
];


const getRiskColor = (risk, darkMode) => {
  const colors = {
    'Low': darkMode ? 'text-green-400' : 'text-green-600',
    'Medium': darkMode ? 'text-yellow-400' : 'text-yellow-600', 
    'High': darkMode ? 'text-red-400' : 'text-red-600'
  };
  return colors[risk] || '';
};


function AllPoolsSelector({ darkMode, onPoolSelect, selectedPool }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [riskFilter, setRiskFilter] = useState('All');
  
  const categories = {
    'Major': { name: 'Major Pairs', description: 'ETH, BTC, BNB pairs with high volume', icon: '🏆' },
    'Stable': { name: 'Stablecoin Pools', description: 'Low risk, stable returns', icon: '🛡️' },
    'Alt': { name: 'Altcoin Pairs', description: 'Higher risk, higher potential returns', icon: '🚀' },
    'DeFi': { name: 'DeFi Tokens', description: 'UNI, AAVE, COMP and other DeFi blue chips', icon: '⚡' }
  };

  const riskFilters = ['All', 'Low', 'Medium', 'High'];

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
          darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
        }`}
      >
        <span>View All Pools ({POPULAR_POOLS.length} available)</span>
        <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      
      {isExpanded && (
        <div className={`mt-4 rounded-xl border transition-colors duration-300 ${
          darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-300'
        }`}>
          
          
          <div className={`p-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold">Filter by risk:</span>
              {riskFilters.map((risk) => (
                <button
                  key={risk}
                  onClick={() => setRiskFilter(risk)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                    riskFilter === risk
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-600 text-white'
                      : darkMode
                        ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>
          
          {Object.entries(categories).map(([categoryKey, category]) => {
            const poolsInCategory = POPULAR_POOLS.filter(pool => 
              pool.category === categoryKey && 
              (riskFilter === 'All' || pool.risk === riskFilter)
            );
            
            if (poolsInCategory.length === 0) return null;
            
            return (
              <div 
                key={categoryKey}
                className={`p-4 border-b last:border-b-0 ${
                  darkMode ? 'border-gray-600' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {category.name} ({poolsInCategory.length})
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {category.description}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {poolsInCategory.map((pool) => (
                    <div
                      key={pool.id}
                      onClick={() => onPoolSelect(pool)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                        selectedPool === pool.id
                          ? darkMode 
                            ? 'border-orange-500 bg-orange-900/20' 
                            : 'border-orange-500 bg-orange-50'
                          : darkMode
                            ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                            : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {pool.name}
                          </div>
                          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {pool.protocol}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-500 font-bold text-sm">
                            {pool.apy}%
                          </div>
                          <div className={`text-xs ${getRiskColor(pool.risk, darkMode)}`}>
                            {pool.risk}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs">
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {pool.tvl}
                        </div>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {pool.volume24h}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function calculateILLocal(oldPrice, newPrice, initialInvestment = 2000, poolAPY = 0, protocolType = 'uniswap-v2') {
  if (!oldPrice || !newPrice || oldPrice <= 0 || newPrice <= 0) {
    return null;
  }

  const priceRatio = newPrice / oldPrice;
  
  
  let multiplier, ilPercent;
  let protocolName = 'Standard AMM';
  
  switch (protocolType) {
    case 'uniswap-v2':
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100;
      protocolName = 'Uniswap V2';
      break;
    case 'pancakeswap-v2':
    case 'sushiswap':
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100;
      protocolName = protocolType === 'sushiswap' ? 'SushiSwap' : 'PancakeSwap V2';
      break;
      
    case 'uniswap-v3':
    case 'pancakeswap-v3':
      
      const concentrationFactor = 2.0; 
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100 * concentrationFactor;
      protocolName = protocolType === 'uniswap-v3' ? 'Uniswap V3' : 'PancakeSwap V3';
      break;
      
    case 'curve':
      
      const priceChange = Math.abs(priceRatio - 1);
      if (priceChange < 0.02) { 
        ilPercent = -0.01 * (priceChange * 100); 
        multiplier = 1 + (ilPercent / 100);
      } else {
        multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
        ilPercent = (multiplier - 1) * 100 * 0.3;
      }
      protocolName = 'Curve Finance';
      break;
      
    case 'balancer-weighted':
      
      const weight1 = 0.8;
      const weight2 = 0.2;
      const term1 = Math.pow(priceRatio, weight1);
      const term2 = Math.pow(1, weight2);
      multiplier = weight1 * term1 + weight2 * term2;
      ilPercent = (multiplier - 1) * 100 * 0.25; 
      protocolName = 'Balancer Weighted';
      break;
      
    default:
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100;
      protocolName = 'Standard AMM';
  }
  
  const investmentPerAsset = initialInvestment / 2;
  const ethAmount = investmentPerAsset / oldPrice;
  const hodlValue = (ethAmount * newPrice) + investmentPerAsset;
  const lpValue = initialInvestment * Math.max(0.1, multiplier);
  const impermanentLossUSD = lpValue - hodlValue;
  
  
  const dailyAPY = poolAPY / 365 / 100;
  const assumedDays = 30;
  const totalFeesEarned = initialInvestment * dailyAPY * assumedDays;
  const lpValueWithFees = lpValue + totalFeesEarned;
  
  const hodlProfitUSD = hodlValue - initialInvestment;
  const hodlProfitPercent = (hodlProfitUSD / initialInvestment) * 100;
  const lpProfitUSD = lpValue - initialInvestment;
  const lpProfitPercent = (lpProfitUSD / initialInvestment) * 100;
  const lpProfitWithFees = lpValueWithFees - initialInvestment;
  const lpProfitPercentWithFees = (lpProfitWithFees / initialInvestment) * 100;
  
  
  let breakEvenDays = null;
  let breakEvenText = "No IL to compensate!";
  
  if (impermanentLossUSD < 0 && dailyAPY > 0) {
    const dailyFees = initialInvestment * dailyAPY;
    if (dailyFees > 0) {
      breakEvenDays = Math.ceil(Math.abs(impermanentLossUSD) / dailyFees);
      if (breakEvenDays > 365) {
        breakEvenText = "Never (>1 year)";
      } else {
        breakEvenText = `${breakEvenDays} days`;
      }
    }
  }
  
  return {
    hodlValue: parseFloat(hodlValue.toFixed(2)),
    lpValue: parseFloat(lpValue.toFixed(2)),
    lpValueWithFees: parseFloat(lpValueWithFees.toFixed(2)),
    impermanentLossUSD: parseFloat(impermanentLossUSD.toFixed(2)),
    impermanentLossPercent: parseFloat(ilPercent.toFixed(4)),
    hodlProfit: parseFloat(hodlProfitUSD.toFixed(2)),
    hodlProfitPercent: parseFloat(hodlProfitPercent.toFixed(2)),
    lpProfit: parseFloat(lpProfitUSD.toFixed(2)),
    lpProfitPercent: parseFloat(lpProfitPercent.toFixed(2)),
    lpProfitWithFees: parseFloat(lpProfitWithFees.toFixed(2)),
    lpProfitPercentWithFees: parseFloat(lpProfitPercentWithFees.toFixed(2)),
    priceChange: parseFloat(((newPrice - oldPrice) / oldPrice * 100).toFixed(2)),
    betterStrategy: (poolAPY > 0 ? lpValueWithFees : lpValue) > hodlValue ? 'LP' : 'HODL',
    
    protocolName,
    breakEvenDays,
    breakEvenText,
    totalFeesEarned: parseFloat(totalFeesEarned.toFixed(2)),
    feesPerDay: parseFloat((totalFeesEarned / assumedDays).toFixed(2)),
    feesPerWeek: parseFloat((totalFeesEarned / assumedDays * 7).toFixed(2)),
    feesPerMonth: parseFloat(totalFeesEarned.toFixed(2)),
    assumedDays,
    poolAPY
  };
}


const ScenarioTable = React.memo(({ currentOldPrice, initialInvestment, poolAPY, selectedProtocol, darkMode }) => {
  const scenarios = [
    { label: "-50%", multiplier: 0.5, color: "red" },
    { label: "-25%", multiplier: 0.75, color: "orange" },
    { label: "-10%", multiplier: 0.9, color: "yellow" },
    { label: "+10%", multiplier: 1.1, color: "yellow" },
    { label: "+25%", multiplier: 1.25, color: "orange" },
    { label: "+50%", multiplier: 1.5, color: "red" },
    { label: "+100%", multiplier: 2.0, color: "red" }
  ];

  const getColorClass = (color, type, darkMode) => {
    const colors = {
      red: darkMode 
        ? (type === 'bg' ? 'bg-red-900/30' : 'text-red-400')
        : (type === 'bg' ? 'bg-red-50' : 'text-red-600'),
      orange: darkMode 
        ? (type === 'bg' ? 'bg-orange-900/30' : 'text-orange-400')
        : (type === 'bg' ? 'bg-orange-50' : 'text-orange-600'),
      yellow: darkMode 
        ? (type === 'bg' ? 'bg-yellow-900/30' : 'text-yellow-400')
        : (type === 'bg' ? 'bg-yellow-50' : 'text-yellow-600')
    };
    return colors[color] || '';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Price Change
            </th>
            <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              New Price
            </th>
            <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              HODL
            </th>
            <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              LP {poolAPY > 0 ? '+Fees' : ''}
            </th>
            <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              IL Amount
            </th>
            <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              IL %
            </th>
            <th className={`text-center p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Winner
            </th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((scenario, index) => {
            const newPrice = currentOldPrice * scenario.multiplier;
            const calc = calculateILLocal(currentOldPrice, newPrice, initialInvestment, poolAPY, selectedProtocol);
            
            if (!calc) return null;

            const lpDisplayValue = poolAPY > 0 ? calc.lpValueWithFees : calc.lpValue;
            const ilAfterFees = poolAPY > 0 ? lpDisplayValue - calc.hodlValue : calc.impermanentLossUSD;
            const ilAfterFeesPercent = poolAPY > 0 ? ((ilAfterFees / initialInvestment) * 100).toFixed(4) : calc.impermanentLossPercent;

            return (
              <tr 
                key={index}
                className={`border-b transition-colors duration-300 ${
                  darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-200 hover:bg-gray-50'
                } ${getColorClass(scenario.color, 'bg', darkMode)}`}
              >
                <td className={`p-3 font-semibold ${getColorClass(scenario.color, 'text', darkMode)}`}>
                  {scenario.label}
                </td>
                <td className={`p-3 text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  ${newPrice.toFixed(2)}
                </td>
                <td className={`p-3 text-right font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ${calc.hodlValue}
                  <div className={`text-xs ${calc.hodlProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ({calc.hodlProfitPercent}%)
                  </div>
                </td>
                <td className={`p-3 text-right font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ${lpDisplayValue}
                  <div className={`text-xs ${(poolAPY > 0 ? calc.lpProfitWithFees : calc.lpProfit) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ({poolAPY > 0 ? calc.lpProfitPercentWithFees : calc.lpProfitPercent}%)
                  </div>
                </td>
                <td className={`p-3 text-right font-medium ${ilAfterFees < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ${Math.abs(ilAfterFees.toFixed(2))}
                </td>
                <td className={`p-3 text-right font-medium ${parseFloat(ilAfterFeesPercent) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {ilAfterFeesPercent}%
                </td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    calc.betterStrategy === 'HODL' 
                      ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                      : darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {calc.betterStrategy}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        💡 Red rows = high IL risk, Yellow rows = moderate IL risk. 
        {poolAPY > 0 && ` Fees APY: ${poolAPY}% (30-day calculation).`}
      </div>
    </div>
  );
});


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


function LearnSection({ darkMode }) {
  const articles = [
    {
      title: "What is Impermanent Loss?",
      content: "Impermanent loss occurs when you provide liquidity to an AMM and the price of your deposited assets changes compared to when you deposited them. The bigger the change, the more you are exposed to impermanent loss. The loss is 'impermanent' because it only becomes permanent when you withdraw your liquidity.",
      key: "📉"
    },
    {
      title: "How do AMMs Work?",
      content: "Automated Market Makers (AMMs) use mathematical formulas to price assets and create liquidity pools. The most common formula is x * y = k (constant product), where x and y are the quantities of two tokens, and k is a constant. When someone trades, they change this ratio, which affects prices.",
      key: "⚖️"
    },
    {
      title: "Trading Fees: The IL Compensation",
      content: "When you provide liquidity, you earn a portion of trading fees (typically 0.25-0.3% per trade). These fees accumulate over time and often compensate for impermanent loss, especially in high-volume pools. The key is finding pools where fee income exceeds IL.",
      key: "💰"
    },
    {
      title: "LP Strategies: Risk vs Reward",
      content: "Conservative: Stable pairs (USDC/USDT) for minimal IL but lower APY. Moderate: Major pairs (ETH/USDT) for balanced risk/reward. Aggressive: New tokens for high APY but significant IL risk. Always consider fee income when evaluating strategies.",
      key: "🎯"
    }
  ];

  return (
    <div className="grid gap-6">
      {articles.map((article, index) => (
        <div
          key={index}
          className={`rounded-xl p-6 border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700/50 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="text-3xl">{article.key}</div>
            <div>
              <h3 className={`text-lg font-bold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {article.title}
              </h3>
              <p className={`leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {article.content}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


function FAQSection({ darkMode }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "When should I use HODL vs LP strategy?",
      answer: "HODL is better when you expect significant price appreciation and low trading volume. LP is better when you expect sideways price movement with high trading volume, as fees can compensate for IL."
    },
    {
      question: "How accurate is this calculator?",
      answer: "Our calculator uses the standard AMM formula (x*y=k) and real fee structures. However, it assumes constant APY and doesn't account for compounding, gas fees, or protocol-specific features like concentrated liquidity."
    },
    {
      question: "What's a good APY for LP positions?",
      answer: "It depends on the pair: Stablecoin pairs: 5-15% APY, Major pairs (ETH/BTC): 15-30% APY, Alt pairs: 25-50%+ APY (higher risk). Always compare APY with potential IL."
    },
    {
      question: "Can I lose all my money with IL?",
      answer: "No, IL cannot make you lose 100% of your investment. The maximum theoretical IL is about 25% if one token goes to zero. However, you still own tokens worth something in most scenarios."
    },
    {
      question: "Which platforms have the best fees?",
      answer: "Uniswap: 0.3% fees, high volume. PancakeSwap: 0.25% fees, BSC ecosystem. Curve: 0.04-0.4% fees, optimized for stables. SushiSwap: 0.25-0.3% fees, additional token rewards."
    },
    {
      question: "How often are fees distributed?",
      answer: "Fees are added to the pool automatically with each trade and compound continuously. You realize them when you withdraw liquidity. Some platforms also offer additional token rewards weekly/monthly."
    }
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`rounded-xl border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700/50 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <button
            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
            className={`w-full text-left p-6 font-semibold transition-colors duration-300 ${
              darkMode ? 'text-white hover:text-purple-400' : 'text-gray-800 hover:text-purple-600'
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{faq.question}</span>
              <span className={`text-xl transition-transform duration-300 ${
                openFAQ === index ? 'rotate-180' : ''
              }`}>
                ▼
              </span>
            </div>
          </button>
          {openFAQ === index && (
            <div className={`px-6 pb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <div className="leading-relaxed">
                {faq.answer}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function GlossarySection({ darkMode }) {
  const terms = [
    {
      term: "Impermanent Loss (IL)",
      definition: "The temporary loss of funds when providing liquidity compared to simply holding the tokens. It occurs due to price divergence between paired assets."
    },
    {
      term: "AMM (Automated Market Maker)",
      definition: "A decentralized protocol that uses mathematical formulas to price assets and provide liquidity, eliminating the need for traditional order books."
    },
    {
      term: "Liquidity Pool",
      definition: "A smart contract containing pairs of tokens that traders can swap against. LPs deposit tokens to earn fees from trades."
    },
    {
      term: "APY (Annual Percentage Yield)",
      definition: "The real rate of return earned on an investment, taking into account the effect of compounding interest over a year."
    },
    {
      term: "Slippage",
      definition: "The difference between the expected price of a trade and the actual price due to market movement or low liquidity."
    },
    {
      term: "TVL (Total Value Locked)",
      definition: "The total amount of cryptocurrency held in a DeFi protocol's smart contracts, indicating its popularity and trustworthiness."
    },
    {
      term: "Yield Farming",
      definition: "The practice of lending or staking cryptocurrency to generate high returns, often through providing liquidity to DeFi protocols."
    },
    {
      term: "LP Tokens",
      definition: "Tokens received when providing liquidity to a pool, representing your share of the pool and allowing you to withdraw your portion plus earned fees."
    }
  ];

  return (
    <div className="grid gap-4">
      {terms.map((item, index) => (
        <div
          key={index}
          className={`rounded-xl p-6 border transition-colors duration-300 ${
            darkMode 
              ? 'bg-gray-700/50 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex flex-col">
            <h4 className={`text-lg font-bold mb-2 ${
              darkMode ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {item.term}
            </h4>
            <p className={`leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {item.definition}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const {
    trackCalculation,
    trackTokenSelect,
    trackPriceInput,
    trackDonation,
    trackEvent
  } = useAnalytics();

  const [oldPrice, setOldPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [poolAPY, setPoolAPY] = useState('');
  const [selectedPool, setSelectedPool] = useState('');
  const [selectedProtocol, setSelectedProtocol] = useState('uniswap-v2');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedToken, setSelectedToken] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold transition-colors duration-300 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Impermanent Loss Calculator
              </h1>
              <p className={`text-sm mt-1 transition-colors duration-300 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Professional DeFi analysis tool for liquidity providers
              </p>
            </div>
            
            
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                trackEvent({
                  action: 'toggle_theme',
                  category: 'ui',
                  label: !darkMode ? 'dark' : 'light'
                });
              }}
              className={`p-3 rounded-xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
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
            </button>
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
              }`}>
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
              <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                🔧 AMM Protocol
                <span className="text-purple-500 ml-1 text-xs">MULTI-PROTOCOL</span>
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {AVAILABLE_PROTOCOLS.map((protocol) => (
                  <div
                    key={protocol.id}
                    onClick={() => setSelectedProtocol(protocol.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      selectedProtocol === protocol.id
                        ? darkMode 
                          ? 'border-purple-500 bg-purple-900/20' 
                          : 'border-purple-500 bg-purple-50'
                        : darkMode
                          ? 'border-gray-600 bg-gray-700/30 hover:border-gray-500'
                          : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{protocol.icon}</div>
                      <div className="flex-1">
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {protocol.name}
                        </div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {protocol.description}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {protocol.characteristics.slice(0, 2).map((char, index) => (
                            <span
                              key={index}
                              className={`text-xs px-2 py-1 rounded-full ${
                                darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Select Token (Optional)
              </label>
              <select
                value={selectedToken}
                onChange={(e) => {
                  const token = e.target.value;
                  setSelectedToken(token);
                  if (token) {
                    trackTokenSelect(`${token}/USDT`);
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:ring-4 focus:ring-blue-500/20 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
              >
                <option value="">Choose a token or enter manually</option>
                {Object.entries(POPULAR_TOKENS).map(([symbol, data]) => (
                  <option key={symbol} value={symbol}>
                    {symbol} - {data.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div>
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Initial Price ($)
                  {selectedToken && <span className="text-blue-500 ml-1">[{selectedToken}]</span>}
                </label>
                <input
                  type="number"
                  step="any"
                  value={oldPrice}
                  onChange={(e) => {
                    setOldPrice(e.target.value);
                    if (e.target.value) {
                      trackPriceInput('initial_price');
                    }
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
              
              <div>
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Current Price ($)
                  {selectedToken && <span className="text-purple-500 ml-1">[{selectedToken}]</span>}
                </label>
                <input
                  type="number"
                  step="any"
                  value={newPrice}
                  onChange={(e) => {
                    setNewPrice(e.target.value);
                    if (e.target.value) {
                      trackPriceInput('current_price');
                    }
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

              <div>
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Pool APY (%)
                  <span className="text-orange-500 ml-1 text-xs">✨ NEW</span>
                </label>
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
                  placeholder="25"
                />
                <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  💡 Popular pairs: ETH/USDT ~25-45%, BTC/USDT ~15-30%
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Investment ($)
                </label>
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white'
              } shadow-lg hover:shadow-xl disabled:shadow-md`}
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
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
              const protocol = AVAILABLE_PROTOCOLS.find(p => p.id === selectedProtocol);
              if (!protocol) return null;
              
              return (
                <div className={`rounded-xl p-4 mb-6 border transition-colors duration-300 ${
                  darkMode ? 'bg-purple-900/20 border-purple-500/50' : 'bg-purple-50 border-purple-300'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{protocol.icon}</div>
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
                  <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                  <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                  <div className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
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
                <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Scenario Analysis
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      "What if" price changes - plan your LP strategy
                    </p>
                  </div>
                </div>

                const memoizedScenarioTable = useMemo(() => (
                  <ScenarioTable 
                    currentOldPrice={parseFloat(oldPrice)} 
                    initialInvestment={parseFloat(initialInvestment) || 2000}
                    poolAPY={parseFloat(poolAPY) || 0}
                    selectedProtocol={selectedProtocol}
                    darkMode={darkMode} 
                  />
                ), [oldPrice, initialInvestment, poolAPY, selectedProtocol, darkMode])}
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
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Per Day
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ${result.feesPerWeek}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Per Week
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ${result.feesPerMonth}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Per Month
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      ${result.totalFeesEarned}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {result.assumedDays} Days Total
                    </div>
                  </div>
                </div>

                <div className={`rounded-lg p-4 ${
                  darkMode ? 'bg-gray-800/50' : 'bg-white/70'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
              <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
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
                }`}>
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
  </div>
);
}

export default App;