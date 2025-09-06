'use server';

/**
 * @fileOverview This file defines the main Genkit flow for the IntelliOps agent using tools.
 *
 * - runIntelliOpsAgentWithTools - The main flow that orchestrates alert processing.
 * - RunIntelliOpsAgentWithToolsInput - The input type for the main flow.
 * - RunIntelliOpsAgentWithToolsOutput - The output type for the main flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { executeSuperOpsAction } from '@/services/superops';
import { type Alert } from '@/lib/data';

const RunIntelliOpsAgentWithToolsInputSchema = z.object({
  alert: z.custom<Alert>(),
  knowledgeBaseResults: z.string(),
});
export type RunIntelliOpsAgentWithToolsInput = z.infer<
  typeof RunIntelliOpsAgentWithToolsInputSchema
>;

const RunIntelliOpsAgentWithToolsOutputSchema = z.object({
  analysis: z.string(),
  suggestedAction: z.string(),
  reasoning: z.string(),
});
export type RunIntelliOpsAgentWithToolsOutput = z.infer<
  typeof RunIntelliOpsAgentWithToolsOutputSchema
>;

// Define Tools
const deployPatch = ai.defineTool(
  {
    name: 'deployPatch',
    description: 'Deploys a patch to a specified asset.',
    inputSchema: z.object({
      patchName: z.string().describe('The name of the patch to deploy.'),
      justification: z.string().describe('Why this patch should be deployed.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    return `Patch deployment for "${input.patchName}" initiated.`;
  }
);

const runDiagnosticScript = ai.defineTool(
  {
    name: 'runDiagnosticScript',
    description: 'Runs a diagnostic script on an asset.',
    inputSchema: z.object({
      scriptName: z.string().describe('The name of the script to run.'),
      justification: z.string().describe('Why this script should be run.'),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    return `Diagnostic script "${input.scriptName}" is executing.`;
  }
);

const escalateToHuman = ai.defineTool(
  {
    name: 'escalateToHuman',
    description: 'Escalates the issue to a human operator for manual review.',
    inputSchema: z.object({
      reason: z
        .string()
        .describe(
          'The reason for escalation and a summary of the situation.'
        ),
    }),
    outputSchema: z.string(),
  },
  async (input) => {
    return `Issue escalated to human operator. Reason: ${input.reason}`;
  }
);

export async function runIntelliOpsAgentWithTools(
  input: RunIntelliOpsAgentWithToolsInput
): Promise<RunIntelliOpsAgentWithToolsOutput> {
  const runIntelliOpsAgentWithToolsFlow = ai.defineFlow(
    {
      name: 'runIntelliOpsAgentWithToolsFlow',
      inputSchema: RunIntelliOpsAgentWithToolsInputSchema,
      outputSchema: RunIntelliOpsAgentWithToolsOutputSchema,
    },
    async (input) => {
      const prompt = `You are IntelliOps, an autonomous AI agent for IT Operations. Your goal is to resolve issues efficiently and safely.
  
      Analyze the following alert. Based on the information and the provided knowledge base context, determine the most appropriate next step.
      Your available actions are to deploy a patch, run a diagnostic script, or escalate to a human. You must choose only one action.
  
      Alert Title: ${input.alert.title}
      Alert Description: ${input.alert.description}
      Knowledge Base Context: ${input.knowledgeBaseResults}
      `;

      const { output } = await ai.generate({
        prompt,
        model: 'googleai/gemini-1.5-pro-001',
        tools: [deployPatch, runDiagnosticScript, escalateToHuman],
        output: {
          schema: RunIntelliOpsAgentWithToolsOutputSchema,
          format: 'json',
        },
      });

      if (!output) {
        throw new Error('AI agent did not return a response.');
      }
      
      const toolResponse = await executeSuperOpsAction({
        action: output.suggestedAction,
        justification: output.reasoning,
        payload: { 
          scriptName: output.suggestedAction === 'runDiagnosticScript' ? 'diagnostic.sh' : undefined,
          details: output.reasoning 
        }
      }, input.alert);

      console.log('SuperOps Action Result:', toolResponse);

      return output;
    }
  );

  return runIntelliOpsAgentWithToolsFlow(input);
}
