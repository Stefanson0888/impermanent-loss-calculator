const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*'
}));
app.use(express.json());

function calculateIL(oldPrice, newPrice, initialInvestment = 2000, poolAPY = 0, protocolType = 'uniswap-v2') {
  // Перевірка вхідних даних
  if (!oldPrice || !newPrice || oldPrice <= 0 || newPrice <= 0) {
    throw new Error('Invalid prices provided');
  }

  // Співвідношення зміни ціни
  const priceRatio = newPrice / oldPrice;
  
  // ===== РІЗНІ ФОРМУЛИ ДЛЯ РІЗНИХ ПРОТОКОЛІВ =====
  let multiplier, ilPercent;
  
  switch (protocolType) {
    case 'uniswap-v2':
    case 'pancakeswap-v2':
    case 'sushiswap':
      // Класична константна формула x * y = k
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100;
      break;
      
    case 'uniswap-v3':
      // Concentrated liquidity - припустимо full range для простоти
      // В реальності залежить від price range, але для базового розрахунку використаємо v2 формулу з коефіцієнтом
      const concentrationFactor = 1.2; // IL може бути на 20% більший через концентрацію
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      multiplier = multiplier * concentrationFactor - (concentrationFactor - 1); // Adjustment for concentration
      ilPercent = (multiplier - 1) * 100;
      break;
      
    case 'curve':
      // StableSwap formula - значно менший IL для стейблкоїнів
      // Curve optimized для мінімального IL, особливо для малих price changes
      const priceChange = Math.abs(priceRatio - 1);
      if (priceChange < 0.05) {
        // Для змін < 5% IL майже немає
        multiplier = 1 - (priceChange * priceChange * 0.1);
      } else {
        // Для більших змін все ще менший IL ніж Uniswap
        multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
        multiplier = 1 - ((1 - multiplier) * 0.3); // IL на 70% менший ніж в Uniswap
      }
      ilPercent = (multiplier - 1) * 100;
      break;
      
    case 'balancer-weighted':
      // Weighted pools - припустимо 80/20 як найпопулярніше співвідношення
      // Формула для weighted pools: (w1 * p1^w1 * p2^w2) / (w1 * p1^w1 + w2 * p2^w2)
      const weight1 = 0.8; // 80% першого токену
      const weight2 = 0.2; // 20% другого токену
      const term1 = Math.pow(priceRatio, weight1);
      const term2 = Math.pow(1, weight2); // Другий токен (стейблкоїн) не змінюється
      multiplier = (weight1 * term1 + weight2 * term2) / (weight1 + weight2);
      ilPercent = (multiplier - 1) * 100;
      break;
      
    default:
      // Fallback до Uniswap v2 формули
      multiplier = (2 * Math.sqrt(priceRatio)) / (1 + priceRatio);
      ilPercent = (multiplier - 1) * 100;
  }
  
  // ===== РОЗРАХУНОК ДЛЯ КОНКРЕТНОЇ СУМИ =====
  const investmentPerAsset = initialInvestment / 2; // 50/50 розподіл для більшості протоколів
  
  // HODL стратегія: тримаємо початкові токени
  const ethAmount = investmentPerAsset / oldPrice; // Скільки ETH купили
  const hodlValue = (ethAmount * newPrice) + investmentPerAsset; // ETH по новій ціні + стейблкоїн
  
  // LP стратегія: токени в пулі з урахуванням IL
  const lpValue = initialInvestment * multiplier;
  
  // Різниця між стратегіями
  const impermanentLossUSD = lpValue - hodlValue;
  
  // ===== РОЗРАХУНОК FEES =====
  const dailyAPY = poolAPY / 365 / 100; // Конвертуємо річний APY в щоденний
  
  // Fees earnings per day/week/month/year
  const feesPerDay = initialInvestment * dailyAPY;
  const feesPerWeek = feesPerDay * 7;
  const feesPerMonth = feesPerDay * 30;
  const feesPerYear = feesPerDay * 365;
  
  // Break-even analysis: за скільки днів fees покриють IL
  let breakEvenDays = null;
  let breakEvenText = "Never";
  
  if (impermanentLossUSD < 0 && feesPerDay > 0) {
    // Якщо є негативний IL і позитивні fees
    const absIL = Math.abs(impermanentLossUSD);
    breakEvenDays = Math.ceil(absIL / feesPerDay);
    
    if (breakEvenDays <= 365) {
      if (breakEvenDays <= 30) {
        breakEvenText = `${breakEvenDays} days`;
      } else if (breakEvenDays <= 90) {
        const weeks = Math.ceil(breakEvenDays / 7);
        breakEvenText = `~${weeks} weeks`;
      } else {
        const months = Math.ceil(breakEvenDays / 30);
        breakEvenText = `~${months} months`;
      }
    } else {
      const years = Math.ceil(breakEvenDays / 365);
      breakEvenText = `~${years} years`;
    }
  } else if (impermanentLossUSD >= 0) {
    breakEvenText = "No IL to compensate!";
  }
  
  // LP стратегія з урахуванням fees (припустимо позицію тримали 30 днів)
  const assumedDays = 30;
  const totalFeesEarned = feesPerDay * assumedDays;
  const lpValueWithFees = lpValue + totalFeesEarned;
  const lpProfitWithFees = lpValueWithFees - initialInvestment;
  const lpProfitPercentWithFees = (lpProfitWithFees / initialInvestment) * 100;
  
  // Додаткові метрики
  const priceChangePercent = ((newPrice - oldPrice) / oldPrice) * 100;
  const hodlProfitUSD = hodlValue - initialInvestment;
  const hodlProfitPercent = (hodlProfitUSD / initialInvestment) * 100;
  const lpProfitUSD = lpValue - initialInvestment;
  const lpProfitPercent = (lpProfitUSD / initialInvestment) * 100;
  
  // Визначаємо кращу стратегію з урахуванням fees
  let betterStrategy = hodlValue > lpValueWithFees ? 'HODL' : 'LP';
  if (poolAPY === 0) {
    betterStrategy = hodlValue > lpValue ? 'HODL' : 'LP';
  }
  
  return {
    // Основні результати
    hodlValue: parseFloat(hodlValue.toFixed(2)),
    lpValue: parseFloat(lpValue.toFixed(2)),
    lpValueWithFees: parseFloat(lpValueWithFees.toFixed(2)),
    impermanentLossUSD: parseFloat(impermanentLossUSD.toFixed(2)),
    impermanentLossPercent: parseFloat(ilPercent.toFixed(4)),
    
    // Прибутки/збитки
    hodlProfit: parseFloat(hodlProfitUSD.toFixed(2)),
    hodlProfitPercent: parseFloat(hodlProfitPercent.toFixed(2)),
    lpProfit: parseFloat(lpProfitUSD.toFixed(2)),
    lpProfitPercent: parseFloat(lpProfitPercent.toFixed(2)),
    lpProfitWithFees: parseFloat(lpProfitWithFees.toFixed(2)),
    lpProfitPercentWithFees: parseFloat(lpProfitPercentWithFees.toFixed(2)),
    
    // Fees Analysis
    poolAPY: poolAPY,
    feesPerDay: parseFloat(feesPerDay.toFixed(2)),
    feesPerWeek: parseFloat(feesPerWeek.toFixed(2)),
    feesPerMonth: parseFloat(feesPerMonth.toFixed(2)),
    feesPerYear: parseFloat(feesPerYear.toFixed(2)),
    totalFeesEarned: parseFloat(totalFeesEarned.toFixed(2)),
    breakEvenDays: breakEvenDays,
    breakEvenText: breakEvenText,
    assumedDays: assumedDays,
    
    // Protocol Info
    protocolType: protocolType,
    protocolName: getProtocolDisplayName(protocolType),
    
    // Деталі
    priceChange: parseFloat(priceChangePercent.toFixed(2)),
    initialInvestment: initialInvestment,
    ethAmount: parseFloat(ethAmount.toFixed(6)),
    betterStrategy: betterStrategy
  };
}

// Helper function для отримання читабельної назви протоколу
function getProtocolDisplayName(protocolType) {
  const protocolNames = {
    'uniswap-v2': 'Uniswap V2',
    'uniswap-v3': 'Uniswap V3', 
    'pancakeswap-v2': 'PancakeSwap V2',
    'pancakeswap-v3': 'PancakeSwap V3',
    'curve': 'Curve Finance',
    'balancer-weighted': 'Balancer Weighted',
    'sushiswap': 'SushiSwap'
  };
  return protocolNames[protocolType] || 'Unknown Protocol';
}

// Ендпоінт
app.post('/calculate', (req, res) => {
  const { oldPrice, newPrice, initialInvestment, poolAPY, protocolType } = req.body;
  
  if (!oldPrice || !newPrice || oldPrice <= 0 || newPrice <= 0) {
    return res.status(400).json({ error: 'Invalid prices' });
  }
  
  try {
    const investment = initialInvestment || 2000;
    const apy = poolAPY || 0;
    const protocol = protocolType || 'uniswap-v2';
    
    const result = calculateIL(
      parseFloat(oldPrice), 
      parseFloat(newPrice), 
      parseFloat(investment),
      parseFloat(apy),
      protocol
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Calculation failed: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});