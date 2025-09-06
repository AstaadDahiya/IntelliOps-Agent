'use server';

/**
 * @fileOverview This flow retrieves relevant solutions from a knowledge base using RAG, based on the analyzed alert.
 *
 * - retrieveContextualSolutions - A function that handles the retrieval of contextual solutions.
 * - RetrieveContextualSolutionsInput - The input type for the retrieveContextualSolutions function.
 * - RetrieveContextualSolutionsOutput - The return type for the retrieveContextualSolutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrieveContextualSolutionsInputSchema = z.object({
  alertAnalysis: z
    .string()
    .describe('The analyzed alert, containing key information and context.'),
});
export type RetrieveContextualSolutionsInput = z.infer<typeof RetrieveContextualSolutionsInputSchema>;

const RetrieveContextualSolutionsOutputSchema = z.object({
  solutions: z
    .string()
    .describe('The relevant solutions retrieved from the knowledge base using RAG.'),
});
export type RetrieveContextualSolutionsOutput = z.infer<typeof RetrieveContextualSolutionsOutputSchema>;

export async function retrieveContextualSolutions(
  input: RetrieveContextualSolutionsInput
): Promise<RetrieveContextualSolutionsOutput> {
  return retrieveContextualSolutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'retrieveContextualSolutionsPrompt',
  input: {schema: RetrieveContextualSolutionsInputSchema},
  output: {schema: RetrieveContextualSolutionsOutputSchema},
  prompt: `You are an expert IT operator. Based on the analyzed alert, retrieve relevant solutions from the knowledge base using RAG to help resolve the issue effectively.\n\nAnalyzed Alert: {{{alertAnalysis}}}\n\nSolutions:`,
});

const retrieveContextualSolutionsFlow = ai.defineFlow(
  {
    name: 'retrieveContextualSolutionsFlow',
    inputSchema: RetrieveContextualSolutionsInputSchema,
    outputSchema: RetrieveContextualSolutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
