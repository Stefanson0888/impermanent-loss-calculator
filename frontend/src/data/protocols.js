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

export { EXPANDED_PROTOCOLS };