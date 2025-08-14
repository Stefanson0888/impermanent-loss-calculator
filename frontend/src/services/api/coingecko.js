import { API_CONFIG, getCachedData, setCachedData } from './cache';

const CoinGeckoAPI = {
    // Отримання ціни токена
    async getTokenPrice(tokenId) {
      const cacheKey = `price_${tokenId}`;
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
  
      try {
        const response = await fetch(
          `${API_CONFIG.COINGECKO_BASE}/simple/price?ids=${tokenId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`
        );
        
        if (!response.ok) throw new Error('CoinGecko API error');
        
        const data = await response.json();
        const result = {
          price: data[tokenId]?.usd || 0,
          change24h: data[tokenId]?.usd_24h_change || 0,
          marketCap: data[tokenId]?.usd_market_cap || 0,
          lastUpdated: new Date().toLocaleTimeString()
        };
        
        setCachedData(cacheKey, result);
        return result;
      } catch (error) {
        console.error('Error fetching token price:', error);
        return { price: 0, change24h: 0, marketCap: 0, error: error.message };
      }
    },
  
    // Пошук токена за символом
    async searchToken(symbol) {
      const cacheKey = `search_${symbol}`;
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
  
      try {
        const response = await fetch(
          `${API_CONFIG.COINGECKO_BASE}/search?query=${symbol}`
        );
        
        if (!response.ok) throw new Error('Search API error');
        
        const data = await response.json();
        const result = data.coins?.slice(0, 5) || [];
        
        setCachedData(cacheKey, result);
        return result;
      } catch (error) {
        console.error('Error searching token:', error);
        return [];
      }
    },
  
    // Топ токени
    async getTopTokens(limit = 50) {
      const cacheKey = `top_tokens_${limit}`;
      const cached = getCachedData(cacheKey);
      if (cached) return cached;
  
      try {
        const response = await fetch(
          `${API_CONFIG.COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`
        );
        
        if (!response.ok) throw new Error('Top tokens API error');
        
        const data = await response.json();
        const result = data.map(coin => ({
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          marketCap: coin.market_cap,
          image: coin.image
        }));
        
        setCachedData(cacheKey, result);
        return result;
      } catch (error) {
        console.error('Error fetching top tokens:', error);
        return [];
      }
    }
  };

  export { CoinGeckoAPI };