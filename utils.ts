export const calculateModifier = (score: number): number => {
  return Math.floor((score - 10) / 2);
};

export const formatModifier = (mod: number): string => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const rollDie = (sides: number): number => {
  return Math.floor(Math.random() * sides) + 1;
};

export const parseAndRollDice = (diceString: string): { total: number, breakdown: string, dieRoll: number } => {
  // Normalize string: remove spaces, lowercase
  const clean = diceString.toLowerCase().replace(/\s/g, '');
  
  // Regex for XdY(+/-)Z or XdY
  const match = clean.match(/^(\d+)d(\d+)([+-]\d+)?$/);

  if (!match) {
    // Fallback: try to just parse a number or standard dice without modifier
    const simpleMatch = clean.match(/^(\d+)d(\d+)$/);
    if (simpleMatch) {
       const count = parseInt(simpleMatch[1]);
       const sides = parseInt(simpleMatch[2]);
       let total = 0;
       for (let i=0; i<count; i++) total += rollDie(sides);
       return { total, breakdown: `[${total}]`, dieRoll: total };
    }
    return { total: 0, breakdown: 'Erro', dieRoll: 0 };
  }

  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const modifier = match[3] ? parseInt(match[3]) : 0;

  let diceTotal = 0;
  for (let i = 0; i < count; i++) {
    diceTotal += rollDie(sides);
  }

  const total = diceTotal + modifier;
  return { total, breakdown: `[${diceTotal}] ${modifier >= 0 ? '+' : ''}${modifier}`, dieRoll: diceTotal };
};