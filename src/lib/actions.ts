'use server';

import { generateScrumStory } from '@/ai/flows/generate-scrum-story';

interface GenerateStoryParams {
  previousStory: string;
  playerDecision: string;
  diceRollResult: number;
}

export async function getNewStory(params: GenerateStoryParams): Promise<{ newStory?: string; error?: string }> {
  try {
    const result = await generateScrumStory({
      previousStory: params.previousStory,
      playerDecision: params.playerDecision,
      diceRollResult: params.diceRollResult,
    });
    if (result && result.newStory) {
        return { newStory: result.newStory };
    } else {
        return { error: 'La respuesta de la IA no fue válida.' };
    }
  } catch (error) {
    console.error('Error generating story:', error);
    return { error: 'El maestro de la mazmorra se toma un descanso. Hubo un error al generar la siguiente parte de la historia.' };
  }
}
