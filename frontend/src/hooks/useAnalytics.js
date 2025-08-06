import { useEffect, useRef } from 'react';
import { initGA, event, pageview } from '../utils/gtag';

export const useAnalytics = () => {
  const initialized = useRef(false);

  useEffect(() => {
    // Ініціалізуємо GA тільки один раз
    if (!initialized.current && typeof window !== 'undefined') {
      initialized.current = true;
      
      // Перевіряємо чи користувач на мобільному
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Для мобільних - більша затримка
      const delay = isMobile ? 3000 : 2000;
      
      setTimeout(() => {
        initGA();
        // Відстежуємо поточну сторінку після ініціалізації
        setTimeout(() => pageview(window.location.pathname), 1000);
      }, delay);
    }
  }, []);

  // Легкі події для калькулятора - відправляємо тільки важливі
  const trackCalculation = (tokenA, tokenB, initialPrice, currentPrice, ilPercentage) => {
    // Відправляємо тільки якщо IL > 1% (фільтруємо спам)
    if (Math.abs(ilPercentage) > 1) {
      event({
        action: 'calculate_il_significant',
        category: 'calculator',
        label: `${tokenA}/${tokenB}`,
        value: Math.round(Math.abs(ilPercentage))
      });
    }
  };

  const trackTokenSelect = (tokenPair) => {
    event({
      action: 'select_tokens',
      category: 'calculator',
      label: tokenPair
    });
  };

  // Менш важливі події - з більшою затримкою
  const trackPriceInput = (inputType) => {
    // Debounce - не відправляємо кожен символ
    clearTimeout(window.priceInputTimeout);
    window.priceInputTimeout = setTimeout(() => {
      event({
        action: 'price_input',
        category: 'calculator',
        label: inputType
      });
    }, 2000);
  };

  const trackResultShare = (method) => {
    event({
      action: 'share_result',
      category: 'engagement',
      label: method
    });
  };

  const trackDonation = (amount, currency) => {
    event({
      action: 'donation_intent',
      category: 'monetization',
      label: currency,
      value: amount
    });
  };

  // Загальне відстеження з перевіркою
  const trackEvent = (eventData) => {
    // Перевіряємо чи подія важлива
    const importantEvents = ['calculate_il_significant', 'donation_intent', 'share_result'];
    const isImportant = importantEvents.includes(eventData.action);
    
    if (isImportant || Math.random() > 0.3) { // Семплінг 70% для неважливих подій
      event(eventData);
    }
  };

  return {
    trackCalculation,
    trackTokenSelect,
    trackPriceInput,
    trackResultShare,
    trackDonation,
    trackEvent
  };
};