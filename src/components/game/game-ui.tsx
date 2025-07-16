"use client";

import React, { useState, useTransition } from 'react';
import type { Character, StorySegment } from '@/lib/types';
import { getNewStory } from '@/lib/actions';
import CharacterSheet from './character-sheet';
import StoryDisplay from './story-display';
import ActionsPanel from './actions-panel';
import DiceRoller from './dice-roller';
import { useToast } from '@/hooks/use-toast';

interface GameUIProps {
    character: Character;
    setCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
    story: StorySegment[];
    setStory: React.Dispatch<React.SetStateAction<StorySegment[]>>;
}

export default function GameUI({ character, setCharacter, story, setStory }: GameUIProps) {
    const [isRolling, setIsRolling] = useState(false);
    const { toast } = useToast();
    
    const handleDecision = (decision: string) => {
        setIsRolling(true);

        const diceRollResult = Math.floor(Math.random() * 20) + 1;
        
        const latestSegment = story[story.length - 1];
        setStory(prev => prev.map(s => s.id === latestSegment.id ? {...s, options: []} : s));


        setTimeout(() => {
            setIsRolling(false);
            toast({
                title: "Tirada de dado",
                description: `Has sacado un ${diceRollResult} con tu tirada.`,
            });
            const lastStory = story.map(s => s.text).join('\n\n');
            
            setStory(prev => [...prev, {id: prev.length, text: `> ${decision}`, isProcessing: true}]);

            startTransition(async () => {
                const result = await getNewStory({
                    previousStory: lastStory,
                    playerDecision: decision,
                    diceRollResult: diceRollResult,
                });
                
                const processResult = (newStoryText: string, error = false) => {
                    const [newText, ...newOptions] = newStoryText.split('\n');

                     const newSegment: StorySegment = {
                        id: story.length + 1,
                        text: newText,
                        options: error ? [] : newOptions.map(opt => opt.replace(/^- /, '')).filter(opt => opt.length > 0)
                    };
                    
                    if(!error) {
                        const newXp = Math.round(diceRollResult * 0.5);
                        setCharacter(prev => prev ? {...prev, xp: prev.xp + newXp } : null);
                        toast({
                            title: "¡Experiencia ganada!",
                            description: `Ganas ${newXp} XP.`,
                        });
                    }

                     setStory(prev => {
                        const updatedStory = prev.map(s => s.isProcessing ? {...s, isProcessing: false, text: s.text} : s);
                        return [...updatedStory, newSegment];
                    });
                }


                if (result.error) {
                    toast({
                        variant: "destructive",
                        title: "Error de la IA",
                        description: result.error,
                    });
                    processResult(result.error, true);
                } else if (result.newStory) {
                    processResult(result.newStory);
                }
            });
        }, 1000); 
    };

    const latestSegment = story[story.length - 1];

    return (
        <>
            <DiceRoller isRolling={isRolling} />
            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2">
                    <StoryDisplay story={story} />
                    <ActionsPanel latestSegment={latestSegment} onDecision={handleDecision} />
                </div>
                <div className="md:col-span-1">
                    <CharacterSheet character={character} />
                </div>
            </div>
        </>
    );
}

// Dummy startTransition for cases where React's useTransition is not available or needed.
// This avoids breaking the app if the environment doesn't support it fully.
let startTransition: React.TransitionStartFunction;
// @ts-ignore
if (React.startTransition) {
  // @ts-ignore
  startTransition = React.startTransition;
} else {
  startTransition = function (cb: () => void) {
    cb();
  };
}
