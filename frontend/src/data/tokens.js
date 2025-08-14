// Mapping популярних токенів до CoinGecko ID
const TOKEN_ID_MAPPING = {
    'ETH': 'ethereum',
    'BTC': 'bitcoin', 
    'BNB': 'binancecoin',
    'SOL': 'solana',
    'ADA': 'cardano',
    'MATIC': 'matic-network',
    'DOT': 'polkadot',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'AAVE': 'aave',
    'USDT': 'tether',
    'USDC': 'usd-coin',
    'DAI': 'dai',
    'WBTC': 'wrapped-bitcoin',
    'AVAX': 'avalanche-2',
    'ATOM': 'cosmos',
    'NEAR': 'near',
    'FTM': 'fantom',
    'CRV': 'curve-dao-token',
    'COMP': 'compound-governance-token'
};

const POPULAR_TOKENS = {
    'ETH': { name: 'Ethereum' },
    'BTC': { name: 'Bitcoin' },
    'BNB': { name: 'BNB' },
    'SOL': { name: 'Solana' },
    'ADA': { name: 'Cardano' },
    'MATIC': { name: 'Polygon' },
    'DOT': { name: 'Polkadot' },
    'LINK': { name: 'Chainlink' },
    'UNI': { name: 'Uniswap' },
    'AAVE': { name: 'Aave' }
};

export { TOKEN_ID_MAPPING, POPULAR_TOKENS };