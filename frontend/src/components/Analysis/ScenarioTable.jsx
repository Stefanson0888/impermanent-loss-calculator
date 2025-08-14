import React from 'react';
import { calculateILAdvanced } from '../../services/calculations/impermanentLoss';
import { POPULAR_POOLS } from '../../data/pools';

const ScenarioTable = React.memo(({ currentOldPrice, initialInvestment, poolAPY, selectedProtocol, darkMode }) => {
    const scenarios = [
      { label: "-50%", multiplier: 0.5, color: "red" },
      { label: "-25%", multiplier: 0.75, color: "orange" },
      { label: "-10%", multiplier: 0.9, color: "yellow" },
      { label: "+10%", multiplier: 1.1, color: "yellow" },
      { label: "+25%", multiplier: 1.25, color: "orange" },
      { label: "+50%", multiplier: 1.5, color: "red" },
      { label: "+100%", multiplier: 2.0, color: "red" }
    ];
  
    const getColorClass = (color, type, darkMode) => {
      const colors = {
        red: darkMode 
          ? (type === 'bg' ? 'bg-red-900/30' : 'text-red-400')
          : (type === 'bg' ? 'bg-red-50' : 'text-red-600'),
        orange: darkMode 
          ? (type === 'bg' ? 'bg-orange-900/30' : 'text-orange-400')
          : (type === 'bg' ? 'bg-orange-50' : 'text-orange-600'),
        yellow: darkMode 
          ? (type === 'bg' ? 'bg-yellow-900/30' : 'text-yellow-400')
          : (type === 'bg' ? 'bg-yellow-50' : 'text-yellow-600')
      };
      return colors[color] || '';
    };
  
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <th className={`text-left p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Price Change
              </th>
              <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                New Price
              </th>
              <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                HODL
              </th>
              <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                LP {poolAPY > 0 ? '+Fees' : ''}
              </th>
              <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                IL Amount
              </th>
              <th className={`text-right p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                IL %
              </th>
              <th className={`text-center p-3 font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Winner
              </th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((scenario, index) => {
              const newPrice = currentOldPrice * scenario.multiplier;
              const calc = calculateILAdvanced(currentOldPrice, newPrice, initialInvestment, poolAPY, selectedProtocol);
              
              if (!calc) return null;
  
              const lpDisplayValue = poolAPY > 0 ? calc.lpValueWithFees : calc.lpValue;
              const ilAfterFees = poolAPY > 0 ? lpDisplayValue - calc.hodlValue : calc.impermanentLossUSD;
              const ilAfterFeesPercent = poolAPY > 0 ? ((ilAfterFees / initialInvestment) * 100).toFixed(4) : calc.impermanentLossPercent;
  
              return (
                <tr 
                  key={index}
                  className={`border-b transition-colors duration-300 ${
                    darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-200 hover:bg-gray-50'
                  } ${getColorClass(scenario.color, 'bg', darkMode)}`}
                >
                  <td className={`p-3 font-semibold ${getColorClass(scenario.color, 'text', darkMode)}`}>
                    {scenario.label}
                  </td>
                  <td className={`p-3 text-right ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    ${newPrice.toFixed(2)}
                  </td>
                  <td className={`p-3 text-right font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ${calc.hodlValue}
                    <div className={`text-xs ${calc.hodlProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ({calc.hodlProfitPercent}%)
                    </div>
                  </td>
                  <td className={`p-3 text-right font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    ${lpDisplayValue}
                    <div className={`text-xs ${(poolAPY > 0 ? calc.lpProfitWithFees : calc.lpProfit) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ({poolAPY > 0 ? calc.lpProfitPercentWithFees : calc.lpProfitPercent}%)
                    </div>
                  </td>
                  <td className={`p-3 text-right font-medium ${ilAfterFees < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${Math.abs(ilAfterFees.toFixed(2))}
                  </td>
                  <td className={`p-3 text-right font-medium ${parseFloat(ilAfterFeesPercent) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {ilAfterFeesPercent}%
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      calc.betterStrategy === 'HODL' 
                        ? darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                        : darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {calc.betterStrategy}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        <div className={`mt-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          💡 Red rows = high IL risk, Yellow rows = moderate IL risk. 
          {poolAPY > 0 && ` Fees APY: ${poolAPY}% (30-day calculation).`}
        </div>
      </div>
    );
});

export default ScenarioTable;