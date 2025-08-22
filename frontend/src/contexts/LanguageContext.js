import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    header: {
      title: "Impermanent Loss Calculator",
      subtitle: "Professional DeFi analysis tool for liquidity providers"
    },
    calculator: {
      parameters: "Parameters",
      parametersSubtitle: "Enter your position details",
      protocol: "AMM Protocol",
      protocolMulti: "MULTI-PROTOCOL",
      selectToken: "Select Token (Optional)",
      livePrices: "LIVE PRICES",
      initialPrice: "Initial Price ($)",
      currentPrice: "Current Price ($)",
      poolAPY: "Pool APY (%)",
      investment: "Investment ($)",
      refreshData: "Refresh Live Data",
      calculateButton: "Calculate Impermanent Loss",
      calculating: "Calculating..."
    },
    results: {
      title: "Analysis Results",
      subtitle: "Your position performance",
      hodlStrategy: "HODL Strategy",
      lpStrategy: "LP Strategy",
      impermanentLoss: "Impermanent Loss",
      betterStrategy: "Better Strategy"
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
      dataCleared: "All data cleared!",
      welcomeDarkSide: "WELCOME TO THE DARK SIDE"
    }
  },
  es: {
    header: {
      title: "Calculadora de Pérdida Impermanente",
      subtitle: "Herramienta profesional de análisis DeFi para proveedores de liquidez"
    },
    calculator: {
      parameters: "Parámetros",
      parametersSubtitle: "Ingresa los detalles de tu posición",
      protocol: "Protocolo AMM",
      protocolMulti: "MULTI-PROTOCOLO",
      selectToken: "Seleccionar Token (Opcional)",
      livePrices: "PRECIOS EN VIVO",
      initialPrice: "Precio Inicial ($)",
      currentPrice: "Precio Actual ($)",
      poolAPY: "APY del Pool (%)",
      investment: "Inversión ($)",
      refreshData: "Actualizar Datos en Vivo",
      calculateButton: "Calcular Pérdida Impermanente",
      calculating: "Calculando..."
    },
    results: {
      title: "Resultados del Análisis",
      subtitle: "Rendimiento de tu posición",
      hodlStrategy: "Estrategia HODL",
      lpStrategy: "Estrategia LP",
      impermanentLoss: "Pérdida Impermanente",
      betterStrategy: "Mejor Estrategia"
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
      dataCleared: "¡Todos los datos eliminados!",
      welcomeDarkSide: "BIENVENIDO AL LADO OSCURO"
    }
  }
};