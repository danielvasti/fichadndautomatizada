import React, { useState, useRef } from 'react';
import { Attribute, CharacterProfile, CharacterStats, RollResult, SkillState, SaveState, ThemeStyles } from './types';
import { SKILL_LIST, ATTRIBUTE_LABELS, ATTRIBUTE_SHORT_LABELS } from './constants';
import { calculateModifier, formatModifier, rollDie, parseAndRollDice } from './utils';
import { AbilityScore } from './components/AbilityScore';
import { SkillRow } from './components/SkillRow';
import { DiceLog } from './components/DiceLog';
import { Dices, Sword, Palette, Save, Upload, Wand2 } from 'lucide-react';

// --- THEME DEFINITIONS ---
type ThemeType = 'classic' | 'dark' | 'parchment';

const THEMES: Record<ThemeType, ThemeStyles> = {
  classic: {
    id: 'classic',
    label: 'Clássico',
    mainBg: 'bg-gray-200',
    paperBg: 'bg-white',
    text: 'text-gray-900',
    subText: 'text-gray-500',
    border: 'border-gray-800',
    borderLight: 'border-gray-300',
    accent: 'border-red-800',
    input: 'text-gray-900 placeholder-gray-400',
    panelBg: 'bg-gray-100',
    headerBg: 'bg-gray-200',
    highlight: 'hover:bg-gray-50',
    tabActive: 'bg-red-800 text-white',
    tabInactive: 'bg-gray-200 text-gray-600 hover:bg-gray-300'
  },
  dark: {
    id: 'dark',
    label: 'Noturno',
    mainBg: 'bg-gray-900',
    paperBg: 'bg-gray-800',
    text: 'text-gray-100',
    subText: 'text-gray-400',
    border: 'border-gray-500', // Lighter border for visibility against dark bg
    borderLight: 'border-gray-600',
    accent: 'border-red-600',
    input: 'text-white placeholder-gray-500', // Explicit white text
    panelBg: 'bg-gray-700',
    headerBg: 'bg-gray-700',
    highlight: 'hover:bg-gray-600',
    tabActive: 'bg-red-700 text-white',
    tabInactive: 'bg-gray-700 text-gray-400 hover:bg-gray-600'
  },
  parchment: {
    id: 'parchment',
    label: 'Pergaminho',
    mainBg: 'bg-stone-300',
    paperBg: 'bg-[#fdf6e3]', // Solarized light base / warm paper
    text: 'text-stone-900',
    subText: 'text-stone-500',
    border: 'border-stone-600',
    borderLight: 'border-stone-400',
    accent: 'border-amber-700',
    input: 'text-stone-900 placeholder-stone-400',
    panelBg: 'bg-[#eee8d5]',
    headerBg: 'bg-[#eee8d5]',
    highlight: 'hover:bg-[#eee8d5]',
    tabActive: 'bg-amber-700 text-white',
    tabInactive: 'bg-[#eee8d5] text-stone-600 hover:bg-[#e0d8c0]'
  }
};

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'main' | 'background' | 'spells'>('main');
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('classic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const theme = THEMES[currentTheme];

  const [profile, setProfile] = useState<CharacterProfile>({
    name: '',
    classLevel: '',
    background: '',
    playerName: '',
    race: '',
    alignment: '',
    xp: '',
    age: '',
    height: '',
    weight: '',
    eyes: '',
    skin: '',
    hair: '',
    appearance: '',
    backstory: '',
    alliesAndOrgs: '',
    orgSymbol: '',
    orgName: '',
    treasure: '',
    additionalFeatures: ''
  });

  // Initialize skills with proper structure
  const initialSkills: Record<string, SkillState> = {};
  SKILL_LIST.forEach(skill => {
    initialSkills[skill.name] = { proficient: false, expertise: false, override: '' };
  });

  const [stats, setStats] = useState<CharacterStats>({
    attributes: {
      [Attribute.STR]: 10,
      [Attribute.DEX]: 10,
      [Attribute.CON]: 10,
      [Attribute.INT]: 10,
      [Attribute.WIS]: 10,
      [Attribute.CHA]: 10,
    },
    proficiencyBonus: '2',
    savingThrows: {
      [Attribute.STR]: { proficient: false, override: '' },
      [Attribute.DEX]: { proficient: false, override: '' },
      [Attribute.CON]: { proficient: false, override: '' },
      [Attribute.INT]: { proficient: false, override: '' },
      [Attribute.WIS]: { proficient: false, override: '' },
      [Attribute.CHA]: { proficient: false, override: '' },
    },
    skills: initialSkills,
    passivePerception: '', // Empty = auto
    hp: { current: '10', max: '10', temp: '' },
    hitDice: { total: '1d8', current: '1' },
    deathSaves: { successes: [false, false, false], failures: [false, false, false] },
    combat: { ac: '10', initiative: '', speed: '9m' },
    attacks: [
      { id: '1', name: '', bonus: '', damage: '', type: '', stat: Attribute.STR, isProficient: true },
      { id: '2', name: '', bonus: '', damage: '', type: '', stat: Attribute.STR, isProficient: true },
      { id: '3', name: '', bonus: '', damage: '', type: '', stat: Attribute.STR, isProficient: true },
    ],
    equipment: '',
    money: { cp: '', sp: '', ep: '', gp: '', pp: '' },
    traits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    features: '',
    proficienciesLanguages: '',
    spellcasting: {
      class: '',
      ability: Attribute.INT,
      slots: {
        '1': { total: '', expended: '' },
        '2': { total: '', expended: '' },
        '3': { total: '', expended: '' },
        '4': { total: '', expended: '' },
        '5': { total: '', expended: '' },
        '6': { total: '', expended: '' },
        '7': { total: '', expended: '' },
        '8': { total: '', expended: '' },
        '9': { total: '', expended: '' },
      },
      spells: {
        '0': ['', '', '', '', '', '', '', ''],
        '1': ['', '', '', '', '', '', '', '', '', '', '', ''],
        '2': ['', '', '', '', '', '', '', '', '', '', '', ''],
        '3': ['', '', '', '', '', '', '', '', '', '', '', ''],
        '4': ['', '', '', '', '', '', '', '', '', '', '', ''],
        '5': ['', '', '', '', '', '', '', '', '', '', ''],
        '6': ['', '', '', '', '', '', '', '', '', '', ''],
        '7': ['', '', '', '', '', '', '', '', '', '', ''],
        '8': ['', '', '', '', '', '', '', ''],
        '9': ['', '', '', '', '', '', '', ''],
      }
    }
  });

  const [lastRoll, setLastRoll] = useState<RollResult | null>(null);

  // --- HELPERS ---

  const cycleTheme = () => {
    const keys = Object.keys(THEMES) as ThemeType[];
    const nextIndex = (keys.indexOf(currentTheme) + 1) % keys.length;
    setCurrentTheme(keys[nextIndex]);
  };

  const saveCharacter = () => {
    const data = { profile, stats };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${profile.name || 'personagem'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadCharacter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if(data.profile) setProfile(data.profile);
        if(data.stats) setStats(data.stats);
        if(fileInputRef.current) fileInputRef.current.value = '';
      } catch(err) { 
        alert('Erro ao ler arquivo: formato inválido.'); 
      }
    };
    reader.readAsText(file);
  };

  const getAttributeMod = (attr: Attribute) => calculateModifier(stats.attributes[attr]);
  const getPB = () => parseInt(stats.proficiencyBonus) || 0;

  const rollD20 = (modifier: number, label: string) => {
    const die = rollDie(20);
    const total = die + modifier;
    setLastRoll({
      dieRoll: die,
      modifier,
      total,
      label,
      crit: die === 20,
      critFail: die === 1,
      timestamp: Date.now(),
      breakdown: `[${die}] ${formatModifier(modifier)}`
    });
  };

  const rollDamage = (damageString: string, statBonus: number, label: string) => {
    let result;
    const isComplex = damageString.includes('+') || damageString.includes('-');
    
    if (isComplex) {
        result = parseAndRollDice(damageString);
    } else {
        const diceResult = parseAndRollDice(damageString);
        result = {
            total: diceResult.total + statBonus,
            dieRoll: diceResult.total,
            breakdown: `[${diceResult.total}] ${formatModifier(statBonus)}`
        };
        // Re-use logic if just number
        if (diceResult.total === 0 && parseInt(damageString)) {
           const flat = parseInt(damageString);
           result = { total: flat, dieRoll: 0, breakdown: `${flat}` };
        }
    }

    setLastRoll({
        dieRoll: result.dieRoll,
        modifier: isComplex ? 0 : statBonus, 
        total: result.total,
        label: `Dano (${label})`,
        crit: false,
        critFail: false,
        timestamp: Date.now(),
        breakdown: result.breakdown
    });
  };

  // --- CALCULATIONS ---

  const getCalculatedSave = (attr: Attribute) => {
    const mod = getAttributeMod(attr);
    const prof = stats.savingThrows[attr].proficient ? getPB() : 0;
    return mod + prof;
  };

  const getCalculatedSkill = (skillName: string, attr: Attribute) => {
    const skill = stats.skills[skillName] || { proficient: false, expertise: false, override: '' };
    const mod = getAttributeMod(attr);
    const prof = skill.proficient ? getPB() : 0;
    const exp = skill.expertise ? getPB() : 0;
    return mod + prof + exp;
  };

  const calculatePassivePerception = () => {
    if (stats.passivePerception !== '') return parseInt(stats.passivePerception);
    return 10 + getCalculatedSkill('perception', Attribute.WIS);
  };
  
  const spellSaveDC = 8 + getPB() + getAttributeMod(stats.spellcasting.ability);
  const spellAttackBonus = getPB() + getAttributeMod(stats.spellcasting.ability);
  const passivePerception = calculatePassivePerception();

  // --- HANDLERS ---

  const toggleSaveProficiency = (attr: Attribute) => {
    setStats(prev => ({
      ...prev,
      savingThrows: {
        ...prev.savingThrows,
        [attr]: {
          ...prev.savingThrows[attr],
          proficient: !prev.savingThrows[attr].proficient
        }
      }
    }));
  };

  const setSaveOverride = (attr: Attribute, val: string) => {
    setStats(prev => ({
      ...prev,
      savingThrows: {
        ...prev.savingThrows,
        [attr]: { ...prev.savingThrows[attr], override: val }
      }
    }));
  };

  const cycleSkillState = (skillName: string) => {
    setStats(prev => {
        const skill = prev.skills[skillName];
        let newProf = skill.proficient;
        let newExp = skill.expertise;

        if (!skill.proficient && !skill.expertise) {
            newProf = true;
            newExp = false;
        } else if (skill.proficient && !skill.expertise) {
            newProf = true;
            newExp = true;
        } else {
            newProf = false;
            newExp = false;
        }

        return {
            ...prev,
            skills: {
                ...prev.skills,
                [skillName]: { ...skill, proficient: newProf, expertise: newExp }
            }
        };
    });
  };

  const setSkillOverride = (skillName: string, val: string) => {
      setStats(prev => ({
          ...prev,
          skills: {
              ...prev.skills,
              [skillName]: { ...prev.skills[skillName], override: val }
          }
      }));
  };

  const moneyLabels: Record<string, string> = {
      cp: 'PC', sp: 'PP', ep: 'PE', gp: 'PO', pp: 'PL',
  };

  const renderSpellLevel = (level: string, label: string) => {
    const isCantrip = level === '0';
    const slots = stats.spellcasting.slots[level];
    const spells = stats.spellcasting.spells[level] || [];

    return (
      <div className={`border-2 ${theme.border} rounded-lg ${theme.panelBg} mb-4 overflow-hidden`}>
         <div className={`${theme.headerBg} p-1 flex items-center justify-between border-b ${theme.borderLight}`}>
             <div className="flex items-center">
                 <div className={`w-8 h-8 rounded-full border ${theme.border} ${theme.paperBg} ${theme.text} flex items-center justify-center font-header font-bold text-lg mr-2`}>
                     {level}
                 </div>
                 <span className={`font-header font-bold text-xs uppercase ${theme.text}`}>{label}</span>
             </div>
             {!isCantrip && (
                 <div className="flex gap-2">
                     <div className={`flex flex-col items-center border ${theme.borderLight} ${theme.paperBg} rounded px-1`}>
                        <input 
                            className={`w-8 text-center bg-transparent outline-none text-sm ${theme.input}`} 
                            placeholder="0"
                            value={slots?.total || ''}
                            onChange={(e) => {
                                const newSlots = { ...stats.spellcasting.slots, [level]: { ...slots, total: e.target.value } };
                                setStats({ ...stats, spellcasting: { ...stats.spellcasting, slots: newSlots }});
                            }}
                        />
                        <span className={`text-[8px] uppercase ${theme.subText}`}>Total</span>
                     </div>
                     <div className={`flex flex-col items-center border ${theme.borderLight} ${theme.paperBg} rounded px-1`}>
                        <input 
                            className={`w-8 text-center bg-transparent outline-none text-sm ${theme.input}`} 
                            placeholder="0"
                            value={slots?.expended || ''}
                            onChange={(e) => {
                                const newSlots = { ...stats.spellcasting.slots, [level]: { ...slots, expended: e.target.value } };
                                setStats({ ...stats, spellcasting: { ...stats.spellcasting, slots: newSlots }});
                            }}
                        />
                        <span className={`text-[8px] uppercase ${theme.subText}`}>Usados</span>
                     </div>
                 </div>
             )}
         </div>
         <div className="p-2">
             {spells.map((spell, idx) => (
                 <div key={idx} className={`flex items-center mb-1 border-b ${theme.borderLight} last:border-0`}>
                     {!isCantrip && <input type="checkbox" className={`mr-2 rounded-full w-3 h-3 ${theme.border} appearance-none border-2 checked:bg-red-800`} />}
                     
                     {/* Magic Roll Button */}
                     <button 
                         className={`mr-2 hover:text-blue-500 ${theme.subText}`} 
                         onClick={() => rollD20(spellAttackBonus, `Ataque Mágico: ${spell || 'Magia'}`)}
                         title="Rolar Ataque Mágico"
                     >
                        <Wand2 size={14} />
                     </button>

                     <input 
                        className={`w-full bg-transparent outline-none text-sm font-handwriting py-0.5 ${theme.input}`} 
                        value={spell}
                        placeholder={isCantrip ? "Truque" : "Magia"}
                        onChange={(e) => {
                            const newSpellsLevel = [...spells];
                            newSpellsLevel[idx] = e.target.value;
                            const newSpells = { ...stats.spellcasting.spells, [level]: newSpellsLevel };
                            setStats({ ...stats, spellcasting: { ...stats.spellcasting, spells: newSpells }});
                        }}
                     />
                 </div>
             ))}
         </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${theme.mainBg} p-2 md:p-8 flex justify-center font-sans ${theme.text} transition-colors duration-300`}>
      <div className={`${theme.paperBg} max-w-[1024px] w-full shadow-2xl p-4 md:p-8 rounded-sm border-t-8 ${theme.accent} min-h-[1100px] flex flex-col relative`}>
        
        {/* Top Controls: Theme, Save, Load */}
        <div className="absolute top-4 right-4 md:right-8 flex gap-2">
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".json"
                onChange={loadCharacter}
            />
            <button 
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-full ${theme.panelBg} ${theme.borderLight} border hover:opacity-80 transition-all`}
                title="Carregar Personagem (JSON)"
            >
                <Upload size={20} className={theme.text} />
            </button>
            <button 
                onClick={saveCharacter}
                className={`p-2 rounded-full ${theme.panelBg} ${theme.borderLight} border hover:opacity-80 transition-all`}
                title="Salvar Personagem (JSON)"
            >
                <Save size={20} className={theme.text} />
            </button>
            <button 
                onClick={cycleTheme}
                className={`p-2 rounded-full ${theme.panelBg} ${theme.borderLight} border hover:opacity-80 transition-all`}
                title={`Tema atual: ${theme.label}`}
            >
                <Palette size={20} className={theme.text} />
            </button>
        </div>

        {/* --- TABS --- */}
        <div className={`flex gap-2 mb-6 border-b ${theme.borderLight} pb-2 pr-32`}>
            {[
                { id: 'main', label: 'Principal' },
                { id: 'background', label: 'Antecedentes' },
                { id: 'spells', label: 'Magias' },
            ].map(tab => (
                <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 font-header font-bold uppercase tracking-wider rounded-t-lg transition-colors ${activeTab === tab.id ? theme.tabActive : theme.tabInactive}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* --- PAGE 1: PRINCIPAL --- */}
        {activeTab === 'main' && (
        <>
            <header className={`mb-6 border-b-2 ${theme.accent} pb-4`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className={`w-full md:w-1/3 border-b ${theme.borderLight} pb-1`}>
                <input 
                    className={`text-3xl font-header font-bold w-full outline-none uppercase bg-transparent ${theme.input}`}
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                    placeholder="Nome do Personagem"
                />
                <label className={`text-[10px] uppercase ${theme.subText} font-bold tracking-wider`}>Nome do Personagem</label>
                </div>

                <div className={`w-full md:w-2/3 grid grid-cols-2 md:grid-cols-3 gap-2 ${theme.panelBg} p-3 rounded-lg border ${theme.borderLight}`}>
                {[
                    { label: 'Classe e Nível', key: 'classLevel' },
                    { label: 'Antecedente', key: 'background' },
                    { label: 'Nome do Jogador', key: 'playerName' },
                    { label: 'Raça', key: 'race' },
                    { label: 'Tendência', key: 'alignment' },
                    { label: 'XP', key: 'xp' },
                ].map((field) => (
                    <div key={field.key} className={`flex flex-col border-b ${theme.borderLight} pb-1`}>
                        <input 
                            className={`font-medium bg-transparent outline-none w-full text-sm ${theme.input}`}
                            value={profile[field.key as keyof CharacterProfile]}
                            onChange={e => setProfile({...profile, [field.key]: e.target.value})}
                        />
                        <span className={`text-[9px] uppercase font-bold ${theme.subText}`}>{field.label}</span>
                    </div>
                ))}
                </div>
            </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
            
            {/* LEFT COL */}
            <div className="flex flex-col gap-6">
                {/* Attributes */}
                <div className="grid grid-cols-3 md:grid-cols-1 gap-4">
                    {(Object.keys(stats.attributes) as Attribute[]).map(attr => (
                        <AbilityScore 
                            key={attr}
                            attribute={attr}
                            score={stats.attributes[attr]}
                            label={ATTRIBUTE_LABELS[attr]}
                            onChange={(val) => setStats({...stats, attributes: {...stats.attributes, [attr]: val}})}
                            onRoll={() => rollD20(getAttributeMod(attr), `Teste de ${ATTRIBUTE_LABELS[attr]}`)}
                            theme={theme}
                        />
                    ))}
                </div>

                {/* Inspiration & PB */}
                <div className="flex flex-col gap-2">
                    <div className={`flex items-center border-2 ${theme.border} rounded-lg p-2`}>
                        <span className="font-bold text-xl mr-3">
                            <input type="checkbox" className={`w-6 h-6 accent-red-700 ${theme.border}`} />
                        </span>
                        <span className="text-xs font-bold uppercase">Inspiração</span>
                    </div>
                    <div className={`flex items-center border-2 ${theme.border} rounded-lg p-2`}>
                        <span className="font-bold text-xl mr-3 w-8 text-center flex">
                            +<input 
                                className={`w-full bg-transparent outline-none text-center ${theme.input}`}
                                value={stats.proficiencyBonus}
                                onChange={e => setStats({...stats, proficiencyBonus: e.target.value})}
                            />
                        </span>
                        <span className="text-xs font-bold uppercase">Bônus de Proficiência</span>
                    </div>
                </div>

                {/* Saving Throws */}
                <div className={`border-2 ${theme.border} rounded-lg p-3`}>
                    <h3 className={`text-center font-bold uppercase text-xs tracking-wider mb-2 ${theme.subText}`}>Testes de Resistência</h3>
                    {(Object.keys(stats.savingThrows) as Attribute[]).map(attr => (
                        <SkillRow 
                            key={`save-${attr}`}
                            label={ATTRIBUTE_LABELS[attr]}
                            attribute={attr}
                            calculatedModifier={getCalculatedSave(attr)}
                            overrideValue={stats.savingThrows[attr].override}
                            isProficient={stats.savingThrows[attr].proficient}
                            onCycleProficiency={() => toggleSaveProficiency(attr)}
                            onChangeOverride={(val) => setSaveOverride(attr, val)}
                            onRoll={(val) => rollD20(val, `Resistência de ${ATTRIBUTE_LABELS[attr]}`)}
                            theme={theme}
                        />
                    ))}
                </div>

                {/* Skills */}
                <div className={`border-2 ${theme.border} rounded-lg p-3 flex-grow`}>
                    <h3 className={`text-center font-bold uppercase text-xs tracking-wider mb-2 ${theme.subText}`}>Perícias</h3>
                    {SKILL_LIST.map(skill => (
                        <SkillRow 
                            key={skill.name}
                            label={skill.label}
                            attribute={skill.attr}
                            calculatedModifier={getCalculatedSkill(skill.name, skill.attr)}
                            overrideValue={stats.skills[skill.name]?.override || ''}
                            isProficient={stats.skills[skill.name]?.proficient || false}
                            isExpertise={stats.skills[skill.name]?.expertise || false}
                            onCycleProficiency={() => cycleSkillState(skill.name)}
                            onChangeOverride={(val) => setSkillOverride(skill.name, val)}
                            onRoll={(val) => rollD20(val, `Perícia: ${skill.label}`)}
                            theme={theme}
                        />
                    ))}
                </div>
            </div>

            {/* CENTER COL */}
            <div className="flex flex-col gap-6">
                <div className={`flex justify-between ${theme.panelBg} p-3 rounded-xl border ${theme.borderLight}`}>
                    <div className={`flex flex-col items-center p-2 border ${theme.borderLight} ${theme.paperBg} rounded-lg w-20`}>
                        <input className={`text-3xl font-bold font-header ${theme.input} w-full text-center outline-none bg-transparent`}
                             value={stats.combat.ac} 
                             onChange={e => setStats({...stats, combat: {...stats.combat, ac: e.target.value}})} 
                        />
                        <span className="text-[8px] font-bold uppercase mt-1 text-center leading-none">Classe de Armadura</span>
                    </div>
                    <div className={`flex flex-col items-center p-2 border ${theme.borderLight} ${theme.paperBg} rounded-lg w-20 cursor-pointer ${theme.highlight}`}
                        onClick={() => {
                             const init = stats.combat.initiative !== '' ? parseInt(stats.combat.initiative) : getAttributeMod(Attribute.DEX);
                             rollD20(init, 'Iniciativa');
                        }}
                    >
                        <input 
                            className={`text-3xl font-bold font-header w-full text-center outline-none bg-transparent cursor-pointer ${theme.input}`}
                            value={stats.combat.initiative}
                            placeholder={formatModifier(getAttributeMod(Attribute.DEX))}
                            onChange={e => setStats({...stats, combat: {...stats.combat, initiative: e.target.value}})}
                        />
                        <span className="text-[8px] font-bold uppercase mt-1 text-center leading-none">Iniciativa</span>
                    </div>
                    <div className={`flex flex-col items-center p-2 border ${theme.borderLight} ${theme.paperBg} rounded-lg w-20`}>
                         <input className={`text-3xl font-bold font-header ${theme.input} w-full text-center outline-none bg-transparent`}
                             value={stats.combat.speed} 
                             onChange={e => setStats({...stats, combat: {...stats.combat, speed: e.target.value}})} 
                        />
                        <span className="text-[8px] font-bold uppercase mt-1 text-center leading-none">Desloc.</span>
                    </div>
                </div>

                <div className={`border-2 ${theme.border} rounded-t-xl rounded-b-lg p-1 ${theme.panelBg}`}>
                    <div className={`${theme.paperBg} rounded-t-lg border ${theme.borderLight} p-2 mb-1`}>
                        <div className={`flex justify-between text-xs ${theme.subText} mb-1`}>
                            <span>Pontos de Vida Máximos</span>
                            <input 
                                type="text" 
                                className={`w-12 text-center border-b ${theme.borderLight} outline-none bg-transparent ${theme.input}`}
                                value={stats.hp.max}
                                onChange={(e) => setStats({...stats, hp: {...stats.hp, max: e.target.value}})}
                            />
                        </div>
                        <input 
                            type="text" 
                            className={`w-full text-center text-4xl font-header font-bold py-4 outline-none bg-transparent ${theme.input}`}
                            value={stats.hp.current}
                            onChange={(e) => setStats({...stats, hp: {...stats.hp, current: e.target.value}})}
                        />
                        <div className="text-center text-[10px] font-bold uppercase mt-1">Pontos de Vida Atuais</div>
                    </div>
                    <div className={`${theme.paperBg} rounded-b-lg border ${theme.borderLight} p-2`}>
                        <input 
                            type="text" 
                            className={`w-full text-center text-2xl font-header outline-none bg-transparent ${theme.subText}`}
                            value={stats.hp.temp}
                            onChange={(e) => setStats({...stats, hp: {...stats.hp, temp: e.target.value}})}
                        />
                        <div className="text-center text-[10px] font-bold uppercase mt-1">Pontos de Vida Temporários</div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className={`w-1/2 border-2 ${theme.border} rounded-lg p-2 ${theme.panelBg}`}>
                        <div className={`text-xs ${theme.subText} mb-1 flex justify-between`}>
                            <span>Total:</span>
                            <input className={`w-12 bg-transparent border-b ${theme.borderLight} outline-none text-center ${theme.input}`}
                                value={stats.hitDice.total} onChange={e => setStats({...stats, hitDice: {...stats.hitDice, total: e.target.value}})} />
                        </div>
                        <div className="flex justify-center items-center h-12">
                            <input 
                                className={`text-2xl font-bold text-center w-full bg-transparent outline-none ${theme.input}`}
                                value={stats.hitDice.current}
                                onChange={(e) => setStats({...stats, hitDice: {...stats.hitDice, current: e.target.value}})}
                            />
                        </div>
                        <div className="text-center text-[10px] font-bold uppercase">Dados de Vida</div>
                    </div>
                    <div className={`w-1/2 border-2 ${theme.border} rounded-lg p-2 ${theme.panelBg}`}>
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold">Sucessos</span>
                            <div className="flex gap-1">
                                {stats.deathSaves.successes.map((v, i) => (
                                    <input key={i} type="checkbox" checked={v} onChange={() => {
                                        const newS = [...stats.deathSaves.successes];
                                        newS[i] = !newS[i];
                                        setStats({...stats, deathSaves: {...stats.deathSaves, successes: newS as [boolean,boolean,boolean]}})
                                    }} className="rounded-full w-3 h-3 accent-green-600" />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold">Falhas</span>
                            <div className="flex gap-1">
                                {stats.deathSaves.failures.map((v, i) => (
                                    <input key={i} type="checkbox" checked={v} onChange={() => {
                                        const newF = [...stats.deathSaves.failures];
                                        newF[i] = !newF[i];
                                        setStats({...stats, deathSaves: {...stats.deathSaves, failures: newF as [boolean,boolean,boolean]}})
                                    }} className="rounded-full w-3 h-3 accent-red-600" />
                                ))}
                            </div>
                        </div>
                        <div className="text-center text-[10px] font-bold uppercase mt-2">Testes contra Morte</div>
                    </div>
                </div>

                <div className={`border-2 ${theme.border} rounded-lg p-1 min-h-[300px] flex flex-col`}>
                    <div className={`grid grid-cols-10 ${theme.headerBg} p-1 text-[9px] uppercase font-bold ${theme.subText} mb-1`}>
                        <div className="col-span-4 pl-2">Nome</div>
                        <div className="col-span-2 text-center">Bonus</div>
                        <div className="col-span-4 text-center">Dano/Tipo</div>
                    </div>
                    
                    {stats.attacks.map((atk, index) => {
                        const calculatedHit = getAttributeMod(atk.stat) + (atk.isProficient ? getPB() : 0);
                        const effectiveHit = atk.bonus !== '' ? parseInt(atk.bonus) : calculatedHit;
                        const calculatedDmg = getAttributeMod(atk.stat);

                        return (
                            <div key={atk.id} className={`grid grid-cols-10 items-center p-1 border-b ${theme.borderLight} ${theme.highlight} relative group`}>
                                <div className="col-span-4 pl-2 font-bold font-header flex items-center">
                                    <button 
                                        className="mr-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                                        onClick={() => rollD20(effectiveHit, `Ataque (${atk.name || 'Desarmado'})`)}
                                        title="Rolar Ataque"
                                    >
                                       <Dices size={16} className={theme.text} />
                                    </button>
                                    <input 
                                        className={`bg-transparent outline-none w-full font-bold ${theme.input}`}
                                        value={atk.name}
                                        placeholder="Arma..."
                                        onChange={(e) => {
                                            const newAtks = [...stats.attacks];
                                            newAtks[index] = { ...atk, name: e.target.value };
                                            setStats({ ...stats, attacks: newAtks });
                                        }}
                                    />
                                </div>
                                <div className={`col-span-2 text-center font-mono text-sm ${theme.input}`}>
                                    <input 
                                        className={`bg-transparent outline-none w-full text-center ${theme.input}`}
                                        value={atk.bonus}
                                        placeholder={formatModifier(calculatedHit)}
                                        onChange={(e) => {
                                            const newAtks = [...stats.attacks];
                                            newAtks[index] = { ...atk, bonus: e.target.value };
                                            setStats({ ...stats, attacks: newAtks });
                                        }}
                                    />
                                </div>
                                <div className="col-span-4 text-center text-xs flex flex-col items-center">
                                    <div className="flex items-center w-full justify-center">
                                         <input 
                                            className={`bg-transparent outline-none w-full text-center ${theme.input}`}
                                            value={atk.damage}
                                            placeholder="1d4"
                                            onChange={(e) => {
                                                const newAtks = [...stats.attacks];
                                                newAtks[index] = { ...atk, damage: e.target.value };
                                                setStats({ ...stats, attacks: newAtks });
                                            }}
                                        />
                                        <button 
                                            className="ml-1 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                                            onClick={() => rollDamage(atk.damage, calculatedDmg, atk.name || 'Ataque')}
                                            title="Rolar Dano"
                                         >
                                           <Sword size={14} className={theme.text} />
                                         </button>
                                    </div>
                                    <span className={`text-[9px] ${theme.subText} italic w-full`}>
                                        <input 
                                            className={`bg-transparent outline-none w-full text-center ${theme.input}`}
                                            value={atk.type}
                                            placeholder="tipo"
                                            onChange={(e) => {
                                                const newAtks = [...stats.attacks];
                                                newAtks[index] = { ...atk, type: e.target.value };
                                                setStats({ ...stats, attacks: newAtks });
                                            }}
                                        />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="mt-auto p-2">
                        <textarea 
                            className={`w-full h-24 text-sm bg-transparent resize-none outline-none border-t border-dashed ${theme.borderLight} pt-2 ${theme.input}`}
                            placeholder="Anotações de ataque ou magias..."
                        ></textarea>
                    </div>
                    <div className={`text-center text-[10px] font-bold uppercase ${theme.headerBg} p-1`}>Ataques e Magias</div>
                </div>

                <div className={`border-2 ${theme.border} rounded-lg p-2 flex flex-row flex-grow min-h-[200px]`}>
                    <div className="flex flex-col gap-1 w-12 mr-2 pt-2">
                        {['cp', 'sp', 'ep', 'gp', 'pp'].map(coin => (
                             <div key={coin} className={`flex flex-col items-center border ${theme.borderLight} rounded p-1 ${theme.panelBg}`}>
                                <span className="text-[8px] font-bold uppercase mb-0.5">{moneyLabels[coin]}</span>
                                <input 
                                    className={`w-full text-center text-xs bg-transparent outline-none ${theme.input}`}
                                    value={stats.money[coin as keyof typeof stats.money]}
                                    onChange={(e) => setStats({...stats, money: {...stats.money, [coin]: e.target.value}})}
                                />
                             </div>
                        ))}
                    </div>
                    <div className="flex flex-col flex-grow">
                        <textarea 
                            className={`w-full h-full text-sm bg-transparent resize-none outline-none ${theme.input}`}
                            value={stats.equipment}
                            onChange={e => setStats({...stats, equipment: e.target.value})}
                            placeholder="Equipamentos..."
                        />
                        <div className={`text-center text-[10px] font-bold uppercase border-t ${theme.borderLight} mt-2 pt-1`}>Equipamento</div>
                    </div>
                </div>
            </div>

            {/* RIGHT COL */}
            <div className="flex flex-col gap-6">
                <div className={`border-2 ${theme.border} rounded-lg ${theme.panelBg} p-3`}>
                    <div className={`${theme.paperBg} border ${theme.borderLight} p-2 rounded mb-2`}>
                        <span className={`block text-[10px] uppercase font-bold ${theme.subText} mb-1`}>Traços de Personalidade</span>
                        <textarea className={`w-full h-12 text-sm resize-none outline-none bg-transparent ${theme.input}`} value={stats.traits} onChange={e => setStats({...stats, traits: e.target.value})}></textarea>
                    </div>
                    <div className={`${theme.paperBg} border ${theme.borderLight} p-2 rounded mb-2`}>
                        <span className={`block text-[10px] uppercase font-bold ${theme.subText} mb-1`}>Ideais</span>
                        <textarea className={`w-full h-12 text-sm resize-none outline-none bg-transparent ${theme.input}`} value={stats.ideals} onChange={e => setStats({...stats, ideals: e.target.value})}></textarea>
                    </div>
                    <div className={`${theme.paperBg} border ${theme.borderLight} p-2 rounded mb-2`}>
                        <span className={`block text-[10px] uppercase font-bold ${theme.subText} mb-1`}>Vínculos</span>
                        <textarea className={`w-full h-12 text-sm resize-none outline-none bg-transparent ${theme.input}`} value={stats.bonds} onChange={e => setStats({...stats, bonds: e.target.value})}></textarea>
                    </div>
                    <div className={`${theme.paperBg} border ${theme.borderLight} p-2 rounded`}>
                        <span className={`block text-[10px] uppercase font-bold ${theme.subText} mb-1`}>Defeitos</span>
                        <textarea className={`w-full h-12 text-sm resize-none outline-none bg-transparent ${theme.input}`} value={stats.flaws} onChange={e => setStats({...stats, flaws: e.target.value})}></textarea>
                    </div>
                </div>

                <div className={`border-2 ${theme.border} rounded-lg p-2 flex flex-col h-96`}>
                    <textarea 
                        className={`w-full flex-grow text-sm bg-transparent resize-none outline-none p-1 ${theme.input}`}
                        value={stats.features}
                        onChange={e => setStats({...stats, features: e.target.value})}
                    />
                    <div className={`text-center text-[10px] font-bold uppercase border-t ${theme.borderLight} mt-2 pt-1`}>Características e Traços</div>
                </div>

                <div className={`border-2 ${theme.border} rounded-lg p-2 flex flex-col h-48`}>
                    <textarea 
                        className={`w-full flex-grow text-sm bg-transparent resize-none outline-none p-1 ${theme.input}`}
                        value={stats.proficienciesLanguages}
                        onChange={e => setStats({...stats, proficienciesLanguages: e.target.value})}
                    />
                    <div className={`text-center text-[10px] font-bold uppercase border-t ${theme.borderLight} mt-2 pt-1`}>Outras Proficiências e Idiomas</div>
                </div>

                <div className={`flex items-center justify-between border-2 ${theme.border} rounded-full px-4 py-2 ${theme.panelBg} ${theme.subText}`}>
                    <input 
                        className={`font-bold text-xl bg-transparent outline-none w-16 ${theme.input}`}
                        value={stats.passivePerception}
                        placeholder={passivePerception.toString()}
                        onChange={e => setStats({...stats, passivePerception: e.target.value})}
                    />
                    <span className="text-[10px] font-bold uppercase">Sabedoria Passiva (Percepção)</span>
                </div>
            </div>
            </div>
        </>
        )}

        {/* --- PAGE 2: ANTECEDENTES --- */}
        {activeTab === 'background' && (
            <div className="flex flex-col gap-6 flex-grow">
                <header className={`border-b-2 ${theme.accent} pb-4`}>
                     <div className={`${theme.paperBg} p-4 rounded-lg border ${theme.borderLight} mb-4`}>
                        <h2 className={`font-header font-bold text-2xl mb-2 ${theme.text}`}>{profile.name || "Personagem"}</h2>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                             {[
                                 {l:'Idade', k:'age'}, {l:'Altura', k:'height'}, {l:'Peso', k:'weight'},
                                 {l:'Olhos', k:'eyes'}, {l:'Pele', k:'skin'}, {l:'Cabelos', k:'hair'}
                             ].map(f => (
                                 <div key={f.k} className={`border-b ${theme.borderLight} pb-1`}>
                                     <input className={`w-full outline-none font-bold bg-transparent ${theme.input}`} value={profile[f.k as keyof CharacterProfile]} onChange={e => setProfile({...profile, [f.k]: e.target.value})} />
                                     <span className={`text-[10px] uppercase ${theme.subText} font-bold`}>{f.l}</span>
                                 </div>
                             ))}
                        </div>
                     </div>
                </header>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                    <div className="flex flex-col gap-6">
                        <div className={`border-2 ${theme.border} rounded-lg p-2 flex flex-col h-96`}>
                             <div className={`flex-grow ${theme.panelBg} border ${theme.borderLight} rounded mb-2 flex items-center justify-center relative overflow-hidden group`}>
                                 {profile.appearance ? (
                                    <div className={`w-full h-full p-2 text-sm overflow-auto whitespace-pre-wrap ${theme.text}`}>{profile.appearance}</div>
                                 ) : (
                                    <span className={`${theme.subText} font-bold uppercase`}>Aparência do Personagem</span>
                                 )}
                                 <textarea 
                                    className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 p-2 ${theme.paperBg} bg-opacity-90 transition-opacity outline-none resize-none ${theme.input}`}
                                    placeholder="Descreva a aparência..."
                                    value={profile.appearance}
                                    onChange={e => setProfile({...profile, appearance: e.target.value})}
                                 />
                             </div>
                             <div className="text-center text-[10px] font-bold uppercase">Aparência do Personagem</div>
                        </div>

                        <div className={`border-2 ${theme.border} rounded-lg p-2 flex flex-col flex-grow`}>
                             <textarea 
                                className={`w-full flex-grow text-sm bg-transparent resize-none outline-none p-1 ${theme.input}`}
                                value={profile.backstory}
                                onChange={e => setProfile({...profile, backstory: e.target.value})}
                                placeholder="Escreva a história do seu personagem..."
                             />
                             <div className={`text-center text-[10px] font-bold uppercase border-t ${theme.borderLight} mt-2 pt-1`}>História do Personagem</div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                         <div className={`border-2 ${theme.border} rounded-lg p-2 flex flex-col h-64`}>
                             <textarea 
                                className={`w-full flex-grow text-sm bg-transparent resize-none outline-none p-1 ${theme.input}`}
                                value={profile.alliesAndOrgs}
                                onChange={e => setProfile({...profile, alliesAndOrgs: e.target.value})}
                                placeholder="Aliados e Organizações..."
                             />
                             <div className={`flex justify-between items-end border-t ${theme.borderLight} mt-2 pt-1`}>
                                 <div className="text-[10px] font-bold uppercase text-center w-full">Aliados e Organizações</div>
                                 <div className={`w-24 h-24 border ${theme.borderLight} ${theme.panelBg} flex items-center justify-center flex-shrink-0 ml-2`}>
                                     <span className={`text-[8px] ${theme.subText} text-center`}>Símbolo</span>
                                 </div>
                             </div>
                        </div>

                        <div className={`border-2 ${theme.border} rounded-lg p-2 flex flex-col h-64`}>
                             <textarea 
                                className={`w-full flex-grow text-sm bg-transparent resize-none outline-none p-1 ${theme.input}`}
                                value={profile.additionalFeatures}
                                onChange={e => setProfile({...profile, additionalFeatures: e.target.value})}
                                placeholder="Outras características e habilidades..."
                             />
                             <div className={`text-center text-[10px] font-bold uppercase border-t ${theme.borderLight} mt-2 pt-1`}>Outras Características e Habilidades</div>
                        </div>

                        <div className={`border-2 ${theme.border} rounded-lg p-2 flex flex-col flex-grow`}>
                             <textarea 
                                className={`w-full flex-grow text-sm bg-transparent resize-none outline-none p-1 ${theme.input}`}
                                value={profile.treasure}
                                onChange={e => setProfile({...profile, treasure: e.target.value})}
                                placeholder="Tesouro..."
                             />
                             <div className={`text-center text-[10px] font-bold uppercase border-t ${theme.borderLight} mt-2 pt-1`}>Tesouro</div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* --- PAGE 3: MAGIAS --- */}
        {activeTab === 'spells' && (
            <div className="flex flex-col h-full">
                 <header className={`border-2 ${theme.border} rounded-lg p-4 ${theme.panelBg} mb-6 flex flex-wrap gap-4 justify-between items-center`}>
                     <div className={`flex flex-col border-b ${theme.borderLight} w-full md:w-1/4`}>
                         <input className={`bg-transparent font-bold text-lg outline-none uppercase ${theme.input}`}
                            value={stats.spellcasting.class}
                            placeholder="Classe"
                            onChange={e => setStats({...stats, spellcasting: {...stats.spellcasting, class: e.target.value}})}
                         />
                         <span className={`text-[10px] uppercase font-bold ${theme.subText}`}>Classe de Conjurador</span>
                     </div>
                     <div className={`flex flex-col border-b ${theme.borderLight} w-full md:w-1/6`}>
                         <select className={`bg-transparent font-bold text-lg outline-none uppercase appearance-none ${theme.input}`}
                            value={stats.spellcasting.ability}
                            onChange={e => setStats({...stats, spellcasting: {...stats.spellcasting, ability: e.target.value as Attribute}})}
                         >
                            {Object.values(Attribute).map(attr => (
                                <option key={attr} value={attr}>{ATTRIBUTE_LABELS[attr]}</option>
                            ))}
                         </select>
                         <span className={`text-[10px] uppercase font-bold ${theme.subText}`}>Habilidade Chave</span>
                     </div>
                     <div className={`flex flex-col items-center border ${theme.borderLight} ${theme.paperBg} rounded-lg p-2 w-24`}>
                         <span className={`text-2xl font-bold font-header ${theme.text}`}>{spellSaveDC}</span>
                         <span className={`text-[8px] uppercase font-bold ${theme.subText} text-center`}>CD do TR</span>
                     </div>
                     <div className={`flex flex-col items-center border ${theme.borderLight} ${theme.paperBg} rounded-lg p-2 w-24`}>
                         <span className={`text-2xl font-bold font-header ${theme.text}`}>{formatModifier(spellAttackBonus)}</span>
                         <span className={`text-[8px] uppercase font-bold ${theme.subText} text-center`}>Bônus de Ataque</span>
                     </div>
                 </header>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                     <div className="flex flex-col">
                        {renderSpellLevel('0', 'Truques')}
                        {renderSpellLevel('1', 'Nível 1')}
                        {renderSpellLevel('2', 'Nível 2')}
                     </div>
                     <div className="flex flex-col">
                        {renderSpellLevel('3', 'Nível 3')}
                        {renderSpellLevel('4', 'Nível 4')}
                        {renderSpellLevel('5', 'Nível 5')}
                     </div>
                     <div className="flex flex-col">
                        {renderSpellLevel('6', 'Nível 6')}
                        {renderSpellLevel('7', 'Nível 7')}
                        {renderSpellLevel('8', 'Nível 8')}
                        {renderSpellLevel('9', 'Nível 9')}
                     </div>
                 </div>
            </div>
        )}

      </div>

      <DiceLog lastRoll={lastRoll} />
    </div>
  );
}