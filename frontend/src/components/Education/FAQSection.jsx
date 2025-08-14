import React, { useState } from 'react';

function FAQSection({ darkMode }) {
    const [openFAQ, setOpenFAQ] = useState(null);
  
    const faqs = [
      {
        question: "When should I use HODL vs LP strategy?",
        answer: "HODL is better when you expect significant price appreciation and low trading volume. LP is better when you expect sideways price movement with high trading volume, as fees can compensate for IL."
      },
      {
        question: "How accurate is this calculator?",
        answer: "Our calculator uses the standard AMM formula (x*y=k) and real fee structures. However, it assumes constant APY and doesn't account for compounding, gas fees, or protocol-specific features like concentrated liquidity."
      },
      {
        question: "What's a good APY for LP positions?",
        answer: "It depends on the pair: Stablecoin pairs: 5-15% APY, Major pairs (ETH/BTC): 15-30% APY, Alt pairs: 25-50%+ APY (higher risk). Always compare APY with potential IL."
      },
      {
        question: "Can I lose all my money with IL?",
        answer: "No, IL cannot make you lose 100% of your investment. The maximum theoretical IL is about 25% if one token goes to zero. However, you still own tokens worth something in most scenarios."
      },
      {
        question: "Which platforms have the best fees?",
        answer: "Uniswap: 0.3% fees, high volume. PancakeSwap: 0.25% fees, BSC ecosystem. Curve: 0.04-0.4% fees, optimized for stables. SushiSwap: 0.25-0.3% fees, additional token rewards."
      },
      {
        question: "How often are fees distributed?",
        answer: "Fees are added to the pool automatically with each trade and compound continuously. You realize them when you withdraw liquidity. Some platforms also offer additional token rewards weekly/monthly."
      }
    ];
  
    return (
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`rounded-xl border transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-700/50 border-gray-600' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <button
              onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              className={`w-full text-left p-6 font-semibold transition-colors duration-300 ${
                darkMode ? 'text-white hover:text-purple-400' : 'text-gray-800 hover:text-purple-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{faq.question}</span>
                <span className={`text-xl transition-transform duration-300 ${
                  openFAQ === index ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </div>
            </button>
            {openFAQ === index && (
              <div className={`px-6 pb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <div className="leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
}

export default FAQSection;