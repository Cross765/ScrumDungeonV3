"use client";

import { useState } from 'react';
import type { Character, StorySegment } from '@/lib/types';
import CharacterCreation from '@/components/game/character-creation';
import GameUI from '@/components/game/game-ui';

type GameState = 'character_creation' | 'playing';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('character_creation');
  const [character, setCharacter] = useState<Character | null>(null);
  const [story, setStory] = useState<StorySegment[]>([]);

  const startGame = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setGameState('playing');
    setStory([
      {
        id: 0,
        text: `La aventura de ${newCharacter.name}, el ${newCharacter.role}, ha comenzado. El equipo se reúne para el Sprint Planning inaugural. El Product Owner despliega el backlog con una mirada decidida. "Nuestro objetivo es entregar una funcionalidad clave este sprint", anuncia. Ahora, la crucial decisión de qué abordar primero cae sobre el equipo.`,
        options: [
          'La funcionalidad más deslumbrante.',
          'La tarea con mayor riesgo técnico.',
          'Lo que parece más rápido de completar.',
        ],
      },
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-card">
      <main className="container mx-auto py-8">
        <header className="text-center mb-8">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary tracking-tighter">
            ScrumQuest
          </h1>
          <p className="font-body text-muted-foreground text-lg md:text-xl mt-2">
            La Aventura Ágil
          </p>
        </header>
        
        {gameState === 'character_creation' && (
          <CharacterCreation onCharacterCreate={startGame} />
        )}
        
        {gameState === 'playing' && character && (
          <GameUI 
            character={character} 
            story={story} 
            setStory={setStory}
            setCharacter={setCharacter}
          />
        )}
      </main>
    </div>
  );
}
