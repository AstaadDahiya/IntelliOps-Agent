'use server';

/**
 * @fileOverview This file defines the main Genkit flow for the IntelliOps agent.
 *
 * - runIntelliOpsAgent - The main flow function that orchestrates the alert processing.
 * - RunIntelliOpsAgentInput - The input type for the main flow.
 * - RunIntelliOpsAgentOutput - The output type for the main flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { retrieveContextualSolutions } from './retrieve-contextual-solutions';
import { analyzeAlertAndSuggestAction } from './analyze-alert-and-suggest-action';

const RunIntelliOpsAgentInputSchema = z.object({
  alertTitle: z.string(),
  alertDescription: z.string(),
});
export type RunIntelliOpsAgentInput = z.infer<
  typeof RunIntelliOpsAgentInputSchema
>;

const RunIntelliOpsAgentOutputSchema = z.object({
  analysis: z.string(),
  suggestedAction: z.string(),
  reasoning: z.string(),
});
export type RunIntelliOpsAgentOutput = z.infer<
  typeof RunIntelliOpsAgentOutputSchema
>;

export async function runIntelliOpsAgent(
  input: RunIntelliOpsAgentInput
): Promise<RunIntelliOpsAgentOutput> {
  return runIntelliOpsAgentFlow(input);
}

const runIntelliOpsAgentFlow = ai.defineFlow(
  {
    name: 'runIntelliOpsAgentFlow',
    inputSchema: RunIntelliOpsAgentInputSchema,
    outputSchema: RunIntelliOpsAgentOutputSchema,
  },
  async (input) => {
    // First, we need an initial analysis to search for solutions
    const initialAnalysis = await ai.generate({
      prompt: `Briefly analyze this alert for keywords: ${input.alertTitle} - ${input.alertDescription}`
    });
    
    const contextualSolutions = await retrieveContextualSolutions({
      alertAnalysis: initialAnalysis.text,
    });

    const analysisResult = await analyzeAlertAndSuggestAction({
      alertTitle: input.alertTitle,
      alertDescription: input.alertDescription,
      knowledgeBaseResults: contextualSolutions.solutions,
    });

    return analysisResult;
  }
);
