import axios from 'axios';
import { type Alert } from '@/lib/data';

interface AIResponse {
  action: 'DEPLOY_PATCH' | 'RUN_DIAGNOSTIC_SCRIPT' | 'ESCALATE' | string;
  justification: string;
  payload: {
    scriptName?: string;
    details?: string;
    patchName?: string;
  };
}

export async function executeSuperOpsAction(
  aiResponse: AIResponse,
  alert: Alert
): Promise<string> {
  const apiKey = process.env.SUPER_OPS_API_KEY;
  const apiEndpoint = process.env.SUPER_OPS_API_ENDPOINT;

  if (!apiKey || !apiEndpoint) {
    throw new Error('SuperOps API credentials are not configured.');
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    switch (aiResponse.action) {
      case 'DEPLOY_PATCH':
        console.log(`Deploying patch: ${aiResponse.payload.patchName}`);
        await axios.post(
          `${apiEndpoint}/patches/deploy`,
          {
            assetId: alert.assetId,
            patchName: aiResponse.payload.patchName,
            details: aiResponse.payload.details,
          },
          { headers }
        );
        return 'Patch deployment initiated successfully.';

      case 'RUN_DIAGNOSTIC_SCRIPT':
        console.log(`Running script: ${aiResponse.payload.scriptName}`);
        await axios.post(
          `${apiEndpoint}/scripts/run`,
          {
            assetId: alert.assetId,
            scriptName: aiResponse.payload.scriptName,
          },
          { headers }
        );
        return 'Diagnostic script started successfully.';

      case 'ESCALATE':
        console.log('Escalating ticket...');
        await axios.put(
          `${apiEndpoint}/tickets/${alert.ticketId}/comment`,
          {
            comment: `Escalation by IntelliOps Agent:
Justification: ${aiResponse.justification}
Details: ${aiResponse.payload.details}`,
          },
          { headers }
        );
        return 'Ticket escalated with a comment successfully.';

      default:
        throw new Error(`Unknown action: ${aiResponse.action}`);
    }
  } catch (error) {
    console.error('Failed to execute SuperOps action:', error);
    if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
        });
        return `Failed to execute action. API responded with status ${error.response?.status}.`;
    }
    return `Failed to execute action: ${error instanceof Error ? error.message : 'An unknown error occurred'}`;
  }
}
