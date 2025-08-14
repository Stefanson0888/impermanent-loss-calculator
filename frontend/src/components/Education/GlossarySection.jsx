import React from 'react';

function GlossarySection({ darkMode }) {
    const terms = [
      {
        term: "Impermanent Loss (IL)",
        definition: "The temporary loss of funds when providing liquidity compared to simply holding the tokens. It occurs due to price divergence between paired assets."
      },
      {
        term: "AMM (Automated Market Maker)",
        definition: "A decentralized protocol that uses mathematical formulas to price assets and provide liquidity, eliminating the need for traditional order books."
      },
      {
        term: "Liquidity Pool",
        definition: "A smart contract containing pairs of tokens that traders can swap against. LPs deposit tokens to earn fees from trades."
      },
      {
        term: "APY (Annual Percentage Yield)",
        definition: "The real rate of return earned on an investment, taking into account the effect of compounding interest over a year."
      },
      {
        term: "Slippage",
        definition: "The difference between the expected price of a trade and the actual price due to market movement or low liquidity."
      },
      {
        term: "TVL (Total Value Locked)",
        definition: "The total amount of cryptocurrency held in a DeFi protocol's smart contracts, indicating its popularity and trustworthiness."
      },
      {
        term: "Yield Farming",
        definition: "The practice of lending or staking cryptocurrency to generate high returns, often through providing liquidity to DeFi protocols."
      },
      {
        term: "LP Tokens",
        definition: "Tokens received when providing liquidity to a pool, representing your share of the pool and allowing you to withdraw your portion plus earned fees."
      }
    ];
  
    return (
      <div className="grid gap-4">
        {terms.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-6 border transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex flex-col">
              <h4 className={`text-lg font-bold mb-2 ${
                darkMode ? 'text-purple-400' : 'text-purple-600'
              }`}>
                {item.term}
              </h4>
              <p className={`leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {item.definition}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
}

export default GlossarySection;