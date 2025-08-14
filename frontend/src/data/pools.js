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

const getRiskColor = (risk, darkMode) => {
  const colors = {
    'Low': darkMode ? 'text-green-400' : 'text-green-600',
    'Medium': darkMode ? 'text-yellow-400' : 'text-yellow-600', 
    'High': darkMode ? 'text-red-400' : 'text-red-600'
  };
  return colors[risk] || '';
};

export { POPULAR_POOLS_APY, POPULAR_POOLS, getRiskColor };