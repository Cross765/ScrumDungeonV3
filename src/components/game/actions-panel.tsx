"use client";

import { Button } from '@/components/ui/button';
import type { StorySegment } from '@/lib/types';

interface ActionsPanelProps {
    latestSegment: StorySegment;
    onDecision: (decision: string) => void;
}

export default function ActionsPanel({ latestSegment, onDecision }: ActionsPanelProps) {
    if (!latestSegment.options || latestSegment.options.length === 0 || latestSegment.isProcessing) {
        return null;
    }

    return (
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-stretch">
            {latestSegment.options.map((option, index) => (
                <Button 
                    key={index} 
                    onClick={() => onDecision(option)} 
                    variant="outline"
                    size="lg"
                    className="font-headline text-base hover:bg-accent hover:text-accent-foreground transition-all duration-300 transform hover:scale-105 whitespace-normal h-auto py-3"
                >
                    {option}
                </Button>
            ))}
        </div>
    );
}
