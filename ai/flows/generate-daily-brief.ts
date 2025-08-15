
'use server';

/**
 * @fileOverview Generates a personalized daily brief from weather, news, and stock updates.
 *
 * - generateDailyBrief - A function that generates the daily brief.
 * - GenerateDailyBriefInput - The input type for the generateDailyBrief function.
 * - GenerateDailyBriefOutput - The return type for the generateDailyBrief function.
 */

import {ai} from '@/ai/genkit';
import { GenerateDailyBriefInputSchema, GenerateDailyBriefOutputSchema, type GenerateDailyBriefInput, type GenerateDailyBriefOutput } from '@/ai/schemas';

export async function generateDailyBrief(input: GenerateDailyBriefInput): Promise<GenerateDailyBriefOutput> {
  return generateDailyBriefFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDailyBriefPrompt',
  input: {schema: GenerateDailyBriefInputSchema},
  output: {schema: GenerateDailyBriefOutputSchema},
  prompt: `You are an AI assistant that generates personalized daily briefs.

  Summarize the key information from the weather, news, and stock updates provided below, and create a brief summary of the most relevant information for the day. Focus on information that is important or requires action.

  Weather: {{{weather}}}
  News: {{{news}}}
  Stocks: {{{stocks}}}
  `,
});

const generateDailyBriefFlow = ai.defineFlow(
  {
    name: 'generateDailyBriefFlow',
    inputSchema: GenerateDailyBriefInputSchema,
    outputSchema: GenerateDailyBriefOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
