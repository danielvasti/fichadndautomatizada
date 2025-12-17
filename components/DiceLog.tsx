import React from 'react';
import { RollResult } from '../types';

interface DiceLogProps {
  lastRoll: RollResult | null;
}

export const DiceLog: React.FC<DiceLogProps> = ({ lastRoll }) => {
  if (!lastRoll) return null;

  let colorClass = "text-white";
  if (lastRoll.crit) colorClass = "text-green-400";
  if (lastRoll.critFail) colorClass = "text-red-400";

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 bg-opacity-95 p-4 rounded-lg shadow-xl border-2 border-yellow-600 w-64 z-50 animate-bounce-in text-gray-100">
      <div className="text-gray-400 text-xs uppercase font-bold mb-1">Última Rolagem</div>
      <div className="flex justify-between items-baseline border-b border-gray-700 pb-2 mb-2">
        <span className="font-bold text-lg text-yellow-500">{lastRoll.label}</span>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <div className={`text-4xl font-bold ${colorClass}`}>
          {lastRoll.total}
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-1 font-mono">
        {lastRoll.breakdown 
            ? lastRoll.breakdown 
            : `[${lastRoll.dieRoll}] ${lastRoll.modifier >= 0 ? '+' : ''}${lastRoll.modifier}`
        }
      </div>
      {lastRoll.crit && <div className="text-center text-green-400 font-bold text-sm mt-1">CRÍTICO!</div>}
      {lastRoll.critFail && <div className="text-center text-red-400 font-bold text-sm mt-1">FALHA CRÍTICA!</div>}
    </div>
  );
};