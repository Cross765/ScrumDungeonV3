
"use client";

import React, { useState, useEffect } from 'react';
import type { Character, SkillName } from '@/lib/types';
import { SKILLS } from '@/lib/constants';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FormItem, FormLabel } from '@/components/ui/form';

interface LevelUpDialogProps {
    character: Character;
    pointsToDistribute: number;
    onLevelUp: (updatedSkills: Record<SkillName, number>) => void;
}

export default function LevelUpDialog({ character, pointsToDistribute, onLevelUp }: LevelUpDialogProps) {
    const [open, setOpen] = useState(true);
    const [points, setPoints] = useState(pointsToDistribute);
    const [currentSkills, setCurrentSkills] = useState(character.skills);

    useEffect(() => {
        setOpen(true);
        setPoints(pointsToDistribute);
        setCurrentSkills(character.skills);
    }, [character, pointsToDistribute]);

    const handleSliderChange = (skill: SkillName, value: number[]) => {
        const oldValue = currentSkills[skill];
        const newValue = value[0];
        const change = newValue - oldValue;

        if (points - change >= 0) {
            setCurrentSkills(prev => ({ ...prev, [skill]: newValue }));
            setPoints(prev => prev - change);
        }
    };

    const handleConfirm = () => {
        if (points > 0) {
            // Optionally, alert the user they must spend all points.
            // For now, we allow closing.
        }
        onLevelUp(currentSkills);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-headline text-3xl text-center text-primary">¡Has subido de nivel!</DialogTitle>
                    <DialogDescription className="text-center">
                        Distribuye tus puntos de habilidad para hacerte más fuerte.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                     <div className="flex justify-between items-center">
                        <h3 className="font-headline text-xl">Habilidades</h3>
                        <p className="text-lg font-bold text-accent">Puntos restantes: {points}</p>
                    </div>
                     <div className="grid gap-y-6">
                        {SKILLS.map(skill => (
                            <FormItem key={skill}>
                                <FormLabel className="flex justify-between">
                                    <span>{skill}</span>
                                    <span className="text-primary font-bold">{currentSkills[skill]}</span>
                                </FormLabel>
                                <Slider 
                                    min={character.skills[skill]}
                                    max={character.skills[skill] + points + (currentSkills[skill] - character.skills[skill])}
                                    step={1}
                                    value={[currentSkills[skill]]}
                                    onValueChange={(val) => handleSliderChange(skill, val)}
                                />
                            </FormItem>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleConfirm} disabled={points > 0} className="w-full">
                        {points > 0 ? `Debes asignar ${points} punto(s)` : 'Confirmar y continuar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
