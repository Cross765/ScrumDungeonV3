"use client";

import type { StorySegment } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import React from 'react';

export default function StoryDisplay({ story }: { story: StorySegment[] }) {
    const viewportRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [story]);

    return (
        <Card className="shadow-lg">
            <CardContent className="p-0 flex-grow">
                <ScrollArea className="h-full" viewportRef={viewportRef}>
                    <div className="p-6 space-y-6">
                        {story.map((segment) => (
                            <div key={segment.id} className="prose prose-invert prose-p:font-body prose-p:text-lg prose-p:leading-relaxed prose-headings:font-headline prose-p:text-foreground/90 max-w-none">
                                <p className={segment.text.startsWith('>') ? "text-accent italic" : ""}>
                                    {segment.text.startsWith('>') ? segment.text.substring(1) : segment.text}
                                </p>
                                {segment.isProcessing && (
                                    <div className="flex items-center justify-center text-muted-foreground mt-4">
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        <span>El maestro de la mazmorra está pensando...</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
