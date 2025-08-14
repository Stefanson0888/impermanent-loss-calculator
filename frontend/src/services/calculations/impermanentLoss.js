import { calculateAdvancedRiskScore } from './riskScore';
import { generateAdvancedRecommendation } from './recommendations';
import { calculateProtocolEfficiency, getProtocolComplexity } from './protocolEfficiency';

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

export { calculateILAdvanced };