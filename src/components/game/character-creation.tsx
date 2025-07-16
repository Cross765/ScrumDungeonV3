"use client";

import React, { useState, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

import type { Character, Role, SkillName } from '@/lib/types';
import { SKILLS, ROLES } from '@/lib/types';
import { INITIAL_SKILL_POINTS, BASE_SKILLS, ROLE_BONUSES, ROLE_DESCRIPTIONS } from '@/lib/constants';

import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';


const FormSchema = z.object({
  name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres.' }),
  role: z.enum(ROLES, { required_error: 'Debes seleccionar un rol.' }),
});

interface CharacterCreationProps {
    onCharacterCreate: (character: Character) => void;
}

export default function CharacterCreation({ onCharacterCreate }: CharacterCreationProps) {
    const [points, setPoints] = useState(INITIAL_SKILL_POINTS);
    const [skills, setSkills] = useState(BASE_SKILLS);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { name: '' },
    });

    const selectedRole = form.watch('role');

    const distributedSkills = useMemo(() => {
        const base = { ...BASE_SKILLS };
        if(selectedRole) {
            const bonuses = ROLE_BONUSES[selectedRole];
            for (const key in bonuses) {
                const skill = key as SkillName;
                base[skill] += bonuses[skill] ?? 0;
            }
        }
        for (const key in skills) {
            const skill = key as SkillName;
            base[skill] += skills[skill] - BASE_SKILLS[skill];
        }
        return base;
    }, [selectedRole, skills]);

    const handleSliderChange = (skill: SkillName, value: number[]) => {
        const change = value[0] - skills[skill];
        if (points - change >= 0) {
            setSkills(prev => ({ ...prev, [skill]: value[0] }));
            setPoints(prev => prev - change);
        }
    };
    
    function onSubmit(data: z.infer<typeof FormSchema>) {
        const finalCharacter: Character = {
            name: data.name,
            role: data.role,
            skills: distributedSkills,
            xp: 0
        };
        onCharacterCreate(finalCharacter);
    }
    
    return (
        <Card className="max-w-4xl mx-auto border-2 border-primary/50 shadow-lg shadow-primary/10">
            <CardHeader>
                <CardTitle className="font-headline text-3xl text-center">Crea tu Héroe Ágil</CardTitle>
                <CardDescription className="text-center">Define tu personaje para empezar la aventura en el mundo de Scrum.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                           <div>
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Personaje</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Valiente Developer" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                           </div>
                           <div>
                                <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Rol en el Equipo</FormLabel>
                                             <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    {ROLES.map(role => (
                                                        <FormItem key={role} className="flex items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <RadioGroupItem value={role} />
                                                            </FormControl>
                                                            <FormLabel className="font-normal flex items-center">
                                                                {role}
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Info className="w-4 h-4 ml-2 text-muted-foreground cursor-pointer"/>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>{ROLE_DESCRIPTIONS[role]}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            </FormLabel>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                           </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-headline text-xl">Distribuye tus puntos de habilidad</h3>
                                <p className="text-lg font-bold text-accent">Puntos restantes: {points}</p>
                            </div>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                {SKILLS.map(skill => (
                                    <FormItem key={skill}>
                                        <FormLabel className="flex justify-between">
                                            <span>{skill}</span>
                                            <span className="text-primary font-bold">{distributedSkills[skill]}</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Slider 
                                                min={BASE_SKILLS[skill]} 
                                                max={BASE_SKILLS[skill] + points + (skills[skill] - BASE_SKILLS[skill])}
                                                step={1} 
                                                value={[skills[skill]]} 
                                                onValueChange={(val) => handleSliderChange(skill, val)} 
                                                disabled={!selectedRole}
                                            />
                                        </FormControl>
                                    </FormItem>
                                ))}
                            </div>
                             {!selectedRole && <p className="text-center text-muted-foreground">Selecciona un rol para poder asignar puntos.</p>}
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" size="lg" className="w-full font-headline text-lg bg-primary hover:bg-primary/90" disabled={!selectedRole || form.formState.isSubmitting}>
                            ¡Comenzar Aventura!
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
