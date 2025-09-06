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

// This is a placeholder for a real RAG implementation.
// In a real application, you would use the input to search a vector database.
const retrieveContextualSolutionsFlow = ai.defineFlow(
  {
    name: 'retrieveContextualSolutionsFlow',
    inputSchema: RetrieveContextualSolutionsInputSchema,
    outputSchema: RetrieveContextualSolutionsOutputSchema,
  },
  async (input) => {
    // Placeholder for vector search logic
    const knowledgeBase = [
        "For high CPU on web servers, first check the 'data-cruncher.py' process. If it's running, consider restarting it using 'systemctl restart data-cruncher'.",
        "If a server is unresponsive, a common solution is to run the 'network-diagnostic.sh' script to check for connectivity issues.",
        "When 'data-cruncher.py' exceeds 90% CPU, it's a known issue that requires patch 'PATCH-CPU-001' to be deployed."
    ];
    
    const solutions = "### Relevant Knowledge Base Articles:\n" + knowledgeBase.join("\n\n");

    return { solutions };
  }
);
