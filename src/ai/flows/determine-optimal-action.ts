'use server';

/**
 * @fileOverview Determines the optimal course of action based on alert analysis and retrieved knowledge.
 *
 * - determineOptimalAction - A function that determines the optimal action.
 * - DetermineOptimalActionInput - The input type for the determineOptimalAction function.
 * - DetermineOptimalActionOutput - The return type for the determineOptimalAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetermineOptimalActionInputSchema = z.object({
  alertAnalysis: z
    .string()
    .describe('The analysis of the alert, including key information and context.'),
  knowledgeBaseResults: z
    .string()
    .describe('The relevant solutions retrieved from the knowledge base.'),
});
export type DetermineOptimalActionInput = z.infer<typeof DetermineOptimalActionInputSchema>;

const DetermineOptimalActionOutputSchema = z.object({
  action: z.string().describe('The optimal course of action to take.'),
  justification: z
    .string()
    .describe('The reasoning behind choosing this action.'),
});
export type DetermineOptimalActionOutput = z.infer<typeof DetermineOptimalActionOutputSchema>;

export async function determineOptimalAction(
  input: DetermineOptimalActionInput
): Promise<DetermineOptimalActionOutput> {
  return determineOptimalActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'determineOptimalActionPrompt',
  input: {schema: DetermineOptimalActionInputSchema},
  output: {schema: DetermineOptimalActionOutputSchema},
  prompt: `You are an expert IT operations assistant. Based on the alert analysis and relevant knowledge base results, determine the most appropriate course of action to resolve the issue.

Alert Analysis: {{{alertAnalysis}}}

Knowledge Base Results: {{{knowledgeBaseResults}}}

Consider all available information and provide a clear, concise action and its justification.`,
});

const determineOptimalActionFlow = ai.defineFlow(
  {
    name: 'determineOptimalActionFlow',
    inputSchema: DetermineOptimalActionInputSchema,
    outputSchema: DetermineOptimalActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
