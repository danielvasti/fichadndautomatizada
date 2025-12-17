import { Attribute, SkillDefinition } from './types';

export const SKILL_LIST: SkillDefinition[] = [
  { name: 'acrobatics', attr: Attribute.DEX, label: 'Acrobacia' },
  { name: 'animal_handling', attr: Attribute.WIS, label: 'Adestrar Animais' },
  { name: 'arcana', attr: Attribute.INT, label: 'Arcanismo' },
  { name: 'athletics', attr: Attribute.STR, label: 'Atletismo' },
  { name: 'deception', attr: Attribute.CHA, label: 'Enganação' },
  { name: 'history', attr: Attribute.INT, label: 'História' },
  { name: 'insight', attr: Attribute.WIS, label: 'Intuição' },
  { name: 'intimidation', attr: Attribute.CHA, label: 'Intimidação' },
  { name: 'investigation', attr: Attribute.INT, label: 'Investigação' },
  { name: 'medicine', attr: Attribute.WIS, label: 'Medicina' },
  { name: 'nature', attr: Attribute.INT, label: 'Natureza' },
  { name: 'perception', attr: Attribute.WIS, label: 'Percepção' },
  { name: 'performance', attr: Attribute.CHA, label: 'Performance' },
  { name: 'persuasion', attr: Attribute.CHA, label: 'Persuasão' },
  { name: 'religion', attr: Attribute.INT, label: 'Religião' },
  { name: 'sleight_of_hand', attr: Attribute.DEX, label: 'Prestidigitação' },
  { name: 'stealth', attr: Attribute.DEX, label: 'Furtividade' },
  { name: 'survival', attr: Attribute.WIS, label: 'Sobrevivência' },
];

export const ATTRIBUTE_LABELS: Record<Attribute, string> = {
  [Attribute.STR]: 'Força',
  [Attribute.DEX]: 'Destreza',
  [Attribute.CON]: 'Constituição',
  [Attribute.INT]: 'Inteligência',
  [Attribute.WIS]: 'Sabedoria',
  [Attribute.CHA]: 'Carisma',
};

export const ATTRIBUTE_SHORT_LABELS: Record<Attribute, string> = {
  [Attribute.STR]: 'FOR',
  [Attribute.DEX]: 'DES',
  [Attribute.CON]: 'CON',
  [Attribute.INT]: 'INT',
  [Attribute.WIS]: 'SAB',
  [Attribute.CHA]: 'CAR',
};