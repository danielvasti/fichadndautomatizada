export enum Attribute {
  STR = 'strength',
  DEX = 'dexterity',
  CON = 'constitution',
  INT = 'intelligence',
  WIS = 'wisdom',
  CHA = 'charisma',
}

export interface SkillDefinition {
  name: string;
  attr: Attribute;
  label: string;
}

export interface CharacterProfile {
  name: string;
  classLevel: string;
  background: string;
  playerName: string;
  race: string;
  alignment: string;
  xp: string;
  
  // Page 2 Details
  age: string;
  height: string;
  weight: string;
  eyes: string;
  skin: string;
  hair: string;
  
  appearance: string;
  backstory: string;
  alliesAndOrgs: string;
  orgSymbol: string;
  orgName: string;
  treasure: string;
  additionalFeatures: string;
}

export interface SkillState {
  proficient: boolean;
  expertise: boolean;
  override: string; // Empty string means use auto-calc
}

export interface SaveState {
  proficient: boolean;
  override: string;
}

export interface CharacterStats {
  attributes: Record<Attribute, number>;
  proficiencyBonus: string; // String to allow flexible input, parsed as int for calcs
  inspiration: boolean; // Reverted to boolean (checkbox)
  
  savingThrows: Record<Attribute, SaveState>;
  skills: Record<string, SkillState>;
  
  passivePerception: string; // Override
  
  hp: {
    current: string; // Changed to string for easier editing
    max: string;
    temp: string;
  };
  hitDice: {
    total: string;
    current: string;
  };
  deathSaves: {
    successes: [boolean, boolean, boolean];
    failures: [boolean, boolean, boolean];
  };
  combat: {
    ac: string;
    initiative: string; // Empty string means auto
    speed: string;
  };
  attacks: Attack[];
  equipment: string;
  money: {
    cp: string;
    sp: string;
    ep: string;
    gp: string;
    pp: string;
  };
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  features: string;
  proficienciesLanguages: string;
  
  // Magic
  spellcasting: {
    class: string;
    ability: Attribute; 
    slots: {
      [level: string]: { total: string; expended: string };
    };
    spells: {
      [level: string]: string[]; 
    };
  };
}

export interface Attack {
  id: string;
  name: string;
  bonus: string; // Changed to string
  damage: string;
  type: string;
  stat: Attribute; 
  isProficient: boolean;
}

export interface RollResult {
  total: number;
  dieRoll: number;
  modifier: number;
  label: string;
  crit: boolean;
  critFail: boolean;
  timestamp: number;
  breakdown?: string; // New field for precise logs (e.g. "[5] + 2")
}

export interface ThemeStyles {
  id: string;
  label: string;
  mainBg: string;
  paperBg: string;
  text: string;
  subText: string;
  border: string;
  borderLight: string;
  accent: string;
  input: string;
  panelBg: string;
  headerBg: string;
  highlight: string;
  tabActive: string;
  tabInactive: string;
}