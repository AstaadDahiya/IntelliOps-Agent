'use server';

/**
 * @fileOverview Analyzes an alert from SuperOps using Gemini 1.5 Pro and suggests a course of action.
 *
 * - analyzeAlertAndSuggestAction - Analyzes the alert and suggests an action.
 * - AnalyzeAlertAndSuggestActionInput - The input type for the analyzeAlertAndSuggestAction function.
 * - AnalyzeAlertAndSuggestActionOutput - The return type for the analyzeAlertAndSuggestAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAlertAndSuggestActionInputSchema = z.object({
  alertTitle: z.string().describe('The title of the alert from SuperOps.'),
  alertDescription: z.string().describe('The detailed description of the alert.'),
  knowledgeBaseResults: z.string().describe('Retrieved context-specific solutions from the knowledge base (RAG).'),
});
export type AnalyzeAlertAndSuggestActionInput = z.infer<typeof AnalyzeAlertAndSuggestActionInputSchema>;

const AnalyzeAlertAndSuggestActionOutputSchema = z.object({
  analysis: z.string().describe('The analysis of the alert, including key information and context.'),
  suggestedAction: z.string().describe('The suggested course of action (e.g., run script X, deploy patch Y).'),
  reasoning: z.string().describe('The reasoning behind the suggested action.'),
});
export type AnalyzeAlertAndSuggestActionOutput = z.infer<typeof AnalyzeAlertAndSuggestActionOutputSchema>;

export async function analyzeAlertAndSuggestAction(
  input: AnalyzeAlertAndSuggestActionInput
): Promise<AnalyzeAlertAndSuggestActionOutput> {
  return analyzeAlertAndSuggestActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAlertAndSuggestActionPrompt',
  input: {schema: AnalyzeAlertAndSuggestActionInputSchema},
  output: {schema: AnalyzeAlertAndSuggestActionOutputSchema},
  prompt: `You are an expert IT operator tasked with analyzing alerts from SuperOps and suggesting a course of action.

  Analyze the alert and suggest a preliminary course of action based on the alert description and the retrieved knowledge base results. Explain your reasoning.

  Alert Title: {{{alertTitle}}}
  Alert Description: {{{alertDescription}}}
  Knowledge Base Results: {{{knowledgeBaseResults}}}

  Respond with an analysis of the alert, a suggested action, and the reasoning behind the suggested action.
`,
});

const analyzeAlertAndSuggestActionFlow = ai.defineFlow(
  {
    name: 'analyzeAlertAndSuggestActionFlow',
    inputSchema: AnalyzeAlertAndSuggestActionInputSchema,
    outputSchema: AnalyzeAlertAndSuggestActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
