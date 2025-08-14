import { EXPANDED_PROTOCOLS } from '../../data/protocols';

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

export { 
    calculateProtocolEfficiency, 
    getProtocolComplexity,
    getProtocolConfig,
    calculateComplexityScore
};