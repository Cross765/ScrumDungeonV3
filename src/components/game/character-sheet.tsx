import type { Character, SkillName } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Zap, Swords, Library, Mic, GitPullRequest, BrainCircuit } from 'lucide-react';

const skillIcons: Record<SkillName, React.ReactNode> = {
    'Colaboración': <Users className="w-4 h-4 mr-2 text-primary" />,
    'Adaptabilidad': <GitPullRequest className="w-4 h-4 mr-2 text-primary" />,
    'Comunicación': <Mic className="w-4 h-4 mr-2 text-primary" />,
    'Resoluciones de impedimentos': <Swords className="w-4 h-4 mr-2 text-primary" />,
    'Priorización': <Library className="w-4 h-4 mr-2 text-primary" />,
    'Velocidad de ejecución': <Zap className="w-4 h-4 mr-2 text-primary" />,
    'Mentalidad ágil': <BrainCircuit className="w-4 h-4 mr-2 text-primary" />,
};


export default function CharacterSheet({ character }: { character: Character }) {
  const nextLevelXp = 100;

  return (
    <Card className="sticky top-8 bg-card/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary">{character.name}</CardTitle>
        <CardDescription>
            <Badge variant="secondary" className="text-base">{character.role}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2 text-center">Puntos de Experiencia (XP)</h4>
            <Progress value={(character.xp / nextLevelXp) * 100} className="w-full" />
            <p className="text-xs text-center mt-1 text-muted-foreground">{character.xp} / {nextLevelXp} XP</p>
        </div>
        <Separator />
        <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3 text-center">Habilidades</h4>
            <ul className="space-y-3">
                {Object.entries(character.skills).map(([skill, value]) => (
                    <li key={skill} className="flex justify-between items-center text-sm font-body">
                        <span className="flex items-center">
                            {skillIcons[skill as SkillName]}
                            {skill}
                        </span>
                        <Badge variant="outline" className="font-bold text-base">{value}</Badge>
                    </li>
                ))}
            </ul>
        </div>
      </CardContent>
    </Card>
  );
}
