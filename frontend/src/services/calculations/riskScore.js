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

export { calculateAdvancedRiskScore };