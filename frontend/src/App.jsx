import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useAnalytics } from './hooks/useAnalytics';

// API конфігурація
const API_CONFIG = {
  COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
  DEFILLAMA_BASE: 'https://yields.llama.fi',
  CACHE_DURATION: 5 * 60 * 1000, // 5 хвилин
};

// Простий кеш для API запитів
const apiCache = new Map();

// Функція для кешування API запитів
function getCachedData(key) {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < API_CONFIG.CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

// CoinGecko API функції
const CoinGeckoAPI = {
  // Отримання ціни токена
  async getTokenPrice(tokenId) {
    const cacheKey = `price_${tokenId}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${API_CONFIG.COINGECKO_BASE}/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
      );
      
      if (!response.ok) throw new Error('CoinGecko API error');
      
      const data = await response.json();
      const result = {
        price: data[tokenId]?.usd || 0,
        change24h: data[tokenId]?.usd_24h_change || 0,
        marketCap: data[tokenId]?.usd_market_cap || 0,
        lastUpdated: new Date().toLocaleTimeString()
      };
      
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching token price:', error);
      return { price: 0, change24h: 0, marketCap: 0, error: error.message };
    }
  },

  // Пошук токена за символом
  async searchToken(symbol) {
    const cacheKey = `search_${symbol}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${API_CONFIG.COINGECKO_BASE}/search?query=${symbol}`
      );
      
      if (!response.ok) throw new Error('Search API error');
      
      const data = await response.json();
      const result = data.coins?.slice(0, 5) || [];
      
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error searching token:', error);
      return [];
    }
  },

  // Топ токени
  async getTopTokens(limit = 50) {
    const cacheKey = `top_tokens_${limit}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${API_CONFIG.COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
      );
      
      if (!response.ok) throw new Error('Top tokens API error');
      
      const data = await response.json();
      const result = data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        image: coin.image
      }));
      
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching top tokens:', error);
      return [];
    }
  }
};

