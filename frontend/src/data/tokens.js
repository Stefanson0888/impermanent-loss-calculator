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
    'ETH': { name: 'Ethereum', category: 'Layer 1' },
    'BTC': { name: 'Bitcoin', category: 'Store of Value' },
    'USDT': { name: 'Tether', category: 'Stablecoin' },
    'USDC': { name: 'USD Coin', category: 'Stablecoin' },
    'BNB': { name: 'BNB', category: 'Exchange' },
    'SOL': { name: 'Solana', category: 'Layer 1' },
    'MATIC': { name: 'Polygon', category: 'Layer 2' },
    'UNI': { name: 'Uniswap', category: 'DEX' },
    'LINK': { name: 'Chainlink', category: 'Oracle' },
    'AAVE': { name: 'Aave', category: 'Lending' },
    'DAI': { name: 'MakerDAO', category: 'Stablecoin' },
    'WBTC': { name: 'Wrapped Bitcoin', category: 'Wrapped' },
    'AVAX': { name: 'Avalanche', category: 'Layer 1' },
    'CRV': { name: 'Curve DAO', category: 'DEX' },
    'COMP': { name: 'Compound', category: 'Lending' }
};

export { TOKEN_ID_MAPPING, POPULAR_TOKENS };