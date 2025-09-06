'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import AlertCard from '@/components/dashboard/alert-card';
import AnalysisCard from '@/components/dashboard/analysis-card';
import ActionStatusCard from '@/components/dashboard/action-status-card';
import { mockAlerts, type Alert } from '@/lib/data';
import { runIntelliOpsAgentWithTools } from '@/ai/flows/run-intelliops-agent-with-tools';
import { useToast } from '@/hooks/use-toast';
import { retrieveContextualSolutions } from '@/ai/flows/retrieve-contextual-solutions';
import { executeSuperOpsAction } from '@/services/superops';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';

export type WorkflowState = 'idle' | 'analyzing' | 'awaiting-approval' | 'executing' | 'completed';
export type ActionResult = 'success' | 'failure' | 'rejected' | null;

export default function Home() {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [workflowState, setWorkflowState] = useState<WorkflowState>('idle');
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [actionResult, setActionResult] = useState<ActionResult>(null);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    if (!alert) {
      setAlert(mockAlerts[0]);
    }
  }, [alert]);

  const handleAnalyze = async () => {
    if (!alert) return;
    setWorkflowState('analyzing');
    try {
      const contextualSolutions = await retrieveContextualSolutions({
        alertAnalysis: `${alert.title} ${alert.description}`,
      });

      const result = await runIntelliOpsAgentWithTools({
        alert,
        knowledgeBaseResults: contextualSolutions.solutions,
      });

      setAnalysisResult({
        analysis: result.analysis,
        suggestedAction: result.suggestedAction,
        reasoning: result.reasoning,
        // The payload is now part of the tool call, not the initial analysis
      });
      setWorkflowState('awaiting-approval');
    } catch (error) {
      console.error('Error running IntelliOps agent:', error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "The AI agent failed to process the alert. Please try again.",
      });
      setWorkflowState('idle');
    }
  };

  const handleApprove = async () => {
    if (!analysisResult || !alert) return;
    setWorkflowState('executing');

    try {
      // Here we would get the full tool call details from the agent's turn
      // For this simulation, we'll derive it from the suggested action.
      // In a real scenario, the agent would return a structured tool call.
      const action = analysisResult.suggestedAction;
      let payload: any = { details: analysisResult.reasoning };

      if (action === 'runDiagnosticScript') {
        payload.scriptName = 'network-diagnostic.sh';
      } else if (action === 'restartProcess') {
        payload.processName = 'data-cruncher.py';
      } else if (action === 'deployPatch') {
        // Example patch name, this would come from the agent
        payload.patchName = 'PATCH-CPU-001';
      }


      const toolResponse = await executeSuperOpsAction({
        action: action,
        justification: analysisResult.reasoning,
        payload: payload,
      }, alert);

      console.log('SuperOps Action Result:', toolResponse);

      // Simulate success/failure based on response
      const success = !toolResponse.toLowerCase().includes('failed');
      setActionResult(success ? 'success' : 'failure');
    } catch (error) {
       console.error('Error executing action:', error);
       setActionResult('failure');
    }

    setWorkflowState('completed');
  };

  const handleReject = () => {
    setActionResult('rejected');
    setWorkflowState('completed');
  };
  
  const handleReset = () => {
    const currentAlertIndex = mockAlerts.findIndex(a => a.id === alert?.id);
    setAlert(mockAlerts[currentAlertIndex] || mockAlerts[0]);
    setAnalysisResult(null);
    setActionResult(null);
    setWorkflowState('idle');
  }

  const handleAlertChange = (alertId: string) => {
    const newAlert = mockAlerts.find(a => a.id === alertId);
    if (newAlert) {
      setAlert(newAlert);
      setAnalysisResult(null);
      setActionResult(null);
      setWorkflowState('idle');
    }
  }

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-3">
          <div className="grid gap-8 lg:col-span-2">
            <div className='flex justify-end'>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="alert-selector">Select a Scenario</Label>
                <Select onValueChange={handleAlertChange} defaultValue={alert?.id}>
                  <SelectTrigger id="alert-selector" className="w-full">
                    <SelectValue placeholder="Select an alert scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAlerts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AlertCard 
              alert={alert}
              onAnalyze={handleAnalyze}
              workflowState={workflowState}
            />
            <AnalysisCard 
              workflowState={workflowState}
              result={analysisResult}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </div>
          <div className="lg:col-span-1">
            <ActionStatusCard 
              workflowState={workflowState}
              actionResult={actionResult}
              onReset={handleReset}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