// DefiLlama API функції
const DefiLlamaAPI = {
  // Отримання пулів протоколу
  async getProtocolPools(protocol) {
    const cacheKey = `pools_${protocol}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${API_CONFIG.DEFILLAMA_BASE}/pools`
      );
      
      if (!response.ok) throw new Error('DefiLlama API error');
      
      const data = await response.json();
      const protocolPools = data.data
        ?.filter(pool => pool.project?.toLowerCase().includes(protocol.toLowerCase()))
        ?.slice(0, 20) || [];
      
      const result = protocolPools.map(pool => ({
        id: pool.pool,
        symbol: pool.symbol,
        protocol: pool.project,
        apy: pool.apy || 0,
        apyBase: pool.apyBase || 0,
        apyReward: pool.apyReward || 0,
        tvl: pool.tvlUsd || 0,
        volume24h: pool.volumeUsd1d || 0,
        chain: pool.chain,
        stablePool: pool.stablecoin || false,
        ilRisk: pool.il7d || 0
      }));
      
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching protocol pools:', error);
      return [];
    }
  },

  // Топ пули
  async getTopPools(limit = 50) {
    const cacheKey = `top_pools_${limit}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${API_CONFIG.DEFILLAMA_BASE}/pools`
      );
      
      if (!response.ok) throw new Error('DefiLlama API error');
      
      const data = await response.json();
      const topPools = data.data
        ?.sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
        ?.slice(0, limit) || [];
      
      const result = topPools.map(pool => ({
        id: pool.pool,
        symbol: pool.symbol,
        protocol: pool.project,
        apy: pool.apy || 0,
        apyBase: pool.apyBase || 0,
        apyReward: pool.apyReward || 0,
        tvl: pool.tvlUsd || 0,
        volume24h: pool.volumeUsd1d || 0,
        chain: pool.chain,
        stablePool: pool.stablecoin || false,
        ilRisk: pool.il7d || 0,
        lastUpdated: new Date().toLocaleTimeString()
      }));
      
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error fetching top pools:', error);
      return [];
    }
  },

  // Пошук пулів за парою токенів
  async findPoolsForPair(token1, token2) {
    const cacheKey = `pair_${token1}_${token2}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(
        `${API_CONFIG.DEFILLAMA_BASE}/pools`
      );
      
      if (!response.ok) throw new Error('DefiLlama API error');
      
      const data = await response.json();
      const pairPools = data.data?.filter(pool => {
        const symbol = pool.symbol?.toLowerCase() || '';
        const t1 = token1.toLowerCase();
        const t2 = token2.toLowerCase();
        return symbol.includes(t1) && symbol.includes(t2);
      })?.slice(0, 10) || [];
      
      const result = pairPools.map(pool => ({
        id: pool.pool,
        symbol: pool.symbol,
        protocol: pool.project,
        apy: pool.apy || 0,
        tvl: pool.tvlUsd || 0,
        volume24h: pool.volumeUsd1d || 0,
        chain: pool.chain,
        ilRisk: pool.il7d || 0
      }));
      
      setCachedData(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Error finding pools for pair:', error);
      return [];
    }
  }
};

// Mapping популярних токенів до CoinGecko ID
const TOKEN_ID_MAPPING = {
  'ETH': 'ethereum',
  'BTC': 'bitcoin', 
  'BNB': 'binancecoin',
  'SOL': 'solana',
  'ADA': 'cardano',
  'MATIC': 'matic-network',
  'DOT': 'polkadot',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
  'USDT': 'tether',
  'USDC': 'usd-coin',
  'DAI': 'dai',
  'WBTC': 'wrapped-bitcoin',
  'AVAX': 'avalanche-2',
  'ATOM': 'cosmos',
  'NEAR': 'near',
  'FTM': 'fantom',
  'CRV': 'curve-dao-token',
  'COMP': 'compound-governance-token'
};

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

  
// Розширений список протоколів з покращеними конфігураціями
const EXPANDED_PROTOCOLS = [
  // Класичні AMM
  {
    id: 'uniswap-v2',
    name: 'Uniswap V2',
    description: 'Classic constant product formula (x*y=k)',
    icon: '🦄',
    category: 'Classic AMM',
    network: ['Ethereum'],
    characteristics: ['50/50 weight pools', 'Standard IL calculation', 'High liquidity'],
    avgFee: '0.30%',
    complexity: 'Simple',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'fixed',
      concentratedLiquidity: false,
      customWeights: false
    }
  },
  {
    id: 'sushiswap',
    name: 'SushiSwap',
    description: 'Uniswap V2 fork with additional SUSHI rewards',
    icon: '🍣',
    category: 'Classic AMM',
    network: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum'],
    characteristics: ['SUSHI rewards', 'Multi-chain', 'Community owned'],
    avgFee: '0.30%',
    complexity: 'Simple',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'fixed',
      additionalRewards: true,
      multiChain: true
    }
  },
  
  // Концентрована ліквідність
  {
    id: 'uniswap-v3',
    name: 'Uniswap V3',
    description: 'Concentrated liquidity with custom price ranges',
    icon: '🦄',
    category: 'Concentrated Liquidity',
    network: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
    characteristics: ['Concentrated liquidity', 'Custom ranges', 'Higher capital efficiency'],
    avgFee: '0.05% - 1.00%',
    complexity: 'Advanced',
    riskLevel: 'High',
    config: {
      feeStructure: 'tiered',
      concentratedLiquidity: true,
      customRanges: true,
      feeTiers: [0.05, 0.3, 1.0]
    }
  },
  {
    id: 'pancakeswap-v3',
    name: 'PancakeSwap V3',
    description: 'BSC concentrated liquidity with lower fees',
    icon: '🥞',
    category: 'Concentrated Liquidity',
    network: ['BSC', 'Ethereum'],
    characteristics: ['Lower fees', 'Concentrated liquidity', 'BSC native'],
    avgFee: '0.01% - 1.00%',
    complexity: 'Advanced',
    riskLevel: 'High',
    config: {
      feeStructure: 'tiered',
      concentratedLiquidity: true,
      customRanges: true,
      feeTiers: [0.01, 0.25, 1.0]
    }
  },
  {
    id: 'algebra',
    name: 'Algebra Finance',
    description: 'Adaptive fees with concentrated liquidity',
    icon: '📊',
    category: 'Concentrated Liquidity',
    network: ['Polygon'],
    characteristics: ['Adaptive fees', 'Dynamic pricing', 'Concentrated liquidity'],
    avgFee: '0.01% - 0.30%',
    complexity: 'Advanced',
    riskLevel: 'High',
    config: {
      feeStructure: 'adaptive',
      concentratedLiquidity: true,
      dynamicFees: true
    }
  },
  
  // Стейблкоїн протоколи
  {
    id: 'curve-stable',
    name: 'Curve StableSwap',
    description: 'Optimized for stablecoins and pegged assets',
    icon: '🌀',
    category: 'Stablecoin AMM',
    network: ['Ethereum', 'Polygon', 'Arbitrum'],
    characteristics: ['Minimal IL for stables', 'StableSwap formula', 'Low slippage'],
    avgFee: '0.04%',
    complexity: 'Moderate',
    riskLevel: 'Low',
    config: {
      feeStructure: 'fixed',
      amplification: 2000,
      stableOptimized: true
    }
  },
  {
    id: 'curve-crypto',
    name: 'Curve CryptoSwap',
    description: 'For volatile assets with automatic rebalancing',
    icon: '🌀',
    category: 'Crypto AMM',
    network: ['Ethereum', 'Polygon'],
    characteristics: ['Internal oracles', 'Auto-rebalancing', 'Volatile assets'],
    avgFee: '0.04% - 0.40%',
    complexity: 'Advanced',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'dynamic',
      internalOracle: true,
      autoRebalancing: true
    }
  },
  
  // Weighted протоколи
  {
    id: 'balancer-weighted',
    name: 'Balancer Weighted',
    description: 'Custom weight pools (80/20, 60/40, etc.)',
    icon: '⚖️',
    category: 'Weighted Pools',
    network: ['Ethereum', 'Polygon', 'Arbitrum'],
    characteristics: ['Custom weights', 'Reduced IL', 'Portfolio management'],
    avgFee: '0.10% - 1.00%',
    complexity: 'Moderate',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'custom',
      customWeights: true,
      multiToken: true
    }
  },
  {
    id: 'balancer-stable',
    name: 'Balancer StablePool',
    description: 'Stable pools with Curve-like math',
    icon: '⚖️',
    category: 'Stablecoin AMM',
    network: ['Ethereum', 'Polygon'],
    characteristics: ['Stable math', 'Low IL', 'Multiple tokens'],
    avgFee: '0.10%',
    complexity: 'Moderate',
    riskLevel: 'Low',
    config: {
      feeStructure: 'fixed',
      stableOptimized: true,
      multiToken: true
    }
  },
  
  // Ve(3,3) протоколи
  {
    id: 'solidly',
    name: 'Solidly',
    description: 'Ve(3,3) model with stable/volatile curves',
    icon: '💎',
    category: 'Ve(3,3)',
    network: ['Fantom', 'Ethereum'],
    characteristics: ['Ve(3,3) tokenomics', 'Dual curves', 'Vote rewards'],
    avgFee: '0.01% - 0.30%',
    complexity: 'Advanced',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'dual',
      veTokenomics: true,
      stableVolatileCurves: true
    }
  },
  {
    id: 'velodrome',
    name: 'Velodrome',
    description: 'Optimism ve(3,3) with improved mechanics',
    icon: '🚴',
    category: 'Ve(3,3)',
    network: ['Optimism'],
    characteristics: ['Improved ve(3,3)', 'Optimism native', 'Weekly rewards'],
    avgFee: '0.01% - 0.30%',
    complexity: 'Advanced',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'dual',
      veTokenomics: true,
      weeklyRewards: true
    }
  },
  {
    id: 'thena',
    name: 'Thena',
    description: 'BSC ve(3,3) implementation',
    icon: '🏛️',
    category: 'Ve(3,3)',
    network: ['BSC'],
    characteristics: ['BSC ve(3,3)', 'Dual curves', 'THE rewards'],
    avgFee: '0.01% - 0.30%',
    complexity: 'Advanced',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'dual',
      veTokenomics: true,
      bscNative: true
    }
  },
  
  // Perpetual/GMX-style
  {
    id: 'gmx',
    name: 'GMX',
    description: 'Multi-asset pool for perpetual trading',
    icon: '📈',
    category: 'Perpetual DEX',
    network: ['Arbitrum', 'Avalanche'],
    characteristics: ['Multi-asset pool', 'Perpetual trading', 'GLP tokens'],
    avgFee: 'Variable',
    complexity: 'Advanced',
    riskLevel: 'High',
    config: {
      feeStructure: 'dynamic',
      multiAsset: true,
      perpetualTrading: true
    }
  },
  {
    id: 'gains',
    name: 'Gains Network',
    description: 'Synthetic leveraged trading with DAI vault',
    icon: '📊',
    category: 'Perpetual DEX',
    network: ['Polygon', 'Arbitrum'],
    characteristics: ['DAI vault', 'Synthetic leverage', 'Decentralized oracle'],
    avgFee: 'Variable',
    complexity: 'Advanced',
    riskLevel: 'High',
    config: {
      feeStructure: 'dynamic',
      syntheticAssets: true,
      daiVault: true
    }
  },
  
  // Нові/унікальні протоколи
  {
    id: 'maverick',
    name: 'Maverick Protocol',
    description: 'Directional liquidity with boosted positions',
    icon: '🎯',
    category: 'Directional Liquidity',
    network: ['Ethereum', 'Polygon'],
    characteristics: ['Directional liquidity', 'Boosted positions', 'Mode selection'],
    avgFee: '0.05% - 1.00%',
    complexity: 'Advanced',
    riskLevel: 'High',
    config: {
      feeStructure: 'tiered',
      directionalLiquidity: true,
      boostedPositions: true
    }
  },
  {
    id: 'kyberswap',
    name: 'KyberSwap Elastic',
    description: 'Concentrated liquidity with anti-sniping',
    icon: '🔄',
    category: 'Concentrated Liquidity',
    network: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum'],
    characteristics: ['Anti-MEV protection', 'Concentrated liquidity', 'Auto-compound'],
    avgFee: '0.008% - 1.00%',
    complexity: 'Advanced',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'tiered',
      antiMev: true,
      autoCompound: true
    }
  },
  {
    id: 'dodo',
    name: 'DODO PMM',
    description: 'Proactive Market Maker with external price feeds',
    icon: '🦤',
    category: 'PMM',
    network: ['Ethereum', 'BSC', 'Polygon'],
    characteristics: ['External oracles', 'PMM algorithm', 'Single-sided liquidity'],
    avgFee: '0.03% - 0.30%',
    complexity: 'Advanced',
    riskLevel: 'Medium',
    config: {
      feeStructure: 'dynamic',
      externalOracles: true,
      singleSided: true
    }
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

function calculateILAdvanced(oldPrice, newPrice, initialInvestment = 2000, poolAPY = 0, protocolType = 'uniswap-v2', protocolConfig = {}) {
  if (!oldPrice || !newPrice || oldPrice <= 0 || newPrice <= 0) {
    return null;
  }

  const priceRatio = newPrice / oldPrice;
  let multiplier, ilPercent;
  let protocolName = 'Standard AMM';
  let additionalData = {};
  
  switch (protocolType) {
    case 'uniswap-v2':
    case 'sushiswap':
    case 'pancakeswap-v2':
      // Класична формула x*y=k
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100;
      protocolName = protocolType === 'sushiswap' ? 'SushiSwap' : 
                    protocolType === 'pancakeswap-v2' ? 'PancakeSwap V2' : 'Uniswap V2';
      break;
      
    case 'uniswap-v3':
    case 'pancakeswap-v3':
      // Концентрована ліквідність з діапазонами цін
      const { lowerTick = 0.8, upperTick = 1.25, currentTick = 1.0 } = protocolConfig;
      
      if (priceRatio < lowerTick || priceRatio > upperTick) {
        // Поза діапазоном - позиція неактивна
        const outOfRangeMultiplier = priceRatio < lowerTick ? 
          (lowerTick + (priceRatio - lowerTick) * 0.5) / priceRatio :
          priceRatio / (upperTick + (priceRatio - upperTick) * 0.5);
        multiplier = Math.max(0.3, outOfRangeMultiplier);
        ilPercent = (multiplier - 1) * 100;
        
        additionalData.outOfRange = true;
        additionalData.activeRange = false;
      } else {
        // Всередині діапазону - концентрована ліквідність
        const concentrationFactor = Math.sqrt(upperTick / lowerTick);
        multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
        ilPercent = (multiplier - 1) * 100 * Math.min(concentrationFactor, 2.0);
        
        additionalData.inRange = true;
        additionalData.activeRange = true;
        additionalData.concentrationBonus = concentrationFactor > 1.5;
      }
      
      additionalData.concentrationRatio = upperTick / lowerTick;
      additionalData.capitalEfficiency = Math.min(10, 4 / (upperTick - lowerTick));
      
      protocolName = protocolType === 'uniswap-v3' ? 'Uniswap V3' : 'PancakeSwap V3';
      break;
      
    case 'curve':
    case 'curve-stable':
      // StableSwap формула для стейблкоїнів
      const A = protocolConfig.amplification || 2000;
      const priceDeviation = Math.abs(priceRatio - 1);
      
      if (priceDeviation < 0.005) {
        // Мінімальний IL для стейблів в нормальному діапазоні
        ilPercent = -priceDeviation * 0.1; 
        multiplier = 1 + (ilPercent / 100);
      } else if (priceDeviation < 0.02) {
        // Помірний IL при невеликому депеггінгу
        const stableSwapMultiplier = 1 - (priceDeviation * priceDeviation) / (8 * A / 10000);
        multiplier = Math.max(0.7, stableSwapMultiplier);
        ilPercent = (multiplier - 1) * 100;
      } else {
        // Значний IL при великому депеггінгу
        const depegMultiplier = 1 - (priceDeviation * Math.sqrt(priceDeviation)) / 2;
        multiplier = Math.max(0.3, depegMultiplier);
        ilPercent = (multiplier - 1) * 100;
      }
      
      protocolName = 'Curve StableSwap';
      additionalData = {
        amplification: A,
        priceDeviation: priceDeviation.toFixed(4),
        depegRisk: priceDeviation > 0.05 ? 'High' : priceDeviation > 0.02 ? 'Medium' : 'Low',
        stableOptimized: true
      };
      break;
      
    case 'balancer-weighted':
      // Weighted pools з кастомними вагами
      const { weight1 = 0.8, weight2 = 0.2 } = protocolConfig;
      
      // Формула для weighted pools - зменшений IL завдяки нерівним вагам
      const w1 = weight1, w2 = weight2;
      const weightedMultiplier = Math.pow(priceRatio, w1) * w1 + Math.pow(1, w2) * w2;
      multiplier = weightedMultiplier / (w1 + w2);
      ilPercent = (multiplier - 1) * 100;
      
      // Розрахунок переваги weighted pool над 50/50
      const standardIL = ((2 * Math.sqrt(priceRatio)) / (1 + priceRatio) - 1) * 100;
      const ilReduction = Math.abs(standardIL) - Math.abs(ilPercent);
      
      protocolName = 'Balancer Weighted';
      additionalData = {
        weights: [Math.round(w1*100), Math.round(w2*100)],
        ilReduction: ilReduction.toFixed(2),
        balancerAdvantage: ilReduction > 0
      };
      break;
      
    case 'gmx':
      // GMX-style pools з мультиплексингом та P&L торгівців
      const poolUtilization = protocolConfig.utilization || 0.75;
      const tradersPnL = protocolConfig.tradersPnL || 0; // Позитивний = програш трейдерів
      
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      let baseIL = (multiplier - 1) * 100;
      
      // Корекція на утилізацію та P&L трейдерів
      const utilizationAdjustment = 1 + poolUtilization * 0.3;
      const pnlBonus = tradersPnL * 0.01; // 1% бонусу за кожен % програшу трейдерів
      
      ilPercent = baseIL * utilizationAdjustment + pnlBonus;
      multiplier = 1 + (ilPercent / 100);
      
      protocolName = 'GMX';
      additionalData = {
        utilization: (poolUtilization * 100).toFixed(1),
        tradersPnL: tradersPnL.toFixed(1),
        glpRewards: true,
        tradingFees: true
      };
      break;
      
    case 'solidly':
    case 'velodrome':
      // Ve(3,3) протоколи з різними кривими
      const isStable = protocolConfig.isStable || false;
      const veBoost = protocolConfig.veBoost || 1.0;
      
      if (isStable) {
        // Stable curve - мінімальний IL
        const stableDeviation = Math.abs(priceRatio - 1);
        if (stableDeviation < 0.01) {
          ilPercent = -stableDeviation * 0.05;
        } else {
          ilPercent = -stableDeviation * stableDeviation * 10;
        }
        multiplier = 1 + (ilPercent / 100);
      } else {
        // Volatile curve - стандартний IL
        multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
        ilPercent = (multiplier - 1) * 100;
      }
      
      // Ve(3,3) boost effect
      const boostedRewards = veBoost * 0.2; // додаткові 20% за максимальний boost
      
      protocolName = protocolType === 'solidly' ? 'Solidly' : 'Velodrome';
      additionalData = {
        poolType: isStable ? 'Stable' : 'Volatile',
        veBoost: veBoost.toFixed(1),
        boostedAPY: boostedRewards.toFixed(1),
        weeklyRewards: true
      };
      break;
      
    case 'algebra':
      // Algebra з адаптивними комісіями
      const volatilityIndex = Math.abs(Math.log(priceRatio)) * 10;
      const adaptiveFeeMultiplier = Math.min(2.5, 1 + volatilityIndex * 0.1);
      
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100;
      
      protocolName = 'Algebra Finance';
      additionalData = {
        adaptiveFees: true,
        feeMultiplier: adaptiveFeeMultiplier.toFixed(2),
        volatilityIndex: volatilityIndex.toFixed(1)
      };
      break;
      
    default:
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100;
  }
  
  // Базові розрахунки
  const investmentPerAsset = initialInvestment / 2;
  const ethAmount = investmentPerAsset / oldPrice;
  const hodlValue = (ethAmount * newPrice) + investmentPerAsset;
  const lpValue = initialInvestment * Math.max(0.01, multiplier);
  const impermanentLossUSD = lpValue - hodlValue;
  
  // Комісії та APY
  const dailyAPY = poolAPY / 365 / 100;
  const assumedDays = 30;
  const totalFeesEarned = initialInvestment * dailyAPY * assumedDays;
  const lpValueWithFees = lpValue + totalFeesEarned;
  
  // Розрахунки прибутку
  const hodlProfitUSD = hodlValue - initialInvestment;
  const hodlProfitPercent = (hodlProfitUSD / initialInvestment) * 100;
  const lpProfitUSD = lpValue - initialInvestment;
  const lpProfitPercent = (lpProfitUSD / initialInvestment) * 100;
  const lpProfitWithFees = lpValueWithFees - initialInvestment;
  const lpProfitPercentWithFees = (lpProfitWithFees / initialInvestment) * 100;
  
  // Break-even аналіз
  let breakEvenDays = null;
  let breakEvenText = "No IL to compensate!";
  
  if (impermanentLossUSD < 0 && dailyAPY > 0) {
    const dailyFees = initialInvestment * dailyAPY;
    if (dailyFees > 0) {
      breakEvenDays = Math.ceil(Math.abs(impermanentLossUSD) / dailyFees);
      breakEvenText = breakEvenDays > 365 ? "Never (>1 year)" : `${breakEvenDays} days`;
    }
  }
  
  // Розрахунок ризик-скору та рекомендацій
  const riskScore = calculateAdvancedRiskScore(ilPercent, poolAPY, protocolType, additionalData);
  const recommendation = generateAdvancedRecommendation(ilPercent, poolAPY, protocolType, additionalData, riskScore);
  
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
    poolAPY,
    
    // Протокол-специфічні дані
    ...additionalData,
    
    // Ризик-метрики
    riskScore,
    recommendation,
    
    // Додаткові метрики
    efficiency: calculateProtocolEfficiency(protocolType, additionalData),
    complexity: getProtocolComplexity(protocolType)
  };
}

// Розрахунок ризик-скору
function calculateAdvancedRiskScore(ilPercent, poolAPY, protocolType, additionalData) {
  let riskScore = 0;

// Покращений розрахунок ризик-скору
function calculateAdvancedRiskScore(ilPercent, poolAPY, protocolType, additionalData) {
  let riskScore = 0;
  
  // Базовий IL ризик
  const absIL = Math.abs(ilPercent);
  if (absIL < 1) riskScore += 1;
  else if (absIL < 5) riskScore += 3;
  else if (absIL < 15) riskScore += 5;
  else if (absIL < 30) riskScore += 7;
  else riskScore += 9;
  
  // APY ризик - дуже високий APY = підозріло
  if (poolAPY > 200) riskScore += 6;
  else if (poolAPY > 100) riskScore += 4;
  else if (poolAPY > 50) riskScore += 2;
  else if (poolAPY < 5) riskScore += 1; // занадто низький теж ризик
  
  // Протокол-специфічні ризики
  switch (protocolType) {
    case 'uniswap-v3':
    case 'pancakeswap-v3':
      if (additionalData.outOfRange) riskScore += 4;
      if (additionalData.concentrationRatio > 3) riskScore += 2;
      break;
      
    case 'curve':
    case 'curve-stable':
      if (additionalData.depegRisk === 'High') riskScore += 5;
      else if (additionalData.depegRisk === 'Medium') riskScore += 2;
      break;
      
    case 'gmx':
      if (additionalData.utilization > 90) riskScore += 3;
      if (additionalData.tradersPnL < -10) riskScore += 2; // трейдери виграють
      break;
      
    case 'balancer-weighted':
      // Weighted pools зазвичай менш ризикові
      riskScore = Math.max(0, riskScore - 1);
      break;
  }
  
  // Нормалізуємо до шкали 1-10
  return Math.min(10, Math.max(1, riskScore));
}

// Розрахунок ефективності протоколу
function calculateProtocolEfficiency(protocolType, additionalData) {
  let baseEfficiency = 50; // з 100
  
  switch (protocolType) {
    case 'uniswap-v3':
    case 'pancakeswap-v3':
      baseEfficiency = 75;
      if (additionalData.capitalEfficiency) {
        baseEfficiency += Math.min(20, additionalData.capitalEfficiency * 2);
      }
      if (additionalData.outOfRange) {
        baseEfficiency -= 30;
      }
      break;
      
    case 'curve':
    case 'curve-stable':
      baseEfficiency = 85; // дуже ефективні для стейблів
      if (additionalData.depegRisk === 'High') baseEfficiency -= 40;
      else if (additionalData.depegRisk === 'Medium') baseEfficiency -= 15;
      break;
      
    case 'balancer-weighted':
      baseEfficiency = 70;
      if (additionalData.balancerAdvantage) baseEfficiency += 15;
      break;
      
    case 'gmx':
      baseEfficiency = 60;
      if (additionalData.tradersPnL > 0) baseEfficiency += 20;
      break;
      
    case 'solidly':
    case 'velodrome':
      baseEfficiency = 65;
      if (additionalData.poolType === 'Stable') baseEfficiency += 15;
      if (additionalData.veBoost > 2) baseEfficiency += 10;
      break;
      
    default:
      baseEfficiency = 50;
  }
  
  return Math.min(100, Math.max(0, baseEfficiency));
}

// Складність протоколу
function getProtocolComplexity(protocolType) {
  const complexityMap = {
    'uniswap-v2': 'Simple',
    'sushiswap': 'Simple',
    'pancakeswap-v2': 'Simple',
    'uniswap-v3': 'Advanced',
    'pancakeswap-v3': 'Advanced',
    'curve': 'Moderate',
    'curve-stable': 'Moderate',
    'balancer-weighted': 'Moderate',
    'gmx': 'Expert',
    'solidly': 'Advanced',
    'velodrome': 'Advanced',
    'algebra': 'Advanced'
  };
  
  return complexityMap[protocolType] || 'Moderate';
} 
  
  // IL ризик
  const absIL = Math.abs(ilPercent);
  if (absIL < 1) riskScore += 1;
  else if (absIL < 5) riskScore += 3;
  else if (absIL < 15) riskScore += 5;
  else if (absIL < 30) riskScore += 7;
  else riskScore += 9;
  
  // APY ризик
  if (poolAPY > 200) riskScore += 6;
  else if (poolAPY > 100) riskScore += 4;
  else if (poolAPY > 50) riskScore += 2;
  else if (poolAPY < 5) riskScore += 1;
  
  // Протокол-специфічні ризики
  switch (protocolType) {
    case 'uniswap-v3':
    case 'pancakeswap-v3':
      if (additionalData.outOfRange) riskScore += 4;
      if (additionalData.concentrationRatio > 3) riskScore += 2;
      break;
      
    case 'curve':
    case 'curve-stable':
      if (additionalData.depegRisk === 'High') riskScore += 5;
      else if (additionalData.depegRisk === 'Medium') riskScore += 2;
      break;
      
    case 'gmx':
      if (additionalData.utilization > 90) riskScore += 3;
      if (additionalData.tradersPnL < -10) riskScore += 2; // трейдери виграють
      break;
      
    case 'balancer-weighted':
      // Weighted pools зазвичай менш ризикові
      riskScore = Math.max(0, riskScore - 1);
      break;
  }
  
  return Math.min(10, Math.max(1, riskScore));
}

// Покращена генерація рекомендацій
function generateAdvancedRecommendation(ilPercent, poolAPY, protocolType, additionalData, riskScore) {
  const absIL = Math.abs(ilPercent);
  const ilToApyRatio = poolAPY > 0 ? absIL / (poolAPY / 12) : 0; // місячне співвідношення
  
  // Протокол-специфічні рекомендації
  if (protocolType === 'uniswap-v3' || protocolType === 'pancakeswap-v3') {
    if (additionalData.outOfRange) {
      return "🚨 OUT OF RANGE: Position inactive, no fees earned. Consider rebalancing your range or withdrawing liquidity.";
    } else if (additionalData.concentrationRatio > 5) {
      return "⚠️ NARROW RANGE: High capital efficiency but frequent rebalancing needed. Monitor closely.";
    } else if (additionalData.concentrationBonus) {
      return "🟢 OPTIMAL RANGE: Good concentration with manageable risk. Earning boosted fees.";
    }
  }
  
  if (protocolType === 'curve' || protocolType === 'curve-stable') {
    if (additionalData.depegRisk === 'High') {
      return "🔴 DEPEG ALERT: Major stablecoin deviation detected. High risk of permanent loss!";
    } else if (additionalData.depegRisk === 'Medium') {
      return "🟡 DEPEG WARNING: Moderate price deviation. Monitor for further divergence.";
    } else {
      return "🟢 STABLE PAIR: Minimal IL risk. Good choice for conservative LP strategy.";
    }
  }
  
  if (protocolType === 'gmx') {
    if (additionalData.tradersPnL > 5) {
      return "💰 TRADERS LOSING: Pool earning from trader losses. Strong performance expected.";
    } else if (additionalData.tradersPnL < -5) {
      return "📉 TRADERS WINNING: Pool paying out to successful traders. Consider reducing exposure.";
    }
  }
  
  if (protocolType === 'balancer-weighted') {
    if (additionalData.balancerAdvantage) {
      return `🎯 BALANCED ADVANTAGE: ${additionalData.weights[0]}/${additionalData.weights[1]} weighting reduces IL by ${additionalData.ilReduction}% vs 50/50 pool.`;
    }
  }
  
  // Загальні рекомендації на основі метрик
  if (riskScore <= 3 && absIL < 2 && poolAPY > 15) {
    return "🟢 EXCELLENT: Low risk, good returns. Ideal for conservative DeFi portfolio.";
  } else if (riskScore <= 5 && ilToApyRatio < 3) {
    return "🟡 GOOD: Moderate risk with fees likely compensating IL. Suitable for balanced strategy.";
  } else if (riskScore >= 8 || absIL > 25) {
    return "🔴 HIGH RISK: Significant IL potential. Only for experienced LPs with active management.";
  } else if (poolAPY < 5 && absIL > 5) {
    return "❌ POOR RISK/REWARD: Low fees unlikely to compensate IL. Consider HODL instead.";
  } else if (poolAPY > 100) {
    return "⚠️ UNSUSTAINABLE: Extremely high APY suggests temporary incentives or high risk.";
  } else {
    return "🟡 MODERATE: Standard risk/reward profile. Monitor market conditions and IL development.";
  }
}

// Розрахунок ефективності протоколу
function calculateProtocolEfficiency(protocolType, additionalData) {
  let baseEfficiency = 50; // з 100
  
  switch (protocolType) {
    case 'uniswap-v3':
    case 'pancakeswap-v3':
      baseEfficiency = 75;
      if (additionalData.capitalEfficiency) {
        baseEfficiency += Math.min(20, additionalData.capitalEfficiency * 2);
      }
      if (additionalData.outOfRange) {
        baseEfficiency -= 30;
      }
      break;
      
    case 'curve':
    case 'curve-stable':
      baseEfficiency = 85; // дуже ефективні для стейблів
      if (additionalData.depegRisk === 'High') baseEfficiency -= 40;
      else if (additionalData.depegRisk === 'Medium') baseEfficiency -= 15;
      break;
      
    case 'balancer-weighted':
      baseEfficiency = 70;
      if (additionalData.balancerAdvantage) baseEfficiency += 15;
      break;
      
    case 'gmx':
      baseEfficiency = 60;
      if (additionalData.tradersPnL > 0) baseEfficiency += 20;
      break;
      
    case 'solidly':
    case 'velodrome':
      baseEfficiency = 65;
      if (additionalData.poolType === 'Stable') baseEfficiency += 15;
      if (additionalData.veBoost > 2) baseEfficiency += 10;
      break;
      
    default:
      baseEfficiency = 50;
  }
  
  return Math.min(100, Math.max(0, baseEfficiency));
}

// Складність протоколу
function getProtocolComplexity(protocolType) {
  const complexityMap = {
    'uniswap-v2': 'Simple',
    'sushiswap': 'Simple',
    'pancakeswap-v2': 'Simple',
    'uniswap-v3': 'Advanced',
    'pancakeswap-v3': 'Advanced',
    'curve': 'Moderate',
    'curve-stable': 'Moderate',
    'balancer-weighted': 'Moderate',
    'gmx': 'Expert',
    'solidly': 'Advanced',
    'velodrome': 'Advanced',
    'algebra': 'Advanced'
  };
  
  return complexityMap[protocolType] || 'Moderate';
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
            const calc = calculateILAdvanced(currentOldPrice, newPrice, initialInvestment, poolAPY, selectedProtocol);
            
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
  
  // Нові стейти для API даних
  const [tokenPrice, setTokenPrice] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);
  const [livePools, setLivePools] = useState([]);
  const [loadingPools, setLoadingPools] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
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
          
          // Якщо стара ціна порожня, ставимо ціну -10% як початкову
          if (!oldPrice) {
            setOldPrice((priceData.price * 0.9).toFixed(2));
          }
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

            <div className="mb-6">
              <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
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
                  darkMode ? 'bg-green-900/20 border-green-500/50' : 'bg-green-50 border-green-300'
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
                        <div className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
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
              
              {livePools.length > 0 && !loadingPools && (
                <div className={`mt-3 p-4 rounded-lg border transition-colors duration-300 ${
                  darkMode ? 'bg-purple-900/20 border-purple-500/50' : 'bg-purple-50 border-purple-300'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-lg">🏊‍♂️</div>
                    <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      Top {selectedToken} Pools ({livePools.length} found)
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {livePools.slice(0, 6).map((pool, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setPoolAPY(pool.apy.toFixed(1));
                          // Можна додати вибір пулу
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" style={{ minHeight: '120px' }}>
              <div>
                <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Initial Price ($)
                    {selectedToken && <span className="text-blue-500 ml-1">[{selectedToken}]</span>}
                    {tokenPrice && (
                      <span className="text-green-500 ml-2 text-xs animate-pulse">🔴 LIVE</span>
                    )}
                </label>
                {newPrice && (
                  <div className="flex gap-1 mt-2">
                    {[-50, -25, -10, 10, 25, 50].map((percent) => (
                      <button
                        key={percent}
                        type="button"
                        onClick={() => setOldPrice((parseFloat(newPrice) * (1 + percent/100)).toFixed(2))}
                        className={`px-2 py-1 text-xs rounded-md transition-all duration-200 ${
                          darkMode 
                            ? 'bg-gray-600 hover:bg-gray-500 text-gray-300' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {percent > 0 ? '+' : ''}{percent}%
                      </button>
                    ))}
                  </div>
                )}
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
                    {tokenPrice && (
                      <span className="text-green-500 ml-2 text-xs animate-pulse">🔴 AUTO-FILLED</span>
                    )}
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

// Функція для отримання конфігурації протоколу
function getProtocolConfig(protocolId, customConfig = {}) {
  const protocol = EXPANDED_PROTOCOLS.find(p => p.id === protocolId);
  if (!protocol) return null;
  
  return {
    ...protocol,
    config: {
      ...protocol.config,
      ...customConfig
    }
  };
}

// Розрахунок складності та ризику
function calculateComplexityScore(protocol) {
  let score = 0;
  
  if (protocol.config.concentratedLiquidity) score += 3;
  if (protocol.config.customWeights) score += 2;
  if (protocol.config.dynamicFees) score += 2;
  if (protocol.config.veTokenomics) score += 3;
  if (protocol.config.perpetualTrading) score += 4;
  if (protocol.config.antiMev) score += 1;
  
  return Math.min(10, score);
}

export default App;