// API конфігурація
const API_CONFIG = {
    COINGECKO_BASE: 'https://api.coingecko.com/api/v3',
    DEFILLAMA_BASE: 'https://yields.llama.fi',
    CACHE_DURATION: 5 * 60 * 1000, // 5 хвилин
};

// Простий кеш для API запитів
const apiCache = new Map();

// Функція для кешування API запитів
function getCachedData(key) {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < API_CONFIG.CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key, data) {
  apiCache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export { API_CONFIG, apiCache, getCachedData, setCachedData };