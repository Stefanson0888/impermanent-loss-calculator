import { API_CONFIG, getCachedData, setCachedData } from './cache';

const DefiLlamaAPI = {
// Отримання пулів протоколу
async getProtocolPools(protocol) {
    const cacheKey = `pools_${protocol}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
    const response = await fetch(
        `${API_CONFIG.DEFILLAMA_BASE}/pools`
    );
    
    if (!response.ok) throw new Error('DefiLlama API error');
    
    const data = await response.json();
    const protocolPools = data.data
        ?.filter(pool => pool.project?.toLowerCase().includes(protocol.toLowerCase()))
        ?.slice(0, 20) || [];
    
    const result = protocolPools.map(pool => ({
        id: pool.pool,
        symbol: pool.symbol,
        protocol: pool.project,
        apy: pool.apy || 0,
        apyBase: pool.apyBase || 0,
        apyReward: pool.apyReward || 0,
        tvl: pool.tvlUsd || 0,
        volume24h: pool.volumeUsd1d || 0,
        chain: pool.chain,
        stablePool: pool.stablecoin || false,
        ilRisk: pool.il7d || 0
    }));
    
    setCachedData(cacheKey, result);
    return result;
    } catch (error) {
    console.error('Error fetching protocol pools:', error);
    return [];
    }
},

// Топ пули
async getTopPools(limit = 50) {
    const cacheKey = `top_pools_${limit}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
    const response = await fetch(
        `${API_CONFIG.DEFILLAMA_BASE}/pools`
    );
    
    if (!response.ok) throw new Error('DefiLlama API error');
    
    const data = await response.json();
    const topPools = data.data
        ?.sort((a, b) => (b.tvlUsd || 0) - (a.tvlUsd || 0))
        ?.slice(0, limit) || [];
    
    const result = topPools.map(pool => ({
        id: pool.pool,
        symbol: pool.symbol,
        protocol: pool.project,
        apy: pool.apy || 0,
        apyBase: pool.apyBase || 0,
        apyReward: pool.apyReward || 0,
        tvl: pool.tvlUsd || 0,
        volume24h: pool.volumeUsd1d || 0,
        chain: pool.chain,
        stablePool: pool.stablecoin || false,
        ilRisk: pool.il7d || 0,
        lastUpdated: new Date().toLocaleTimeString()
    }));
    
    setCachedData(cacheKey, result);
    return result;
    } catch (error) {
    console.error('Error fetching top pools:', error);
    return [];
    }
},

// Пошук пулів за парою токенів
async findPoolsForPair(token1, token2) {
    const cacheKey = `pair_${token1}_${token2}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    try {
    const response = await fetch(
        `${API_CONFIG.DEFILLAMA_BASE}/pools`
    );
    
    if (!response.ok) throw new Error('DefiLlama API error');
    
    const data = await response.json();
    const pairPools = data.data?.filter(pool => {
        const symbol = pool.symbol?.toLowerCase() || '';
        const t1 = token1.toLowerCase();
        const t2 = token2.toLowerCase();
        return symbol.includes(t1) && symbol.includes(t2);
    })?.slice(0, 10) || [];
    
    const result = pairPools.map(pool => ({
        id: pool.pool,
        symbol: pool.symbol,
        protocol: pool.project,
        apy: pool.apy || 0,
        tvl: pool.tvlUsd || 0,
        volume24h: pool.volumeUsd1d || 0,
        chain: pool.chain,
        ilRisk: pool.il7d || 0
    }));
    
    setCachedData(cacheKey, result);
    return result;
    } catch (error) {
    console.error('Error finding pools for pair:', error);
    return [];
    }
}
};

export { DefiLlamaAPI };