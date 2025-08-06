export const GA_TRACKING_ID = 'G-RF5LGJ496Y';

// Оптимізована ініціалізація GA з затримкою
export const initGA = () => {
  // Перевіряємо чи GA вже завантажений
  if (window.gtag) return;

  // Затримка на 2 секунди для кращого LCP
  setTimeout(() => {
    // Preconnect для швидшого підключення
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://www.googletagmanager.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://www.google-analytics.com';
    document.head.appendChild(preconnect2);

    // Завантажуємо GA асинхронно
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    
    // Ініціалізуємо тільки після завантаження
    script1.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){window.dataLayer.push(arguments);}
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID, {
        page_path: window.location.pathname,
        // Оптимізація для швидкості
        send_page_view: false, // Відправимо manually
        anonymize_ip: true,
        // Зменшуємо кількість запитів
        custom_map: {}
      });
      
      // Відправляємо page view після ініціалізації
      gtag('event', 'page_view', {
        page_path: window.location.pathname,
        page_title: document.title
      });
    };
    
    document.head.appendChild(script1);
  }, 2000); // Затримка 2 секунди
};

// Відстеження сторінок з перевіркою
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: document.title
    });
  }
};

// Батчинг подій для кращої продуктивності
let eventQueue = [];
let eventTimeout = null;

const flushEvents = () => {
  if (eventQueue.length === 0) return;
  
  eventQueue.forEach(eventData => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventData.action, {
        event_category: eventData.category,
        event_label: eventData.label,
        value: eventData.value
      });
    }
  });
  
  eventQueue = [];
  eventTimeout = null;
};

// Оптимізовані події з батчингом
export const event = ({ action, category, label, value }) => {
  // Додаємо подію в чергу
  eventQueue.push({ action, category, label, value });
  
  // Відправляємо батчем через 1 секунду
  if (eventTimeout) clearTimeout(eventTimeout);
  eventTimeout = setTimeout(flushEvents, 1000);
};