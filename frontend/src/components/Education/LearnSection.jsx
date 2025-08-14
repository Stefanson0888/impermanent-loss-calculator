import React from 'react';

function LearnSection({ darkMode }) {
    const articles = [
      {
        title: "What is Impermanent Loss?",
        content: "Impermanent loss occurs when you provide liquidity to an AMM and the price of your deposited assets changes compared to when you deposited them. The bigger the change, the more you are exposed to impermanent loss. The loss is 'impermanent' because it only becomes permanent when you withdraw your liquidity.",
        key: "📉"
      },
  
      {
        title: "How do AMMs Work?",
        content: "Automated Market Makers (AMMs) use mathematical formulas to price assets and create liquidity pools. The most common formula is x * y = k (constant product), where x and y are the quantities of two tokens, and k is a constant. When someone trades, they change this ratio, which affects prices.",
        key: "⚖️"
      },
  
      {
        title: "Trading Fees: The IL Compensation",
        content: "When you provide liquidity, you earn a portion of trading fees (typically 0.25-0.3% per trade). These fees accumulate over time and often compensate for impermanent loss, especially in high-volume pools. The key is finding pools where fee income exceeds IL.",
        key: "💰"
      },
      
      {
        title: "LP Strategies: Risk vs Reward",
        content: "Conservative: Stable pairs (USDC/USDT) for minimal IL but lower APY. Moderate: Major pairs (ETH/USDT) for balanced risk/reward. Aggressive: New tokens for high APY but significant IL risk. Always consider fee income when evaluating strategies.",
        key: "🎯"
      }
    ];
  
    return (
      <div className="grid gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 border transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{article.key}</div>
              <div>
                <h3 className={`text-lg font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {article.title}
                </h3>
                <p className={`leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {article.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
}

export default LearnSection;