import React, { useState } from 'react';
import { POPULAR_POOLS, getRiskColor } from '../../data/pools';

function AllPoolsSelector({ darkMode, onPoolSelect, selectedPool }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [riskFilter, setRiskFilter] = useState('All');
    
    const categories = {
      'Major': { name: 'Major Pairs', description: 'ETH, BTC, BNB pairs with high volume', icon: '🏆' },
      'Stable': { name: 'Stablecoin Pools', description: 'Low risk, stable returns', icon: '🛡️' },
      'Alt': { name: 'Altcoin Pairs', description: 'Higher risk, higher potential returns', icon: '🚀' },
      'DeFi': { name: 'DeFi Tokens', description: 'UNI, AAVE, COMP and other DeFi blue chips', icon: '⚡' }
    };
  
    const riskFilters = ['All', 'Low', 'Medium', 'High'];
  
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
            darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <span>View All Pools ({POPULAR_POOLS.length} available)</span>
          <span className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
        
        {isExpanded && (
          <div className={`mt-4 rounded-xl border transition-colors duration-300 ${
            darkMode ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50 border-gray-300'
          }`}>
            
            
            <div className={`p-4 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">Filter by risk:</span>
                {riskFilters.map((risk) => (
                  <button
                    key={risk}
                    onClick={() => setRiskFilter(risk)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
                      riskFilter === risk
                        ? darkMode
                          ? 'bg-blue-600 text-white'
                          : 'bg-blue-600 text-white'
                        : darkMode
                          ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>
            
            {Object.entries(categories).map(([categoryKey, category]) => {
              const poolsInCategory = POPULAR_POOLS.filter(pool => 
                pool.category === categoryKey && 
                (riskFilter === 'All' || pool.risk === riskFilter)
              );
              
              if (poolsInCategory.length === 0) return null;
              
              return (
                <div 
                  key={categoryKey}
                  className={`p-4 border-b last:border-b-0 ${
                    darkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {category.name} ({poolsInCategory.length})
                      </h4>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {category.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {poolsInCategory.map((pool) => (
                      <div
                        key={pool.id}
                        onClick={() => onPoolSelect(pool)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                          selectedPool === pool.id
                            ? darkMode 
                              ? 'border-orange-500 bg-orange-900/20' 
                              : 'border-orange-500 bg-orange-50'
                            : darkMode
                              ? 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                              : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                              {pool.name}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {pool.protocol}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-500 font-bold text-sm">
                              {pool.apy}%
                            </div>
                            <div className={`text-xs ${getRiskColor(pool.risk, darkMode)}`}>
                              {pool.risk}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-xs">
                          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {pool.tvl}
                          </div>
                          <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {pool.volume24h}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
}

export default AllPoolsSelector;