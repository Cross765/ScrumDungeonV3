"use client";

import React, { useState, useTransition, useEffect } from 'react';
import type { Character, StorySegment, SkillName } from '@/lib/types';
import { getNewStory } from '@/lib/actions';
import CharacterSheet from './character-sheet';
import StoryDisplay from './story-display';
import ActionsPanel from './actions-panel';
import DiceRoller from './dice-roller';
import LevelUpDialog from './level-up-dialog';
import { useToast } from '@/hooks/use-toast';
import { SKILLS, NEXT_LEVEL_XP, POINTS_PER_LEVEL } from '@/lib/constants';

interface GameUIProps {
    character: Character;
    setCharacter: React.Dispatch<React.SetStateAction<Character | null>>;
    story: StorySegment[];
    setStory: React.Dispatch<React.SetStateAction<StorySegment[]>>;
}

export default function GameUI({ character, setCharacter, story, setStory }: GameUIProps) {
    const [isRolling, setIsRolling] = useState(false);
    const [isLevelUp, setIsLevelUp] = useState(false);
    const [availableSkillPoints, setAvailableSkillPoints] = useState(0);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    useEffect(() => {
        if (character && character.xp >= NEXT_LEVEL_XP) {
            setIsLevelUp(true);
            setAvailableSkillPoints(prev => prev + POINTS_PER_LEVEL);
        }
    }, [character?.xp]);
    
    const handleDecision = (decision: string) => {
        if (isLevelUp) {
            toast({
                title: "¡Sube de nivel!",
                description: "Debes asignar tus puntos de habilidad para continuar.",
                variant: "destructive"
            });
            return;
        }

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

    const handleLevelUp = (updatedSkills: Record<SkillName, number>) => {
        setCharacter(prev => {
            if (!prev) return null;
            return {
                ...prev,
                skills: updatedSkills,
                xp: prev.xp - NEXT_LEVEL_XP
            }
        });
        setIsLevelUp(false);
        setAvailableSkillPoints(0); // Reset points after distribution
        toast({
            title: "¡Nivel alcanzado!",
            description: "Tus habilidades han mejorado. ¡La aventura continúa!",
        });
    };

    const latestSegment = story[story.length - 1];

    return (
        <>
            <DiceRoller isRolling={isRolling} />
            {isLevelUp && character && (
                <LevelUpDialog
                    character={character}
                    pointsToDistribute={availableSkillPoints}
                    onLevelUp={handleLevelUp}
                />
            )}
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
