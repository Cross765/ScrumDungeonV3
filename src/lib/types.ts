export const SKILLS = [
  'Colaboración',
  'Adaptabilidad',
  'Comunicación',
  'Resoluciones de impedimentos',
  'Priorización',
  'Velocidad de ejecución',
  'Mentalidad ágil',
] as const;

export type SkillName = typeof SKILLS[number];

export type Skills = Record<SkillName, number>;

export const ROLES = ['Scrum Master', 'Product Owner', 'Developer'] as const;
export type Role = typeof ROLES[number];

export interface Character {
  name: string;
  role: Role;
  skills: Skills;
  xp: number;
}

export interface StorySegment {
  id: number;
  text: string;
  options?: string[];
  isProcessing?: boolean;
}
