import { useEffect } from 'react';
import { initGA, event, pageview } from '../utils/gtag';

export const useAnalytics = () => {
  useEffect(() => {
    // Ініціалізуємо GA при першому завантаженні
    if (typeof window !== 'undefined' && !window.gtag) {
      initGA();
    }
    
    // Відстежуємо поточну сторінку
    pageview(window.location.pathname);
  }, []);

  // Спеціальні події для IL калькулятора
  const trackCalculation = (tokenA, tokenB, initialPrice, currentPrice, ilPercentage) => {
    event({
      action: 'calculate_impermanent_loss',
      category: 'calculator',
      label: `${tokenA}/${tokenB}`,
      value: Math.abs(ilPercentage)
    });
  };

  const trackTokenSelect = (tokenPair) => {
    event({
      action: 'select_token_pair',
      category: 'calculator',
      label: tokenPair
    });
  };

  const trackPriceInput = (inputType) => {
    event({
      action: 'price_input',
      category: 'calculator',
      label: inputType // 'initial_price' або 'current_price'
    });
  };

  const trackResultShare = (method) => {
    event({
      action: 'share_result',
      category: 'engagement',
      label: method // 'twitter', 'telegram', 'copy_link'
    });
  };

  const trackDonation = (amount, currency) => {
    event({
      action: 'donation_click',
      category: 'monetization',
      label: currency,
      value: amount
    });
  };

  return {
    trackCalculation,
    trackTokenSelect,
    trackPriceInput,
    trackResultShare,
    trackDonation,
    trackEvent: event
  };
};