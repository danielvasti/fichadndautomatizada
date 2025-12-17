import React from 'react';
import { Attribute, ThemeStyles } from '../types';
import { calculateModifier, formatModifier } from '../utils';

interface AbilityScoreProps {
  attribute: Attribute;
  score: number;
  label: string;
  onChange: (val: number) => void;
  onRoll: () => void;
  theme: ThemeStyles;
}

export const AbilityScore: React.FC<AbilityScoreProps> = ({ attribute, score, label, onChange, onRoll, theme }) => {
  const mod = calculateModifier(score);

  return (
    <div className="flex flex-col items-center mb-4">
      <div className={`${theme.paperBg} border-2 ${theme.border} rounded-xl p-2 w-24 h-28 flex flex-col items-center justify-between relative shadow-sm`}>
        <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.subText} absolute top-1`}>{label}</span>
        
        <button 
          onClick={onRoll}
          className={`text-3xl font-header font-bold mt-4 hover:text-red-600 transition-colors cursor-pointer ${theme.text}`}
          title={`Rolar Teste de ${label}`}
        >
          {formatModifier(mod)}
        </button>
        
        <div className={`border ${theme.borderLight} rounded-full w-12 h-10 flex items-center justify-center ${theme.paperBg} -mb-5 z-10`}>
            <input 
                type="number" 
                value={score}
                onChange={(e) => onChange(parseInt(e.target.value) || 10)}
                className={`w-10 text-center font-bold text-lg bg-transparent outline-none ${theme.input}`}
            />
        </div>
      </div>
    </div>
  );
};