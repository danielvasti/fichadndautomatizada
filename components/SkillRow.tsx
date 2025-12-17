import React from 'react';
import { Attribute, ThemeStyles } from '../types';
import { formatModifier } from '../utils';
import { ATTRIBUTE_SHORT_LABELS } from '../constants';

interface SkillRowProps {
  label: string;
  attribute: Attribute;
  calculatedModifier: number;
  overrideValue: string;
  isProficient: boolean;
  isExpertise?: boolean;
  onCycleProficiency: () => void;
  onChangeOverride: (val: string) => void;
  onRoll: (modifier: number) => void;
  theme: ThemeStyles;
}

export const SkillRow: React.FC<SkillRowProps> = ({ 
  label, 
  attribute, 
  calculatedModifier,
  overrideValue,
  isProficient,
  isExpertise,
  onCycleProficiency,
  onChangeOverride,
  onRoll,
  theme
}) => {
  
  // Determine effective value for display and rolling
  const effectiveValue = overrideValue !== "" ? parseInt(overrideValue) : calculatedModifier;
  const isOverridden = overrideValue !== "";

  return (
    <div className={`flex items-center text-sm border-b ${theme.borderLight} py-0.5 ${theme.highlight} group`}>
      {/* Proficiency Circle - Single Control */}
      <div className="relative flex items-center justify-center mr-2 w-5 h-5">
          <button 
            onClick={onCycleProficiency}
            className={`
              w-3 h-3 rounded-full border flex-shrink-0 transition-all
              ${theme.border}
              ${isExpertise ? `bg-current ring-2 ${theme.subText} ring-offset-1` : (isProficient ? 'bg-current' : 'bg-transparent')}
              ${isProficient || isExpertise ? theme.text : ''}
            `}
            title="Clique para alternar: Vazio -> Proficiente -> Especialista"
          >
          </button>
      </div>
      
      {/* Modifier Input */}
      <input 
        type="text"
        className={`w-8 text-center border-b ${theme.borderLight} mr-2 font-mono bg-transparent outline-none focus:border-red-600 ${isOverridden ? 'font-bold text-red-600' : theme.text}`}
        value={isOverridden ? overrideValue : formatModifier(calculatedModifier)}
        onChange={(e) => onChangeOverride(e.target.value)}
        placeholder={formatModifier(calculatedModifier)}
        title="Valor Final (Edite para sobrescrever)"
      />
      
      {/* Label and Roll */}
      <button 
        onClick={() => onRoll(effectiveValue)} 
        className={`flex-grow text-left flex items-baseline hover:text-red-600 cursor-pointer ${theme.text}`}
      >
        <span className="font-bold mr-1">{label}</span>
        <span className={`text-[10px] ${theme.subText}`}>({ATTRIBUTE_SHORT_LABELS[attribute]})</span>
      </button>
    </div>
  );
};