import type { Skills, Role } from './types';

export const INITIAL_SKILL_POINTS = 10;
export const INITIAL_XP = 0;
export const NEXT_LEVEL_XP = 100;
export const POINTS_PER_LEVEL = 5;

export const SKILLS = [
  'Colaboración',
  'Adaptabilidad',
  'Comunicación',
  'Resoluciones de impedimentos',
  'Priorización',
  'Velocidad de ejecución',
  'Mentalidad ágil',
] as const;

export const BASE_SKILLS: Skills = {
  'Colaboración': 1,
  'Adaptabilidad': 1,
  'Comunicación': 1,
  'Resoluciones de impedimentos': 1,
  'Priorización': 1,
  'Velocidad de ejecución': 1,
  'Mentalidad ágil': 1,
};

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
    'Scrum Master': 'Facilita el proceso Scrum y elimina impedimentos. Mejora la resolución de problemas y la comunicación.',
    'Product Owner': 'Maximiza el valor del producto y gestiona el backlog. Experto en priorización.',
    'Developer': 'Construye el incremento del producto. Destaca por su velocidad de ejecución y colaboración técnica.'
}

export const ROLE_BONUSES: Record<Role, Partial<Skills>> = {
  'Scrum Master': {
    'Resoluciones de impedimentos': 2,
    'Comunicación': 1,
  },
  'Product Owner': {
    'Priorización': 2,
    'Comunicación': 1,
  },
  'Developer': {
    'Velocidad de ejecución': 2,
    'Colaboración': 1,
  },
};
