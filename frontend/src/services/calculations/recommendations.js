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

export { generateAdvancedRecommendation };