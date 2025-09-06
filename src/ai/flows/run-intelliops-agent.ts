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
    // For now, we are passing a dummy analysis to retrieve contextual solutions.
    // This will be updated in a future step.
    const contextualSolutions = await retrieveContextualSolutions({
      alertAnalysis: 'High CPU utilization on web-server-01',
    });

    const analysisResult = await analyzeAlertAndSuggestAction({
      alertTitle: input.alertTitle,
      alertDescription: input.alertDescription,
      knowledgeBaseResults: contextualSolutions.solutions,
    });

    return analysisResult;
  }
);
