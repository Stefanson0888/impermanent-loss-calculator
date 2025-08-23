import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    header: {
      title: "Impermanent Loss Calculator",
      subtitle: "Professional DeFi analysis tool for liquidity providers",
      upgradeButton: "PRO",
      resetButton: "RESET",
      themeButton: {
        dark: "DARK",
        light: "LIGHT"
      }
    },
    calculator: {
      parameters: "Parameters",
      parametersSubtitle: "Enter your position details",
      protocol: "AMM Protocol",
      protocolMulti: "MULTI-PROTOCOL",
      selectToken: "Select Token (Optional)",
      livePrices: "LIVE PRICES",
      liveData: "LIVE DATA",
      initialPrice: "Initial Price ($)",
      currentPrice: "Current Price ($)",
      poolAPY: "Pool APY (%)",
      poolAPYNew: "NEW",
      investment: "Investment ($)",
      refreshData: "Refresh Live Data",
      calculateButton: "Calculate Impermanent Loss",
      calculating: "Calculating...",
      updating: "Updating...",
      autoFilled: "AUTO-FILLED",
      popularPairs: "Popular pairs: ETH/USDT ~25-45%, BTC/USDT ~15-30%"
    },
    results: {
      title: "Analysis Results",
      subtitle: "Your position performance",
      hodlStrategy: "HODL Strategy",
      lpStrategy: "LP Strategy",
      lpStrategyWithFees: "+Fees",
      impermanentLoss: "Impermanent Loss",
      betterStrategy: "Better Strategy",
      withoutFees: "Without fees",
      afterFees: "After fees",
      scenarioAnalysis: "Scenario Analysis",
      scenarioSubtitle: "\"What if\" price changes - plan your LP strategy",
      feesAnalysis: "Fees Analysis",
      feesSubtitle: "Trading fees earnings breakdown",
      perDay: "Per Day",
      perWeek: "Per Week", 
      perMonth: "Per Month",
      total: "Days Total",
      breakEvenAnalysis: "Break-even Analysis",
      breakEvenSubtitle: "Time for fees to compensate IL",
      noILToCompensate: "No impermanent loss to compensate!",
      never: "Never",
      daysExactly: "days exactly"
    },
    education: {
      title: "Learn DeFi & Impermanent Loss",
      subtitle: "Master the fundamentals of liquidity providing",
      realTimeData: "Real-Time Pool Data",
      dataDescription: "APY rates are sourced from Uniswap V3, PancakeSwap V3, Curve, and other major DEX protocols. Data is updated every 6 hours to ensure accuracy. Volume and TVL figures reflect current market conditions."
    },
    footer: {
      company: "ILCalculator.pro",
      description: "Professional DeFi analytics for liquidity providers",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      refund: "Refund Policy",
      contact: "Contact Us",
      copyright: "© 2025 ILCalculator.pro",
      madeBy: "Made by Stefanson for DeFi community"
    },
    notifications: {
      dataCleared: "All data cleared! 🧹",
      welcomeDarkSide: "WELCOME TO THE DARK SIDE",
      clearConfirm: "Clear all saved data? This will reset all fields.",
      error: "Error"
    },
    tooltips: {
      upgradeTooltip: "Upgrade to Pro - Unlock all features",
      resetTooltip: "Clear all saved data - Reset the Force",
      lightSideTooltip: "Switch to Light Side",
      darkSideTooltip: "Join the Dark Side",
      changeLanguage: "Change Language"
    },
    poolData: {
      topPools: "Top %s Pools (%d found)",
      clickToUse: "Click to use APY",
      dataSource: "Data from DefiLlama.",
      findingPools: "Finding best pools for %s...",
      fetchingPrice: "Fetching live price data...",
      lastUpdated: "Last updated: %s"
    }
  },
  es: {
    header: {
      title: "Calculadora de Pérdida Impermanente",
      subtitle: "Herramienta profesional de análisis DeFi para proveedores de liquidez",
      upgradeButton: "PRO",
      resetButton: "RESET",
      themeButton: {
        dark: "OSCURO",
        light: "CLARO"
      }
    },
    calculator: {
      parameters: "Parámetros",
      parametersSubtitle: "Ingresa los detalles de tu posición",
      protocol: "Protocolo AMM",
      protocolMulti: "MULTI-PROTOCOLO",
      selectToken: "Seleccionar Token (Opcional)",
      livePrices: "PRECIOS EN VIVO",
      liveData: "DATOS EN VIVO",
      initialPrice: "Precio Inicial ($)",
      currentPrice: "Precio Actual ($)",
      poolAPY: "APY del Pool (%)",
      poolAPYNew: "NUEVO",
      investment: "Inversión ($)",
      refreshData: "Actualizar Datos en Vivo",
      calculateButton: "Calcular Pérdida Impermanente",
      calculating: "Calculando...",
      updating: "Actualizando...",
      autoFilled: "AUTO-COMPLETADO",
      popularPairs: "Pares populares: ETH/USDT ~25-45%, BTC/USDT ~15-30%"
    },
    results: {
      title: "Resultados del Análisis",
      subtitle: "Rendimiento de tu posición",
      hodlStrategy: "Estrategia HODL",
      lpStrategy: "Estrategia LP",
      lpStrategyWithFees: "+Comisiones",
      impermanentLoss: "Pérdida Impermanente",
      betterStrategy: "Mejor Estrategia",
      withoutFees: "Sin comisiones",
      afterFees: "Después de comisiones",
      scenarioAnalysis: "Análisis de Escenarios",
      scenarioSubtitle: "Cambios de precio \"¿Qué pasaría si?\" - planifica tu estrategia LP",
      feesAnalysis: "Análisis de Comisiones",
      feesSubtitle: "Desglose de ganancias por comisiones de trading",
      perDay: "Por Día",
      perWeek: "Por Semana",
      perMonth: "Por Mes", 
      total: "Días Total",
      breakEvenAnalysis: "Análisis de Punto de Equilibrio",
      breakEvenSubtitle: "Tiempo para que las comisiones compensen la PI",
      noILToCompensate: "¡No hay pérdida impermanente que compensar!",
      never: "Nunca",
      daysExactly: "días exactamente"
    },
    education: {
      title: "Aprende DeFi y Pérdida Impermanente",
      subtitle: "Domina los fundamentos de proveer liquidez",
      realTimeData: "Datos de Pool en Tiempo Real",
      dataDescription: "Las tasas APY provienen de Uniswap V3, PancakeSwap V3, Curve y otros protocolos DEX principales. Los datos se actualizan cada 6 horas para garantizar precisión. Las cifras de volumen y TVL reflejan las condiciones actuales del mercado."
    },
    footer: {
      company: "ILCalculator.pro",
      description: "Análisis DeFi profesional para proveedores de liquidez",
      terms: "Términos de Servicio",
      privacy: "Política de Privacidad",
      refund: "Política de Reembolso",
      contact: "Contáctanos",
      copyright: "© 2025 ILCalculator.pro",
      madeBy: "Hecho por Stefanson para la comunidad DeFi"
    },
    notifications: {
      dataCleared: "¡Todos los datos eliminados! 🧹",
      welcomeDarkSide: "BIENVENIDO AL LADO OSCURO",
      clearConfirm: "¿Eliminar todos los datos guardados? Esto reiniciará todos los campos.",
      error: "Error"
    },
    tooltips: {
      upgradeTooltip: "Actualizar a Pro - Desbloquea todas las funciones",
      resetTooltip: "Eliminar todos los datos guardados - Reiniciar la Fuerza",
      lightSideTooltip: "Cambiar al Lado de la Luz",
      darkSideTooltip: "Únete al Lado Oscuro",
      changeLanguage: "Cambiar Idioma"
    },
    poolData: {
      topPools: "Top %s Pools (%d encontrados)",
      clickToUse: "Haz clic para usar APY",
      dataSource: "Datos de DefiLlama.",
      findingPools: "Buscando mejores pools para %s...",
      fetchingPrice: "Obteniendo datos de precios en vivo...",
      lastUpdated: "Última actualización: %s"
    }
  },
  pt: {
    header: {
      title: "Calculadora de Perda Impermanente",
      subtitle: "Ferramenta profissional de análise DeFi para provedores de liquidez",
      upgradeButton: "PRO",
      resetButton: "RESET",
      themeButton: {
        dark: "ESCURO",
        light: "CLARO"
      }
    },
    calculator: {
      parameters: "Parâmetros",
      parametersSubtitle: "Digite os detalhes da sua posição",
      protocol: "Protocolo AMM",
      protocolMulti: "MULTI-PROTOCOLO",
      selectToken: "Selecionar Token (Opcional)",
      livePrices: "PREÇOS AO VIVO",
      liveData: "DADOS AO VIVO",
      initialPrice: "Preço Inicial ($)",
      currentPrice: "Preço Atual ($)",
      poolAPY: "APY do Pool (%)",
      poolAPYNew: "NOVO",
      investment: "Investimento ($)",
      refreshData: "Atualizar Dados ao Vivo",
      calculateButton: "Calcular Perda Impermanente",
      calculating: "Calculando...",
      updating: "Atualizando...",
      autoFilled: "AUTO-PREENCHIDO",
      popularPairs: "Pares populares: ETH/USDT ~25-45%, BTC/USDT ~15-30%"
    },
    results: {
      title: "Resultados da Análise",
      subtitle: "Performance da sua posição",
      hodlStrategy: "Estratégia HODL",
      lpStrategy: "Estratégia LP",
      lpStrategyWithFees: "+Taxas",
      impermanentLoss: "Perda Impermanente",
      betterStrategy: "Melhor Estratégia",
      withoutFees: "Sem taxas",
      afterFees: "Após taxas",
      scenarioAnalysis: "Análise de Cenários",
      scenarioSubtitle: "Mudanças de preço \"E se?\" - planeje sua estratégia LP",
      feesAnalysis: "Análise de Taxas",
      feesSubtitle: "Detalhamento dos ganhos com taxas de trading",
      perDay: "Por Dia",
      perWeek: "Por Semana",
      perMonth: "Por Mês",
      total: "Dias Total",
      breakEvenAnalysis: "Análise de Ponto de Equilíbrio",
      breakEvenSubtitle: "Tempo para as taxas compensarem a PI",
      noILToCompensate: "Sem perda impermanente para compensar!",
      never: "Nunca",
      daysExactly: "dias exatamente"
    },
    education: {
      title: "Aprenda DeFi e Perda Impermanente",
      subtitle: "Domine os fundamentos de fornecer liquidez",
      realTimeData: "Dados de Pool em Tempo Real",
      dataDescription: "As taxas APY são obtidas do Uniswap V3, PancakeSwap V3, Curve e outros protocolos DEX principais. Os dados são atualizados a cada 6 horas para garantir precisão. Os valores de volume e TVL refletem as condições atuais do mercado."
    },
    footer: {
      company: "ILCalculator.pro",
      description: "Análise DeFi profissional para provedores de liquidez",
      terms: "Termos de Serviço",
      privacy: "Política de Privacidade",
      refund: "Política de Reembolso",
      contact: "Fale Conosco",
      copyright: "© 2025 ILCalculator.pro",
      madeBy: "Feito por Stefanson para a comunidade DeFi"
    },
    notifications: {
      dataCleared: "Todos os dados limpos! 🧹",
      welcomeDarkSide: "BEM-VINDO AO LADO NEGRO",
      clearConfirm: "Limpar todos os dados salvos? Isso redefinirá todos os campos.",
      error: "Erro"
    },
    tooltips: {
      upgradeTooltip: "Atualizar para Pro - Desbloqueie todos os recursos",
      resetTooltip: "Limpar todos os dados salvos - Redefinir a Força",
      lightSideTooltip: "Mudar para o Lado da Luz",
      darkSideTooltip: "Junte-se ao Lado Negro",
      changeLanguage: "Mudar Idioma"
    },
    poolData: {
      topPools: "Top %s Pools (%d encontrados)",
      clickToUse: "Clique para usar APY",
      dataSource: "Dados do DefiLlama.",
      findingPools: "Encontrando melhores pools para %s...",
      fetchingPrice: "Buscando dados de preços ao vivo...",
      lastUpdated: "Última atualização: %s"
    }
  }
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Try to get language from localStorage or browser
    const saved = localStorage.getItem('ilc_language');
    if (saved && translations[saved]) return saved;
    
    const browserLang = navigator.language.split('-')[0];
    return translations[browserLang] ? browserLang : 'en';
  });

  const t = (key, ...params) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
    }
    
    // Simple string interpolation for %s and %d
    if (typeof value === 'string' && params.length > 0) {
      return value.replace(/%[sd]/g, (match) => {
        const param = params.shift();
        return param !== undefined ? param.toString() : match;
      });
    }
    
    return value;
  };

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLanguage(newLang);
      localStorage.setItem('ilc_language', newLang);
    }
  };

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: changeLanguage,
      t,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  );
};