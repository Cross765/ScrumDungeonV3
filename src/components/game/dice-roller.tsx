"use client"
import { Dices } from 'lucide-react';

export default function DiceRoller({ isRolling }: { isRolling: boolean }) {
    if (!isRolling) return null;
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="text-primary animate-dice-roll">
                <Dices className="w-32 h-32" />
            </div>
        </div>
    );
}
